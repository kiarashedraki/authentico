import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  googleId: string;
  displayName: string;
  email: string;
}

const userSchema: Schema<IUser> = new Schema({
  googleId: { type: String, required: true },
  displayName: { type: String, required: true },
  email: { type: String, required: true },
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;
