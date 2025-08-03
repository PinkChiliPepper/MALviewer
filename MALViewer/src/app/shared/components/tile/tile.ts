import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tile',
  imports: [],
  templateUrl: './tile.html',
  styleUrl: './tile.scss'
})
export class Tile {
  @Input() name: string = ''
  @Input() japaneseName: string = ''
  @Input() src: string = ''
  @Input() score: number = 0
}
