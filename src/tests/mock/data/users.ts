import { User } from '@/interfaces/users.interface';
import { randEmail, randPassword, randUuid } from '@ngneat/falso';
export const mockUserRegistrationData = () => {
  const email = randEmail();
  const password = randPassword() + '22@#';
  return {
    email,
    password
  };
};

export const mockDBUsers = (number = 10) => {
  const users: User[] = [];
  for (let i = 0; i < number; i++) {
    users.push({
      _id: randUuid(),
      email: randEmail(),
      password: randPassword(),
      role: 'user',
      meta: {
        refreshToken: '',
        passwordResetToken: '',
        passwordResetExpires: null
      }
    });
  }
  return users;
};
