import { YouTubeVideo } from '..';

import { Response, Empty } from '.';

export type YouTubeEndpoints =
  | 'GET /youtube';
export type YouTubePathParams = {
  'GET /youtube': Empty;
};
export type YouTubeRequestBodyType = {
  'GET /youtube': Empty;
};
export type YouTubeResponseType = {
  'GET /youtube': YouTubeGetResponse;
};

export type YouTubeGetResponse = Response<{
  result: YouTubeVideoDescription[];
  nextPageToken?: string;
}, YouTubeGetError>;
export interface YouTubeVideoDescription {
  thumbnail: string;
  title: string;
  publishedAt: string; // ISO string
  creator: string;
  video: { type: 'single' | 'playlist'; id: string };
}
export type YouTubeGetError = {
  code: 'INVALID_INFORMATION';
  statusCode: 400;
  extra: {
    field: string;
    details: string;
  };
};
