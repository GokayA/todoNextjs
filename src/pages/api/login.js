import connectMongo from '@/lib/mongodb';
import User from '@/models/user';
import bcyrpt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function handler(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'missing credentials' });
  }
  const { method } = req;
  switch (method) {
    case 'POST':
      try {
        await connectMongo();
        const user = await User.findOne({ email });
        if (!user) {
          return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isPasswordCorrect = await bcyrpt.compare(password, user.password);
        if (!isPasswordCorrect) {
          return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        res.status(200).json({ userId: user, token });
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server not working' });
      }
      break;
    default:
      res.status(404).json({ message: 'method not allowed' });
      break;
  }
}

export default handler;
