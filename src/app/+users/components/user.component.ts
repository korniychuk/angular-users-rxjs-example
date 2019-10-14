import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { User } from '../types';

@Component({
  selector: 'app-user',
  template: `#{{ user.id }} | {{ user.name }}`,
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
