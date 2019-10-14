import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { USERS_MODULE_ID } from './+users/users.module-id';

const routes: Routes = [
  {
    path: USERS_MODULE_ID,
    loadChildren: './+users#UsersModule',
  },
  {
    path: '**',
    redirectTo: USERS_MODULE_ID,
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  declarations: [],
  providers: [],
})
export class AppRoutesModule {
}
