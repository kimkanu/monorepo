import { YouTubeVideo } from '@team-10/lib';

export interface ClassroomInfo {
  hash: string;
  name: string;
  instructorId: string;
  memberIds: Set<string>;
}

export default class Classroom {
  hash: string;

  name: string;

  instructorId: string;

  memberIds: Set<string>;

  connectedMemberIds: Set<string> = new Set();

  video: YouTubeVideo | null = null;

  isLive: boolean = false;

  constructor(
    info: ClassroomInfo,
    // Classroom 밖에 있는 client가 이 room에 메시지를 보낼 수 없도록 roomId는 숨겨야 합니다.
    public roomId: string,
  ) {
    this.hash = info.hash;
    this.name = info.name;
    this.instructorId = info.instructorId;
    this.memberIds = info.memberIds;
  }

  connectMember(userId: string) {
    this.connectedMemberIds.add(userId);
  }

  disconnectMember(userId: string) {
    this.connectedMemberIds.delete(userId);
  }

  hasMember(userId: string) {
    return this.memberIds.has(userId);
  }

  start() {
    this.isLive = true;
  }

  end() {
    this.isLive = false;
  }
}
