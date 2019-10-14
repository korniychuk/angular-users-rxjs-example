import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import * as $ from 'rxjs/operators';
import { BsModalService } from 'ngx-bootstrap';

import { UsersService } from '../services/users.service';
import { UsersSelectionInfo } from '../types';
import { UsersPickerModal, UsersPickerSaveEvent } from '../modals/users-picker.modal';
import { NonFunctionProperties } from '../../types';

@Component({
  selector: 'app-users-container',
  styles: [`
    .user.selected {
        color: green;
    }
  `],
  template: `
    Users List: <button type="button" class="btn btn-primary" (click)="openUsersPickerModal()">Pick Users</button>
    <ul class="users">
      <li *ngFor="let userInfo of usersInfo$ | async" class="user" [class.selected]="userInfo.selected">
        <app-user [user]="userInfo.user"></app-user>
        <strong *ngIf="userInfo.selected">&nbsp;[selected]</strong>
      </li>
    </ul>
  `,
})
export class UsersContainer implements OnInit {
  public usersInfo$!: Observable<UsersSelectionInfo[]>;

  public constructor(
    private readonly $users: UsersService,
  ) {}

  public ngOnInit(): void {
    this.initStreams();
  }

  public openUsersPickerModal(): void {
    this.$users.openUsersPickerModal();
  }

  private initStreams(): void {
    this.usersInfo$ = this.$users.usersWithSelectionInfo$;
  }

}
