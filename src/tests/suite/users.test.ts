import request from 'supertest';
import { usersRoute } from '@routes/users.route';
import app from '@/app';
import { mockDBUsers } from '../mock/data/users';

describe('Testing Users', () => {
  const mockUsers = mockDBUsers(5);
  const users = usersRoute.usersController.userService.users;
  users.find = jest.fn().mockReturnValue(mockUsers);

  describe('Failure Cases', () => {
    describe('[GET] /users', () => {
      it('should fail when auth token is absent', async () => {
        return request(app.getServer()).get(`${usersRoute.path}`).expect(401);
      });
    });

    // describe('[GET] /users/' + mockUsers[0]._id, () => {
    //   it('response findOne User', async () => {
    //     const userId = 'qpwoeiruty';

    //     const users = usersRoute.usersController.userService.users;

    //     users.findOne = jest.fn().mockReturnValue({
    //       _id: 'qpwoeiruty',
    //       email: 'a@email.com',
    //       password: await bcrypt.hash('q1w2e3r4!', 10)
    //     });

    //     (mongoose as any).connect = jest.fn();
    //     return request(app.getServer()).get(`${usersRoute.path}/${userId}`).expect(401);
    //   });
    // });

    // describe('[POST] /users', () => {
    //   it('response Create User', async () => {
    //     const userData: UserLoginData = {
    //       email: 'test@email.com',
    //       password: 'q1w2e3r4'
    //     };

    //     const users = usersRoute.usersController.userService.users;

    //     users.findOne = jest.fn().mockReturnValue(null);
    //     users.create = jest.fn().mockReturnValue({
    //       _id: '60706478aad6c9ad19a31c84',
    //       email: userData.email,
    //       password: await bcrypt.hash(userData.password, 10)
    //     });

    //     (mongoose as any).connect = jest.fn();
    //     return request(app.getServer()).post(`${usersRoute.path}`).send(userData).expect(401);
    //   });
    // });

    // describe('[PUT] /users/:id', () => {
    //   it('response Update User', async () => {
    //     const userId = '60706478aad6c9ad19a31c84';
    //     const userData: UserLoginData = {
    //       email: 'test@email.com',
    //       password: 'q1w2e3r4'
    //     };

    //     const users = usersRoute.usersController.userService.users;

    //     if (userData.email) {
    //       users.findOne = jest.fn().mockReturnValue({
    //         _id: userId,
    //         email: userData.email,
    //         password: await bcrypt.hash(userData.password, 10)
    //       });
    //     }

    //     users.findByIdAndUpdate = jest.fn().mockReturnValue({
    //       _id: userId,
    //       email: userData.email,
    //       password: await bcrypt.hash(userData.password, 10)
    //     });

    //     (mongoose as any).connect = jest.fn();
    //     return request(app.getServer()).put(`${usersRoute.path}/${userId}`).send(userData);
    //   });
    // });

    // describe('[DELETE] /users/:id', () => {
    //   it('response Delete User', async () => {
    //     const userId = '60706478aad6c9ad19a31c84';

    //     const users = usersRoute.usersController.userService.users;

    //     users.findByIdAndDelete = jest.fn().mockReturnValue({
    //       _id: '60706478aad6c9ad19a31c84',
    //       email: 'test@email.com',
    //       password: await bcrypt.hash('q1w2e3r4!', 10)
    //     });

    //     (mongoose as any).connect = jest.fn();
    //     return request(app.getServer()).delete(`${usersRoute.path}/${userId}`).expect(401);
    //   });
    // });
  });
});
