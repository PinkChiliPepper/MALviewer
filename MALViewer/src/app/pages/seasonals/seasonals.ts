import { Component, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TileList } from '@shared/components/tile-list/tile-list';
import { Anime } from '@shared/services/anime/anime';
import { AnimeItem, BroadCastDays } from '@shared/services/anime/types';


@Component({
  selector: 'app-seasonals',
  imports: [TileList],
  templateUrl: './seasonals.html',
  styleUrl: './seasonals.scss'
})
export class Seasonals {
  schedules: Record<string, any> = {}

  constructor(private animeService: Anime) {
    Object.values(BroadCastDays).forEach(day => {
      const obs$ = this.animeService.getCurrentSeasonSchedule(day);
      this.schedules[day] = toSignal(obs$, { initialValue: [] });
    });

  }
orderedDays(): string[] {
  const days: string[] = Object.values(BroadCastDays);
  const todayIndex = new Date().getDay();
  const ordered: string[] = [];

  for (let i = 1; i <= 7; i++) {
    const index = (todayIndex - i + 7) % 7;
    ordered.push(days[index]);
  }

  return ordered;
}
}
