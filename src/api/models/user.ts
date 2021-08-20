import mongoose from "mongoose";

interface User {
  name: string;
  password: string;
  links?: [Link];
}
export interface Link {
  shortUrl: string;
  longUrl: string;
  visits?: number;
}

const linkSchema = new mongoose.Schema<Link>(
  {
    shortUrl: {
      required: true,
      type: String,
    },
    longUrl: {
      required: true,
      type: String,
    },
    visits: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const schema = new mongoose.Schema<User>(
  {
    email: {
      required: true,
      type: String,
    },
    password: {
      required: true,
      type: String,
      min: 8,
    },
    links: {
      type: [linkSchema],
      default: [],
    },
  },
  { timestamps: true }
);

const model = mongoose.model<User>("user", schema);
export default model;
