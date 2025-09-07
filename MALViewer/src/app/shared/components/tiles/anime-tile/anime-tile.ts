import { Component, Input } from '@angular/core';
import { BaseTile } from '@shared/components/tiles/base-tile/base-tile';
import { AnimeItem } from '@shared/services/anime/types';

@Component({
  selector: 'app-anime-tile',
  imports: [BaseTile],
  templateUrl: './anime-tile.html',
  styleUrl: './anime-tile.scss'
})
export class AnimeTile {
  @Input() anime: AnimeItem | null = null

  baseWatchLink: string = 'https://www.google.com/search?q=site:hianime.to+';
  watchLink: string = '';

  ngOnInit(): void {
    if (!this.anime) return

    const linkName = this.anime.title_english?.toLowerCase().replace(/\s+/g, '-') ?? '';
    this.watchLink = `${this.baseWatchLink}${linkName}+episode 1`;
  }
}
