import { Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TileList } from '@app/shared/components/tile-list/tile-list';
import { AuthService } from '@app/shared/services/auth/auth.service';
import { UserService } from '@app/shared/services/user/user';

@Component({
  selector: 'app-user',
  imports: [TileList],
  templateUrl: './user.html',
  styleUrl: './user.scss'
})
export class UserComponent {
  userUpdates;
  userAnimelist;

  constructor(private userService: UserService, private authService: AuthService) {
    const userUpdates$ = this.userService.getUserUpdates();
    this.userUpdates = toSignal(userUpdates$, { initialValue: [] });

    const userAnimelist$ = this.userService.getUserAnimelist();
    this.userAnimelist = toSignal(userAnimelist$, { initialValue: [] });
  }
}
