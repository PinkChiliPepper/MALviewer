import { Component, Input } from '@angular/core';
import { BaseTile } from '@shared/components/tiles/base-tile/base-tile';
import { AnimeItem } from '@shared/services/anime/types';
import { UserAnimeItem } from '@shared/services/user/types';

@Component({
  selector: 'app-user-anime-tile',
  imports: [BaseTile],
  templateUrl: './user-anime-tile.html',
  styleUrl: './user-anime-tile.scss'
})
export class UserAnimeTile {
  @Input() anime:  UserAnimeItem | null = null

  baseWatchLink: string = 'https://www.google.com/search?q=site:hianime.to+';
  watchLink: string = '';

  ngOnInit(): void {
    if (!this.anime) return

    const linkName = this.anime.entry.title?.toLowerCase().replace(/\s+/g, '-') ?? '';
    this.watchLink = `${this.baseWatchLink}${linkName}+episode ${this.anime.episodes_seen + 1}`;
  }
}
