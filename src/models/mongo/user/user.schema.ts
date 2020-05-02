import {Schema} from "mongoose";
import {USER_STATUS} from '../../../utils/constants'

export const UserSchema: Schema = new Schema({

    name: {type: String, default: null},
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