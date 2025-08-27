import { NgStyle } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
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
  @Input() isLoading: boolean = true
  placeholderTiles = Array(10);

  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;

  scrollLeft() {
    this.scrollContainer.nativeElement.scrollBy({ left: -1000, behavior: 'smooth' });
  }

  scrollRight() {
    this.scrollContainer.nativeElement.scrollBy({ left: 1000, behavior: 'smooth' });
  }
}
