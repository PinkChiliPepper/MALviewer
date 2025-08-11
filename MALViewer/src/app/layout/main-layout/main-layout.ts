import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Menu } from '../../shared/components/menu/menu';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, Menu, RouterOutlet],
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.scss'],
})
export class MainLayout { }
