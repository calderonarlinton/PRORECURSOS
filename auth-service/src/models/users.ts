import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  name: {
    type: String,
    trim: true,
  },
  pwd: {
    type: String,
    trim: true,
  },
  username: {
    type: String,
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
  },
  userType: {
    type: String,
    trim: true,
  },
}, { timestamps: true });

const User = model('User', UserSchema);

export { User };