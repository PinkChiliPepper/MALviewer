import { NgStyle } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Tile } from '@shared/components/tile/tile';
import { AnimeItem } from '@shared/services/anime/types';
import { CircularLoader } from "../loaders/circular-loader/circular-loader";

@Component({
  selector: 'app-tile-list',
  imports: [Tile, CircularLoader],
  templateUrl: './tile-list.html',
  styleUrl: './tile-list.scss'
})
export class TileList {
  @Input() title: string = ''
  @Input() tiles: AnimeItem[] = []

  @Input() isLoading: boolean = true

  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;

  scrollLeft() {
    this.scrollContainer.nativeElement.scrollBy({ left: -1000, behavior: 'smooth' });
  }

  scrollRight() {
    this.scrollContainer.nativeElement.scrollBy({ left: 1000, behavior: 'smooth' });
  }
}
