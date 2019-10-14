// Don't export service from index files directly. This is dangerous because of it is easy to create an explicit
// circular dependency
import { Provider } from '@angular/core';
import { UsersService } from './users.service';

export const services: Provider[] = [
  UsersService,
];
