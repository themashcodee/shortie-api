import mongoose, { mongo } from "mongoose";

interface User {
  name: string;
  password: string;
  links?: {}[];
}

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
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const model = mongoose.model<User>("user", schema);
export default model;
