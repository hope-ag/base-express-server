import { model, Schema } from 'mongoose';
import { User, UserRoles } from '@interfaces/users.interface';

const userSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: UserRoles,
      default: 'user'
    },
    meta: {
      refreshToken: {
        type: String,
        required: false,
        default: null
      },
      passwordResetToken: {
        type: String,
        required: false,
        default: null
      },
      passwordResetExpires: {
        type: Date,
        required: false,
        default: null
      }
    }
  },
  { timestamps: true }
);
const userModel = model<User>('User', userSchema);

export default userModel;
