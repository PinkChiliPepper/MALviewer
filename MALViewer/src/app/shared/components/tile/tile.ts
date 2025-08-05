import { Component, Input } from '@angular/core';
import { AnimeItem } from '@shared/services/anime/types';

@Component({
  selector: 'app-tile',
  imports: [],
  templateUrl: './tile.html',
  styleUrl: './tile.scss'
})
export class Tile {
  @Input() anime: AnimeItem | null = null

  baseWatchLink: string = 'https://www.google.com/search?q=site:hianime.to+';
  linkName: string = '';
  watchLink: string = '';

  ngOnInit(): void {
    console.log(this.anime);

    if (this.anime) {
      this.linkName = this.anime.title_english?.toLowerCase().replace(/\s+/g, '-') ?? '';
      this.watchLink = `${this.baseWatchLink}${this.linkName}+episode 1`;
    }
  }
}
