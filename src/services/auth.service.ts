import { hash, compare } from 'bcrypt';
import { BadRequest, Conflict, Unauthorized, InternalServerError } from 'http-errors';
import { User, UserLoginData } from '@interfaces/users.interface';
import userModel from '@/database/models/users';
import { isEmpty } from '@common/utils/basic';
import { createCookie, createToken, extractTokenData } from '@/common/utils/tokens';

class AuthService {
  public users = userModel;

  public async signup(userData: UserLoginData): Promise<User> {
    if (isEmpty(userData)) throw new BadRequest('errorMessages.dataMustNotBeEmpty');

    const foundUser: User = await this.users.findOne({ email: userData.email });
    if (foundUser) throw new Conflict(`errorMessages.emailExists`);

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: User = await this.users.create({
      ...userData,
      password: hashedPassword
    });

    if (!createUserData) throw new InternalServerError('errorMessages.couldNotCreateUser');

    return createUserData;
  }

  public async login(userData: UserLoginData): Promise<{
    cookie: string;
    data: {
      accessToken: string;
      user: User;
    };
  }> {
    if (isEmpty(userData)) throw new BadRequest('errorMessages.dataMustNotBeEmpty');

    const foundUser = (await this.users.findOne({ email: userData.email }))?.toJSON();
    if (!foundUser) throw new Unauthorized('errorMessages.incorrectEmailOrPassword');

    const isPasswordMatching: boolean = await compare(userData.password, foundUser.password);
    if (!isPasswordMatching) throw new Unauthorized('errorMessages.incorrectEmailOrPassword');

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
    id: string,
    token: string
  ): Promise<{ accessToken: string; foundUser: User; cookie: string }> {
    if (isEmpty(id)) throw new Unauthorized('errorMessages.missingToken');
    const foundUser = await this.users.findById(id, '-password');
    if (!foundUser) throw new Unauthorized('errorMessages.resourceNotFound');
    if (foundUser.meta.refreshToken !== token) throw new Unauthorized('errorMessages.invalidToken');
    const refreshToken = createToken(foundUser, 'refresh');
    const newAccessToken = createToken(foundUser, 'access');
    const cookie = createCookie(refreshToken);
    const sanitizedData = { ...foundUser.toJSON(), meta: undefined };
    foundUser.meta.refreshToken = refreshToken.token;
    await foundUser.save();
    return { accessToken: newAccessToken.token, foundUser: sanitizedData, cookie };
  }

  public async logout(userData: User): Promise<User> {
    if (isEmpty(userData)) throw new BadRequest('errorMessages.dataMustNotBeEmpty');

    const foundUser: User = await this.users.findOne({
      email: userData.email,
      password: userData.password
    });
    if (!foundUser) throw new Conflict('errorMessages.accountDoesNotExist');

    this.users.findByIdAndUpdate(foundUser._id, { 'meta.refreshToken': '' });

    return foundUser;
  }
}
export default AuthService;
