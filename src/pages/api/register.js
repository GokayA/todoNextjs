import connectMongo from '@/lib/mongodb';
import User from '@/models/user';
import bcyrpt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'POST':
      try {
        await connectMongo();
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: 'Email already exists' });
        }
        const hashedPassword = await bcyrpt.hash(password, 12);
        const user = await User.create({
          username,
          email,
          password: hashedPassword,
        });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

        res.status(201).json({ userId: user, token });
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server Error' });
      }
      break;
    default:
      res.status(405).json({ message: 'Method not allowed' });
      break;
  }
}
