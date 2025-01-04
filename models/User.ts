import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './IUser';

const userSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    mobileNumber: { type: Number, unique: true, required: true },
    address: { type: String, required: true },
    postCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Method to increment post count
userSchema.methods.incrementPostCount = async function () {
  this.postCount += 1;
  await this.save();
};

const User = mongoose.model<IUser>('User', userSchema);

export default User;
