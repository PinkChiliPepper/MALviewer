import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Menu } from '@shared/components/menu/menu';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, Menu, RouterOutlet],
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.scss'],
})
export class MainLayout { }
