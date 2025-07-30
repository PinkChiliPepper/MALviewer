import { NgStyle } from '@angular/common';
import { Component, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Tile } from '@components/tile/tile';
import { Anime } from '@shared/services/anime/anime';

@Component({
  selector: 'app-home',
  imports: [Tile, NgStyle],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  topAnime;

  constructor(private animeService: Anime) {
    const topAnime$ = this.animeService.getTopAnime();
    this.topAnime = toSignal(topAnime$, { initialValue: [] });
  }

  items: { name: string }[] = [{ name: 'testitem' }];
}
