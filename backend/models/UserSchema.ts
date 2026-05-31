import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

// 1. Interface for the Document
export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  zipcode: string; 
  role: 'user' | 'owner' | 'admin';
  createdAt: Date;
}

// 2. Schema Definition
const UserSchema: Schema<IUser> = new Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  zipcode: { type: String, required: true },
  role: { type: String, enum: ['user', 'owner', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

// 3. Type-Safe Pre-Save Middleware Hook
// The <IUser> type parameter tells Mongoose and TypeScript that 'this' 
// refers to the document instance matching our IUser interface.
UserSchema.pre<IUser>('save', async function() {
  // If the password field hasn't been modified, skip hashing
  if (!this.isModified('password')) return;

  // Hash the password with a salt round of 12
  this.password = await bcrypt.hash(this.password, 12);
});

// 4. Model Export
export default mongoose.model<IUser>('User', UserSchema);