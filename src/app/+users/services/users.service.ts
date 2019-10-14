import { Injectable } from '@angular/core';

import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import * as $ from 'rxjs/operators';
import * as _ from 'lodash';

import { User, UsersSelectionInfo } from '../types';
import { NonFunctionProperties } from '../../types';
import { UsersPickerModal } from '../modals/users-picker.modal';
import { BsModalService } from 'ngx-bootstrap';

const usersMock = Array(20).fill(1).map((v, i): User => ({
  id: i + 1,
  name: 'User ' + (i + 1),
}));

interface UsersMap { [userId: number]: User; }
interface SelectedUserIdsMap { [userId: number]: boolean; /* is selected */ }

@Injectable()
export class UsersService {
  private usersEntities$ = new BehaviorSubject<UsersMap>({});
  private userIds$ = new BehaviorSubject<number[]>([]);
  private selectedUserIdsMap$ = new BehaviorSubject<SelectedUserIdsMap>({});

  private busy$ = new BehaviorSubject<boolean>(false);

  public users$!: Observable<User[]>;
  public usersWithSelectionInfo$!: Observable<UsersSelectionInfo[]>;

  public constructor(
    private readonly $bsModal: BsModalService
  ) {
    this.initStreams();

    // Api Mock
    this.setUsers(usersMock);
    this.setSelectedUserIds([3, 5, 6]);
  }

  public setUsers(users: User[]): void {
    const usersEntities = _.keyBy(users, v => v.id);
    const userIds = _.map(users, v => v.id);

    this.busy$.next(true);
    this.usersEntities$.next(usersEntities);
    this.userIds$.next(userIds);
    this.busy$.next(false);
  }

  public setSelectedUserIds(userIds: number[]): void {
    const map = _.mapValues(_.keyBy(userIds), () => true);
    this.selectedUserIdsMap$.next(map);
  }

  public async openUsersPickerModal(): Promise<void> {
    const initialState: Partial<NonFunctionProperties<UsersPickerModal>> = {
      usersInfo: await this.usersWithSelectionInfo$.pipe($.first()).toPromise(),
    };

    const ref = this.$bsModal.show(UsersPickerModal, { initialState });
    if (!ref.content) { throw new Error('Can\' get modal ref'); }

    const ins: UsersPickerModal = ref.content;
    ins.save.pipe(
      $.first(),
      $.takeUntil(this.$bsModal.onHide),
    ).subscribe(e => this.setSelectedUserIds(e.selectedUserIds));
  }

  private initStreams(): void {
    this.users$ = combineLatest(this.usersEntities$, this.userIds$, this.busy$).pipe(
      $.filter(([, , isBusy]) => !isBusy),
      $.map(([entities, ids]) =>
        ids
          .map(id => {
            if (!entities[id]) {
              console.warn('UsersService.users$ Can\'t find user by ID: %s\nUsers:%O', id, entities);
            }
            return entities[id];
          })
          .filter(Boolean),
      ),
    );

    this.usersWithSelectionInfo$ = combineLatest(
      this.users$,
      this.selectedUserIdsMap$,
    ).pipe(
      $.map(([users, selectedIdsMap]) =>
        users.map(user => ({ user, selected: !!selectedIdsMap[user.id] })),
      ),
    );
  }

}
