import { Component, Input } from '@angular/core';
import { AnimeItem } from '@shared/services/anime/types';
import { UserAnimeItem } from '@shared/services/user/types';

@Component({
  selector: 'app-base-tile',
  imports: [],
  templateUrl: './base-tile.html',
  styleUrl: './base-tile.scss'
})
export class BaseTile {
  @Input() image_url: string = ''
  @Input() title: string = ''
  @Input() subtitle: string = ''
  @Input() link: string = ''
  @Input() topRight: string = ''

  ngOnInit(): void { }
}
