import { Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TileList } from "@shared/components/tile-list/tile-list";
import { UserService } from '@shared/services/user/user';

@Component({
  selector: 'app-user',
  imports: [TileList],
  templateUrl: './user.html',
  styleUrl: './user.scss'
})
export class UserComponent {
  userUpdates;

  constructor(private userService: UserService) {
    const userUpdates$ = this.userService.getUserUpdates();
    this.userUpdates = toSignal(userUpdates$, { initialValue: [] });
  }
}
