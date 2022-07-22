import { UserFields } from '@interfaces/users.interface';
import userModel from '@/database/models/users';
import { isEqual } from 'lodash';

export function getOneUser(query: Record<UserFields, any>, format: string) {
  if (isEqual(['_id'], Object.keys(query))) {
    return userModel.findById(query._id, format);
  } else {
    return userModel.findOne(query, format);
  }
}
