import mongoose, { Schema, Document } from 'mongoose';
import { IPost } from './IPost';

const postSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    images: { type: [String], required: true }, 
  },
  { timestamps: true }
);

const Post = mongoose.model<IPost>('Post', postSchema);

export default Post;
