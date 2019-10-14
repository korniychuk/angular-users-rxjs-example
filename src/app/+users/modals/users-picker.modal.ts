import { ChangeDetectionStrategy, Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { BsModalRef } from 'ngx-bootstrap';
import * as _ from 'lodash';

import { UsersSelectionInfo } from '../types';

interface FormValue { users: { [userId: number]: boolean }; }

export interface UsersPickerSaveEvent {
  selectedUserIds: number[];
}

@Component({
  selector: 'app-users-picker-modal',
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit(form.value)">
      <div class="modal-header">
        <h4 class="modal-title pull-left">Pick Users</h4>
        <button type="button" class="close pull-right" aria-label="Close" (click)="hide()">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div formGroupName="users">
          <div class="form-check" *ngFor="let userInfo of usersInfo; index as i">
            <input type="checkbox" class="form-check-input" [id]="getCheckboxId(i)" [formControlName]="userInfo.user.id">
            <label class="form-check-label" [for]="getCheckboxId(i)">
              <app-user [user]="userInfo.user"></app-user>
            </label>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-light" (click)="hide()">Cancel</button>
        <button type="submit" class="btn btn-primary">Save</button>
      </div>
    </form>
  `,
  styles: [`
    .form-check {
        cursor: pointer;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersPickerModal implements OnInit {
  /** Input param */
  public usersInfo: UsersSelectionInfo[] = [];

  public save = new EventEmitter<UsersPickerSaveEvent>();

  public form!: FormGroup;

  public constructor(
    private readonly $fb: FormBuilder,
    private readonly $bsModalRef: BsModalRef,
  ) {}

  public ngOnInit() {
    const controlsMap = _.mapValues(_.keyBy(this.usersInfo, v => v.user.id), v => [v.selected]);
    this.form = this.$fb.group({
      users: this.$fb.group(controlsMap),
    });
  }

  public onSubmit({ users }: FormValue): void {
    const selectedUserIds = _.keys(_.pickBy(users, Boolean)).map(Number);
    this.save.emit({ selectedUserIds });
    this.$bsModalRef.hide();
  }

  public getCheckboxId(index: number): string {
    return 'user-checkbox-' + index;
  }

  public hide(): void {
    this.$bsModalRef.hide();
  }

}
