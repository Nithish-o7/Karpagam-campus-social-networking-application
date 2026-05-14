import axios from 'axios';
import jwt from 'jsonwebtoken';

const userId = 1;
const secret = 'KCE_Connect_Phase12_Jwt$ecret_2026!xE3qWpL9mN7vR0kA';
const token = jwt.sign({ id: userId, email: 'charukesh@kce.ac.in', role: 'student', name: 'Charukesh', department: 'Computer Science', rollNumber: '717823S107' }, secret);

async function testUpdate() {
  try {
    const res = await axios.patch('http://localhost:3001/api/auth/profile', 
      { bio: 'Testing DB from agent script' },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('Update Success:', res.data);
  } catch (err: any) {
    console.error('Update Failed:', err.response?.data || err.message);
  }
}

testUpdate();
