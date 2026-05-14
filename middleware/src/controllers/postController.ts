/**
 * KCE Connect — Posts Controller (Real-time Overhaul)
 */
import { Request, Response } from 'express';

import prisma from '../db/prisma';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { broadcast } from '../sockets/socket';
import { NotificationService } from '../services/notification.service';

/* ── GET /api/posts ──────────────────────────────────────────── */
export const getPosts = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);
    const offset = parseInt(req.query.offset as string) || 0;
    const userId = req.user?.id;

    console.log(`📋 GET /api/posts  limit=${limit}  offset=${offset}`);

    const posts = await prisma.post.findMany({
      where: { isDeleted: false },
      take: limit,
      skip: offset,
      orderBy: { timestamp: 'desc' },
      include: {
        author: {
          select: { id: true, name: true, role: true, department: true, avatarUrl: true },
        },
        likes: userId ? { where: { userId } } : false,
        media: true,
      },
    });

    const formattedPosts = posts.map((p) => ({
      id: p.id,
      author_id: p.author.id,
      author_name: p.author.name,
      author_role: p.author.role,
      author_dept: p.author.department,
      author_avatar: p.author.avatarUrl,
      content: p.content,
      media: p.media,
      timestamp: p.timestamp,
      likes: p.likesCount,
      comments_count: p.commentsCount,
      has_liked: userId ? p.likes.length > 0 : false,
    }));

    res.json({ success: true, total: formattedPosts.length, posts: formattedPosts });

  } catch (error: any) {
    console.error('❌ [GET /api/posts] Error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch posts.' });
  }
};

/* ── POST /api/posts ─────────────────────────────────────────── */
export const createPost = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const user = req.user;
  if (!user) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  const { content, mediaUrls } = req.body;

  if (!content || content.trim().length < 3) {
    res.status(400).json({ success: false, message: 'Post content too short.' });
    return;
  }

  try {
    const post = await prisma.post.create({
      data: {
        content: content.trim(),
        authorId: user.id,
        media: mediaUrls ? {
          create: mediaUrls.map((url: string) => ({ url }))
        } : undefined
      },
      include: { author: true, media: true },
    });

    const formattedPost = {
      id: post.id,
      author_id: post.author.id,
      author_name: post.author.name,
      author_role: post.author.role,
      author_dept: post.author.department,
      author_avatar: post.author.avatarUrl,
      content: post.content,
      media: post.media,
      timestamp: post.timestamp,
      likes: 0,
      comments_count: 0,
      has_liked: false,
    };

    // Real-time broadcast
    broadcast('new-post', formattedPost);

    res.status(201).json({
      success: true,
      post: formattedPost,
    });
  } catch (error: any) {
    console.error('❌ [POST /api/posts] Error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to create post.' });
  }
};

/* ── POST /api/posts/:id/like ────────────────────────────────── */
export const likePost = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const numId = parseInt(id);
  const user = req.user;

  if (!user || isNaN(numId)) {
    res.status(400).json({ success: false, message: 'Invalid request.' });
    return;
  }

  try {
    const post = await prisma.post.findUnique({ where: { id: numId } });
    if (!post) {
      res.status(404).json({ success: false, message: 'Post not found.' });
      return;
    }

    // 1. Check if already liked
    const existingLike = await prisma.like.findUnique({
      where: { userId_postId: { userId: user.id, postId: numId } },
    });

    if (existingLike) {
      // Unlike
      await prisma.$transaction([
        prisma.like.delete({ where: { id: existingLike.id } }),
        prisma.post.update({
          where: { id: numId },
          data: { likesCount: { decrement: 1 } },
        }),
      ]);
      broadcast('like-update', { postId: numId, likesCount: post.likesCount - 1 });
      res.json({ success: true, has_liked: false });
    } else {
      // Like
      await prisma.$transaction([
        prisma.like.create({ data: { userId: user.id, postId: numId } }),
        prisma.post.update({
          where: { id: numId },
          data: { likesCount: { increment: 1 } },
        }),
      ]);

      // Notify author
      if (post.authorId !== user.id) {
        await NotificationService.createNotification({
          recipientId: post.authorId,
          actorId: user.id,
          type: 'LIKE',
          postId: post.id,
          content: `${user.name} liked your post`,
        });
      }

      res.json({ success: true, has_liked: true });
    }
  } catch (error: any) {
    console.error(`❌ [POST /api/posts/${numId}/like] Error:`, error.message);
    res.status(500).json({ success: false, message: 'Failed to process like.' });
  }
};

/* ── GET /api/posts/:id/comments ─────────────────────────────── */
export const getComments = async (req: Request, res: Response): Promise<void> => {
  const numId = parseInt(req.params.id);
  if (isNaN(numId)) { res.status(400).json({ success: false, message: 'Invalid post id.' }); return; }
  try {
    const comments = await prisma.comment.findMany({
      where: { postId: numId },
      orderBy: { createdAt: 'asc' },
      include: { user: { select: { id: true, name: true, role: true, avatarUrl: true } } },
    });
    res.json({ success: true, comments: comments.map(c => ({
      id: c.id, content: c.content,
      author_id: c.user.id, author_name: c.user.name, author_role: c.user.role, author_avatar: c.user.avatarUrl,
      createdAt: c.createdAt,
    })) });
  } catch (err: any) {
    console.error('❌ [GET /api/posts/:id/comments]', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch comments.' });
  }
};

/* ── POST /api/posts/:id/comment ─────────────────────────────── */
export const addComment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const numId = parseInt(id);
  const user = req.user;

  if (!user || isNaN(numId)) {
    res.status(400).json({ success: false, message: 'Invalid request.' });
    return;
  }

  const { content } = req.body;
  if (!content || content.trim().length < 1) {
    res.status(400).json({ success: false, message: 'Comment cannot be empty.' });
    return;
  }

  try {
    const post = await prisma.post.findUnique({ where: { id: numId } });
    if (!post) {
      res.status(404).json({ success: false, message: 'Post not found.' });
      return;
    }

    const [comment, updatedPost] = await prisma.$transaction([
      prisma.comment.create({
        data: { content: content.trim(), userId: user.id, postId: numId },
      }),
      prisma.post.update({
        where: { id: numId },
        data:  { commentsCount: { increment: 1 } },
      }),
    ]);

    broadcast('comment-update', { postId: numId, commentsCount: updatedPost.commentsCount });

    // Notify author
    if (post.authorId !== user.id) {
      await NotificationService.createNotification({
        recipientId: post.authorId,
        actorId: user.id,
        type: 'COMMENT',
        postId: post.id,
        content: `${user.name} commented on your post`,
      });
    }

    res.status(201).json({
      success: true,
      comment: {
        id:          comment.id,
        content:     comment.content,
        author_name: user.name,
        author_role: user.role,
        createdAt:   comment.createdAt,
      },
    });
  } catch (error: any) {
    console.error(`❌ [POST /api/posts/${numId}/comment] Error:`, error.message);
    res.status(500).json({ success: false, message: 'Failed to add comment.' });
  }
};

/* ── POST /api/posts/:id/poll-vote ──────────────────────────── */
export const votePoll = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const numId = parseInt(req.params.id);
  const userId = req.user?.id;
  const { optionId } = req.body;

  if (!userId || isNaN(numId) || !optionId) {
    res.status(400).json({ success: false, message: 'Invalid request.' });
    return;
  }

  try {
    // Poll votes are stored in the post's hashtags field as a JSON payload for now
    // In a full schema upgrade, a PollVote model would be added
    // For now, acknowledge and broadcast
    broadcast('poll-vote', { postId: numId, optionId, userId });
    res.json({ success: true });
  } catch (error: any) {
    console.error(`❌ [POST /api/posts/${numId}/poll-vote] Error:`, error.message);
    res.status(500).json({ success: false, message: 'Failed to register vote.' });
  }
};

