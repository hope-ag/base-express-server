import { hash } from 'bcrypt';
import { CreateUserDto } from '@dtos/users.dto';
import { BadRequest, Conflict } from 'http-errors';
import { User } from '@interfaces/users.interface';
import userModel from '@models/users';
import { isEmpty } from '@utils/basic';

class UserService {
  public users = userModel;

  public async findAllUser(): Promise<User[]> {
    const users: User[] = await this.users.find();
    return users;
  }

  public async findUserById(userId: string): Promise<User> {
    if (isEmpty(userId)) throw new BadRequest('User ID must not be empty');

    const findUser: User = await this.users.findOne({ _id: userId });
    if (!findUser) throw new Conflict(`Account does not exist`);

    return findUser;
  }

  public async createUser(userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new BadRequest('User data must not be empty');

    const findUser: User = await this.users.findOne({ email: userData.email });
    if (findUser) throw new Conflict(`Account with this email already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: User = await this.users.create({
      ...userData,
      password: hashedPassword
    });

    return createUserData;
  }

  public async updateUser(userId: string, userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new BadRequest('User data must not be empty');

    if (userData.email) {
      const findUser: User = await this.users.findOne({
        email: userData.email
      });
      if (findUser && findUser._id != userId)
        throw new Conflict(`Account with this email already exists`);
    }

    if (userData.password) {
      const hashedPassword = await hash(userData.password, 10);
      userData = { ...userData, password: hashedPassword };
    }

    const updateUserById: User = await this.users.findByIdAndUpdate(userId, {
      userData
    });
    if (!updateUserById) throw new Conflict(`The account you are trying to update does not exist`);

    return updateUserById;
  }

  public async deleteUser(userId: string): Promise<User> {
    const deleteUserById: User = await this.users.findByIdAndDelete(userId);
    if (!deleteUserById) throw new Conflict('Account not found');

    return deleteUserById;
  }
}

export default UserService;
