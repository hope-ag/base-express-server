import { hash } from 'bcrypt';
import { BadRequest, Conflict } from 'http-errors';
import { User } from '@interfaces/users.interface';
import userModel from '@/database/models/users';
import { isEmpty } from '@common/utils/basic';

class UserService {
  public users = userModel;

  public async findAllUser(): Promise<User[]> {
    return this.users.find();
  }

  public async findUserById(userId: string): Promise<User> {
    if (isEmpty(userId)) throw new BadRequest('User ID must not be empty');

    const findUser: User = await this.users.findOne({ _id: userId });
    if (!findUser) throw new Conflict(`errorMessages.accountDoesNotExist`);

    return findUser;
  }

  public async createUser(userData: User): Promise<User> {
    if (isEmpty(userData)) throw new BadRequest('User data must not be empty');

    const findUser: User = await this.users.findOne({ email: userData.email });
    if (findUser) throw new Conflict(`errorMessages.emailExists`);

    const hashedPassword = await hash(userData.password, 10);
    return await this.users.create({
      ...userData,
      password: hashedPassword
    });
  }

  public async updateUser(userId: string, userData: User): Promise<User> {
    if (isEmpty(userData)) throw new BadRequest('errorMessages.dataMustNotBeEmpty');

    if (userData.email) {
      const findUser: User = await this.users.findOne({
        email: userData.email
      });
      if (findUser && findUser._id != userId) throw new Conflict(`errorMessages.emailExists`);
    }

    if (userData.password) {
      const hashedPassword = await hash(userData.password, 10);
      userData = { ...userData, password: hashedPassword };
    }

    const updateUserById: User = await this.users.findByIdAndUpdate(userId, {
      userData
    });
    if (!updateUserById) throw new Conflict(`errorMessages.accountDoesNotExist`);

    return updateUserById;
  }

  public async deleteUser(userId: string): Promise<User> {
    const deleteUserById: User = await this.users.findByIdAndDelete(userId);
    if (!deleteUserById) throw new Conflict('errorMessages.accountDoesNotExist');

    return deleteUserById;
  }
}

export default UserService;
