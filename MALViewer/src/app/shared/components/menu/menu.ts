import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '@shared/services/auth/auth.service';

@Component({
  selector: 'app-menu',
  imports: [RouterLink],
  templateUrl: './menu.html',
  styleUrl: './menu.scss'
})
export class Menu {
  constructor(public auth: AuthService) {}

  login() {
    this.auth.login();
  }

  logout() {
    this.auth.logout();
  }
}
