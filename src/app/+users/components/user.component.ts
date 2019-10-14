import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { User } from '../types';

@Component({
  selector: 'app-user',
  template: `
  <div [title]="user | json">{{ user.name }}</div>
  `,
  styles: [`
    :host {
        display: inline-block;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserComponent {
  @Input()
  public user!: User;
}
