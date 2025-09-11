import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Menu } from '@shared/components/menu/menu';
import { AuthService } from '@app/shared/services/auth/auth.service';
import { CircularLoader } from '@app/shared/components/loaders/circular-loader/circular-loader';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, Menu, RouterOutlet, CircularLoader],
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.scss'],
})
export class MainLayout {
  constructor(public auth: AuthService) {}
 }
