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
      // TODO: set lang params
      const apiKey = 'AIzaSyC_Ms6NQD4h6EwV3RibF44774fETecNI4U';

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

        const result: YouTubeVideoDescription[] = response.items
          .filter(({ id }) => ['youtube#video', 'youtube#playlist'].includes(id.kind))
          .map((item) => ({
            creator: item.snippet.channelTitle,
            publishedAt: item.snippet.publishedAt,
            thumbnail: item.snippet.thumbnails.medium.url,
            title: item.snippet.title,
            video: {
              type: item.id.kind === 'youtube#video' ? 'single' : 'playlist',
              id: item.id.kind === 'youtube#video' ? item.id.videoId : item.id.playlistId,
            },
          }));

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
