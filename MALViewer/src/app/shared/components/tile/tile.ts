import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tile',
  imports: [],
  templateUrl: './tile.html',
  styleUrl: './tile.scss'
})
export class Tile {
  @Input() name: string = 'test'
  @Input() src: string = 'test'
}
