import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ModalModule } from 'ngx-bootstrap/modal';

import { containers } from './containers';
import { components } from './components';
import { modals } from './modals';
import { services } from './services';
import { routes } from './users.routes';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
  ],
  exports: [],
  declarations: [...containers, ...components, ...modals],
  entryComponents: [ ...modals ],
  providers: [...services],
})
export class UsersModule {
}
