import { UserInfoJSON } from '.';

export type YouTubeVideo = YouTubeVideoSingle | YouTubeVideoPlaylist;

export interface YouTubeVideoSingle {
  type: 'single';
  videoId: string;
}

export interface YouTubeVideoPlaylist {
  type: 'playlist';
  videoId: string;
  playlistId: string;
  index: number;
}

export interface ClassroomJSON {
  hash: string;
  name: string;
  instructor: UserInfoJSON;
  members: ClassroomMemberJSON[];
  video: YouTubeVideo | null;
  isLive: boolean;
  passcode?: string;
  updatedAt: number;
}

export interface ClassroomMemberJSON extends UserInfoJSON {
  isConnected: boolean;
}

export interface ClassroomJSONWithSpeaker extends ClassroomJSON {
  speakerId: string | null;
}
