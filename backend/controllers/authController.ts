import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/UserSchema'; 

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key';

// 🚀 Helper rewritten to include id, email, and full name into the JWT payload
const signToken = (id: string, email: string, name: string): string => {
  return jwt.sign(
    { id, email, name }, 
    JWT_SECRET, 
    { expiresIn: '7d' }
  );
};

export const signUp = async (req: Request, res: Response): Promise<void | Response> => {
  try {
    const { firstName, lastName, email, password, zipcode, role } = req.body;

    if (!firstName || !lastName || !email || !password || !zipcode) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const newUser = await User.create({ firstName, lastName, email, password, zipcode, role });
    
    // 🚀 Pass id, email, and full concatenated name to the fresh token signature block
    const fullName = `${newUser.firstName} ${newUser.lastName}`;
    const token = signToken(newUser._id.toString(), newUser.email, fullName);

    return res.status(201).json({
      success: true,
      token,
      data: { 
        user: { 
          id: newUser._id.toString(), 
          firstName: newUser.firstName, 
          lastName: newUser.lastName, 
          email: newUser.email, 
          zipcode: newUser.zipcode,
          role: newUser.role 
        } 
      }
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during sign up';
    return res.status(400).json({ success: false, message: errorMessage });
  }
};

export const login = async (req: Request, res: Response): Promise<void | Response> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Incorrect email or password' });
    }

    // 🚀 Pass id, email, and full concatenated name to the fresh token signature block here too
    const fullName = `${user.firstName} ${user.lastName}`;
    const token = signToken(user._id.toString(), user.email, fullName);
    
    return res.status(200).json({
      success: true,
      token,
      data: { 
        user: { 
          id: user._id.toString(), 
          firstName: user.firstName, 
          lastName: user.lastName, 
          email: user.email 
        } 
      }
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return res.status(500).json({ success: false, error: errorMessage });
  }
};