import { Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Anime } from '@shared/services/anime/anime';
import { TileList } from "@shared/components/tile-list/tile-list";

@Component({
  selector: 'app-home',
  imports: [TileList],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  topAnime;
  currentSeason;

  constructor(private animeService: Anime) {
    const topAnime$ = this.animeService.getTopAnime();
    this.topAnime = toSignal(topAnime$, { initialValue: [] });

    const currentSeason$ = this.animeService.getCurrentSeason();
    this.currentSeason = toSignal(currentSeason$, { initialValue: [] });
  }

  items: { name: string }[] = [{ name: 'testitem' }];
}
