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
  instructorId: string;
  memberIds: string[];
  video: YouTubeVideo | null;
  isLive: boolean;
  passcode: string;
  updatedAt: number;
}

export interface MemberJSON {
  id: string;
  img: string;
  isHost: boolean;
  isMe: boolean;
  isSpeaking: boolean; 
}