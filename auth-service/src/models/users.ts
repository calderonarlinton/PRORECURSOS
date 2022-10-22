import { Schema, model, HydratedDocumentFromSchema, Model, Types, HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { BadRequestError } from '@angelgoezg/common';
import jwt from 'jsonwebtoken';

interface IToken {
  token: string;
}

interface IUser {
  name: string;
  pwd: string;
  username: string;
  email: string;
  userType: string;
  tokens: IToken[];

  generateAuthToken(): Promise<string>;
}

interface UserModel extends Model<IUser> {
  findUserByCredentials(email: string, pwd: string): Promise<UserDocument>;
}

const TokenSchema = new Schema<IToken>({
  token: {
    type: String,
    trim: true,
    require: true
  },
});

const UserSchema = new Schema<IUser, UserModel>({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  pwd: {
    type: String,
    trim: true,
    required: true,
  },
  username: {
    type: String,
    trim: true,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    required: true,
  },
  userType: {
    type: String,
    trim: true,
    required: true
  },
  tokens: [TokenSchema],
}, { timestamps: true });

type UserDocument = HydratedDocument<IUser, UserModel>;

UserSchema.methods.toJSON = function () {
  const user = this as UserDocument;
  const userObj = user.toObject() as Partial<UserDocument>;
  delete userObj.pwd;
  return userObj;
};

UserSchema.static('findUserByCredentials', async function (email: string, pwd: string) {
  const user = await User.findOne({email});
  if (!user) {
    throw new BadRequestError('User not found');
  }

  const isPwdMatched = await bcrypt.compare(pwd, user.pwd!);
  if (!isPwdMatched) {
    throw new BadRequestError('User not found');
  }

  return user;
});

UserSchema.method('generateAuthToken', async function () {
  const user = this as UserDocument;
  const token = jwt.sign({_id: user.id.toString()}, process.env.JWT_TOKEN!);
  user.tokens = [...user.tokens, {token}];
  await user.save();
  return token;
});

UserSchema.pre('save', async function (next) {
  console.log('Antes de guardar', this);
  const user = this as UserDocument;
  if (user.isModified('pwd')) {
    user.pwd = await bcrypt.hash(user.pwd!, 10);
  }
  next();
});

const User = model<IUser, UserModel>('User', UserSchema);

export { User };