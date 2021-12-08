import { Empty, YouTubeVideoDescription } from '@team-10/lib';
import got from 'got';

import { isAuthenticatedOrFail } from '../passport';
import Server from '../server';

import Route from './route';

interface SearchResultItem {
  kind: 'youtube#searchResult';
  etag: string;
  id: {
    kind: string;
    videoId: string;
    playlistId: string;
  };
  snippet: {
    channelTitle: string;
    publishedAt: string;
    title: string;
    thumbnails: {
      medium: {
        url: string;
        width: 320;
        height: 180;
      };
    };
  };
}

interface SearchResult {
  kind: 'youtube#searchListResponse';
  etag: string;
  nextPageToken?: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  }
  items: SearchResultItem[];
}

export default function generateRoute(server: Server): Route {
  const route = new Route(server);

  route.accept(
    'GET /youtube',
    isAuthenticatedOrFail,
    async (params) => {
      const apiKey = process.env.YOUTUBE_API_KEY;

      if (!params.q || typeof params.q !== 'string') {
        return {
          success: false,
          error: {
            code: 'INVALID_INFORMATION',
            statusCode: 400,
            extra: {
              field: 'q',
              details: 'q is missing',
            },
          },
        };
      }

      try {
        const response = await got(
          `https://www.googleapis.com/youtube/v3/search?part=id,snippet&key=${
            apiKey
          }&q=${
            params.q
          }${
            params.pageToken ? `&pageToken=${params.pageToken}` : ''
          }`,
        ).then(({ body }) => JSON.parse(body)) as SearchResult;

        const result: YouTubeVideoDescription[] = await Promise.all(
          response.items
            .filter(({ id }) => ['youtube#video', 'youtube#playlist'].includes(id.kind))
            .map(async (item) => ({
              creator: item.snippet.channelTitle,
              publishedAt: item.snippet.publishedAt,
              thumbnail: item.snippet.thumbnails.medium.url,
              title: item.snippet.title,
              video: item.id.kind === 'youtube#video' ? {
                type: 'single' as 'single',
                videoId: item.id.videoId,
              } : {
                type: 'playlist' as 'playlist',
                videoId: await got(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${item.id.playlistId}&key=${apiKey}&maxResults=1`).then((r) => JSON.parse(r.body).items[0].snippet.resourceId.videoId),
                playlistId: item.id.playlistId,
                index: 0,
              },
            })),
        );

        return {
          success: true,
          payload: {
            result,
            nextPageToken: response.nextPageToken,
          },
        };
      } catch (e) {
        return {
          success: false,
          error: {
            code: 'INTERNAL_SERVER_ERROR',
            statusCode: 500,
            extra: {} as Empty,
          },
        };
      }
    },
  );

  return route;
}
