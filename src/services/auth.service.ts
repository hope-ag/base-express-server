import { hash, compare } from 'bcrypt';
import { CreateUserDto } from '@dtos/users.dto';
import { BadRequest, Conflict, Unauthorized } from 'http-errors';
import { User } from '@interfaces/users.interface';
import userModel from '@/models/users';
import { isEmpty } from '@core/utils/util';
import { createCookie, createToken, extractTokenData } from '@/core/utils/auth';

class AuthService {
  public users = userModel;

  public async signup(userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new BadRequest('User data must not be empty');

    const foundUser: User = await this.users.findOne({ email: userData.email });
    if (foundUser) throw new Conflict(`Account with this email already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: User = await this.users.create({
      ...userData,
      password: hashedPassword
    });

    return createUserData;
  }

  public async login(userData: CreateUserDto): Promise<{
    cookie: string;
    data: {
      accessToken: string;
      user: User;
    };
  }> {
    if (isEmpty(userData))
      throw new BadRequest('Please provide login credentials');

    const foundUser = (
      await this.users.findOne({ email: userData.email })
    ).toJSON();
    if (!foundUser)
      throw new Unauthorized('Account with this email does not exist');

    const isPasswordMatching: boolean = await compare(
      userData.password,
      foundUser.password
    );
    if (!isPasswordMatching)
      throw new Conflict('Email or password is incorrect');

    const refreshToken = createToken(foundUser, 'refresh');
    const accessToken = createToken(foundUser, 'access');
    const cookie = createCookie(refreshToken);

    //store token in db on meta.refreshToken
    await this.users.findByIdAndUpdate(foundUser._id, {
      'meta.refreshToken': refreshToken.token
    });

    return {
      cookie,
      data: {
        accessToken: accessToken.token,
        user: { ...foundUser, meta: undefined, password: undefined }
      }
    };
  }

  public async refreshToken(
    token: string
  ): Promise<{ accessToken: string; foundUser: User }> {
    if (isEmpty(token)) throw new Unauthorized('Token must not be empty');
    //extract userId from token
    const { _id } = extractTokenData(token, 'refresh');
    if (isEmpty(_id)) throw new Unauthorized('Invalid token');
    const foundUser = (await this.users.findById(_id, '-password')).toJSON();
    if (!foundUser) throw new Unauthorized('User does not exist');
    if (foundUser.meta.refreshToken !== token)
      throw new Unauthorized('Invalid token');
    const newAccessToken = createToken(foundUser, 'access');
    const sanitizedData = { ...foundUser, meta: undefined };
    return { accessToken: newAccessToken.token, foundUser: sanitizedData };
  }

  public async logout(userData: User): Promise<User> {
    if (isEmpty(userData)) throw new BadRequest('User data must not be empty');

    const foundUser: User = await this.users.findOne({
      email: userData.email,
      password: userData.password
    });
    if (!foundUser) throw new Conflict('Account does not exist');

    //remove token from db on meta.refreshToken
    this.users.updateOne({ _id: foundUser._id }, { 'meta.refreshToken': '' });

    return foundUser;
  }
}
export default AuthService;
