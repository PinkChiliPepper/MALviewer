export interface AnimeItem {
  broadcast: {
    day: string,
    time: string,
  }
  mal_id: number
  title_english: string,
  title_japanese: string,
  title_synonyms: string[],
  images: {
    jpg: {
      image_url: string,
    }
  }
  score: number,
  aired: {
    from: {
      day: number,
      month: number,
      year: number,
    }
    to: {
      day: number,
      month: number,
      year: number,
    }
  }
}

export enum BroadCastDays {
  monday = 'monday',
  tuesday = 'tuesday',
  wednesday = 'wednesday',
  thursday = 'thursday',
  friday = 'friday',
  saturday = 'saturday',
  sunday = 'sunday',
}
