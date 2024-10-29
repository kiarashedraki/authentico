import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  googleId?: string;
  displayName: string;
  email: string;
  password?: string;
}

const userSchema: Schema<IUser> = new Schema({
  googleId: { type: String },
  displayName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;
