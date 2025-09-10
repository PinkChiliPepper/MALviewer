
export interface UserAnimeItem {
  // entry: {
  //   mal_id: number,
  //   url: string,
  //   images: {
  //     jpg: {
  //       image_url: string,
  //     }
  //   },
  //   title: string,
  // }
  // score: number,
  // status: string,
  // date: string,
  // episodes_seen: number,
  // episodes_total: number,
  node: {
    id: number,
    title: string,
    main_picture: {
      medium: string,
      large: string,
    }
  }
}

export interface UserUpdatesAPI {
  anime: UserAnimeItem[],
}

export type UserHistoryAPI = UserAnimeItem[]
