import { SetMetadata } from '@nestjs/common';

import { UserRoles } from 'src/users/user.roles';

export const ROLES_KEY = 'roles';

export const Roles = (args: UserRoles[]) => SetMetadata(ROLES_KEY, args);
