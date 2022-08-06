import { AppDomain } from '@/interfaces/misc.interface';
import { CrudOperation } from '@/interfaces/misc.interface';
import { UserRole } from '@/interfaces/users.interface';

export const permissions: Record<AppDomain, Record<UserRole, CrudOperation[]>> = {
  users: {
    admin: ['create', 'read', 'update', 'delete'],
    user: ['read']
  },
  products: {
    admin: ['create', 'read', 'update', 'delete'],
    user: ['read']
  },
  app: {
    admin: ['create', 'read', 'update', 'delete'],
    user: ['create']
  },
  auth: {
    admin: ['create', 'read', 'update', 'delete'],
    user: ['read']
  }
};
