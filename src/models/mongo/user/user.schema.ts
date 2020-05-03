import {Schema} from "mongoose";
import {USER_STATUS} from '../../../utils/constants'
import bcrypt from 'bcrypt'
import { IUserModel } from "./user.interface";

export const UserSchema: Schema = new Schema({

    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, default: null, required: true},
    age: {type: Number, default: 0},
    uuid: {type: String, unique: true, default: null},
    status: {type: String, default: USER_STATUS.ACTIVE},

}, {timestamps: {createdAt: 'createdAt', updatedAt: 'updatedAt'}}, );

UserSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret, options) => {
        delete ret.__v;
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.createdAt;
        delete ret.updatedAt;
    },
});

// hash plain text password before saving
UserSchema.pre<IUserModel>("save", async function(next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8)
  }
});