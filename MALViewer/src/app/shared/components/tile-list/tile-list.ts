import { NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Tile } from '@shared/components/tile/tile';
import { AnimeItem } from '@shared/services/anime/types';

@Component({
  selector: 'app-tile-list',
  imports: [Tile],
  templateUrl: './tile-list.html',
  styleUrl: './tile-list.scss'
})
export class TileList {
  @Input() title: string = ''
  @Input() tiles: AnimeItem[] = []
}
