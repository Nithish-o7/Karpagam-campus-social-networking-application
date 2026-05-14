/**
 * KCE Connect — Utility Functions
 * Phase 2: Full implementation. Stubs documented here.
 */

/**
 * Format a timestamp for display in the social feed.
 * e.g. "2 hours ago", "Yesterday", "Apr 3"
 */
export const formatRelativeTime = (isoTimestamp: string): string => {
  const date = new Date(isoTimestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
};

/**
 * Validate that an email is a valid @kce.ac.in address.
 * Enforces exclusive KCE user access per the authentication requirement.
 */
export const isValidKceEmail = (email: string): boolean => {
  return /^[a-zA-Z0-9._%+-]+@kce\.ac\.in$/.test(email);
};

/**
 * Get initials from a full name for avatar fallback.
 * e.g. "Nithish Kanna" → "NK"
 */
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('');
};

/**
 * Get the CSS class name for a ticket badge based on its state.
 */
export const getTicketBadgeClass = (state: string): string => {
  switch (state) {
    case 'Resolved':    return 'badge badge-resolved';
    case 'In Progress': return 'badge badge-progress';
    case 'New':
    default:            return 'badge badge-pending';
  }
};

/**
 * Get the CSS class name for a user role badge.
 */
export const getRoleBadgeClass = (role: string): string => {
  return `badge badge-${role}`;
};
