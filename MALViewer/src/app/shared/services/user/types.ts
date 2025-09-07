
export interface UserAnimeItem {
  entry: {
    mal_id: number,
    url: string,
    images: {
      jpg: {
        image_url: string,
      }
    },
    title: string,
  }
  score: number,
  status: string,
  date: string,
  episodes_seen: number,
  episodes_total: number,
}

export interface UserUpdatesAPI {
  anime: UserAnimeItem[],
}

export type UserHistoryAPI = UserAnimeItem[]
