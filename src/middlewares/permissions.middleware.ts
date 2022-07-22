import { User } from '@interfaces/users.interface';
import { UserRole } from '@/interfaces/users.interface';
import { CrudOperation, AppDomain } from '@/interfaces/misc.interface';
import { Request } from 'express';
import { permissions } from '@/validators/permissions';
import { get } from 'lodash';
import { Forbidden } from 'http-errors';

export function getPermissions(domain: AppDomain, operation: CrudOperation) {
  return (req: Request, res, next) => {
    try {
      const role: UserRole = (req.user as User).role;
      const permissionsForRole: CrudOperation[] | null = get(
        permissions,
        `${domain}.${role}`,
        null
      );
      if (permissionsForRole && permissionsForRole.includes(operation)) {
        console.log({ permissionsForRole, operation, domain, role });
        next();
      } else {
        next(new Forbidden('forbidden'));
      }
    } catch {
      next(new Forbidden('forbidden'));
    }
  };
}
