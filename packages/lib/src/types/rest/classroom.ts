export type YouTubeVideo = YouTubeVideoSingle | YouTubeVideoPlaylist;

export interface YouTubeVideoSingle {
  type: 'single';
  id: string;
}

export interface YouTubeVideoPlaylist {
  type: 'playlist';
  id: string;
  index: number;
}

export interface ClassroomJSON {
  hash: string;
  name: string;
  instructorId: string;
  memberIds: string[];
  video: YouTubeVideo | null;
  isLive: boolean;
}
