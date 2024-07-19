import mongoose from 'mongoose'
//import User from "../models/user.js"




const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    tags: {
      type: Array,
      default: [],
    },
    text: {
      type: String,
      required: true,
      unique: true,
    },
    imageUrl: String,
    likes: {
      type: Number,
      default: 0
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Post', PostSchema);



