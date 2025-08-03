export interface AnimeItem {
  mal_id: number
  title_english: string,
  title_japanese: string,
  images: {
    jpg: {
      image_url: string,
    }
  }
  score: number,
}
