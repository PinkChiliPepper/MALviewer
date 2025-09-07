import { NgStyle } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { AnimeTile } from '@shared/components/tiles/anime-tile/anime-tile';
import { UserAnimeTile } from '@shared/components/tiles/user-anime-tile/user-anime-tile';
import { AnimeItem } from '@shared/services/anime/types';
import { UserAnimeItem } from '@shared/services/user/types';

@Component({
  selector: 'app-tile-list',
  imports: [AnimeTile, UserAnimeTile],
  templateUrl: './tile-list.html',
  styleUrl: './tile-list.scss'
})
export class TileList {
  @Input() title: string = ''
  @Input() isLoading: boolean = true
  @Input() tiles: AnimeItem[] | UserAnimeItem[] = []
  @Input() tileType: 'anime' | 'user' = 'anime'

  userAnimeItemTiles(): UserAnimeItem[] {
    console.log(this.tiles)
    return this.tiles as UserAnimeItem[];
  }

  animeItemTiles(): AnimeItem[] {
    return this.tiles as AnimeItem[];
  }

  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;

  scrollLeft() {
    this.scrollContainer.nativeElement.scrollBy({ left: -1000, behavior: 'smooth' });
  }

  scrollRight() {
    this.scrollContainer.nativeElement.scrollBy({ left: 1000, behavior: 'smooth' });
  }
}
