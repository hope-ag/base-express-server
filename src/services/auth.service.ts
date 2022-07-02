import { hash, compare } from 'bcrypt';
import { BadRequest, Conflict, Unauthorized, InternalServerError } from 'http-errors';
import { User, UserLoginData } from '@interfaces/users.interface';
import userModel from '@models/users';
import { isEmpty } from '@common/utils/basic';
import { createCookie, createToken, extractTokenData } from '@common/utils/auth';

class AuthService {
  public users = userModel;

  public async signup(userData: UserLoginData): Promise<User> {
    if (isEmpty(userData)) throw new BadRequest('dataMustNotBeEmpty');

    const foundUser: User = await this.users.findOne({ email: userData.email });
    if (foundUser) throw new Conflict(`emailExists`);

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: User = await this.users.create({
      ...userData,
      password: hashedPassword
    });

    if (!createUserData) throw new InternalServerError('couldNotCreateUser');

    return createUserData;
  }

  public async login(userData: UserLoginData): Promise<{
    cookie: string;
    data: {
      accessToken: string;
      user: User;
    };
  }> {
    if (isEmpty(userData)) throw new BadRequest('dataMustNotBeEmpty');

    const foundUser = (await this.users.findOne({ email: userData.email })).toJSON();
    if (!foundUser) throw new Unauthorized('emailExists');

    const isPasswordMatching: boolean = await compare(userData.password, foundUser.password);
    if (!isPasswordMatching) throw new Conflict('incorrectEmailOrPassword');

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

  public async refreshToken(token: string): Promise<{ accessToken: string; foundUser: User }> {
    if (isEmpty(token)) throw new Unauthorized('missingToken');
    //extract userId from token
    const { _id } = extractTokenData(token, 'refresh');
    if (isEmpty(_id)) throw new Unauthorized('invalidToken');
    const foundUser = (await this.users.findById(_id, '-password')).toJSON();
    if (!foundUser) throw new Unauthorized('resourceNotFound');
    if (foundUser.meta.refreshToken !== token) throw new Unauthorized('invalidToken');
    const newAccessToken = createToken(foundUser, 'access');
    const sanitizedData = { ...foundUser, meta: undefined };
    return { accessToken: newAccessToken.token, foundUser: sanitizedData };
  }

  public async logout(userData: User): Promise<User> {
    if (isEmpty(userData)) throw new BadRequest('dataMustNotBeEmpty');

    const foundUser: User = await this.users.findOne({
      email: userData.email,
      password: userData.password
    });
    if (!foundUser) throw new Conflict('accountDoesNotExist');

    this.users.findByIdAndUpdate(foundUser._id, { 'meta.refreshToken': '' });

    return foundUser;
  }
}
export default AuthService;
