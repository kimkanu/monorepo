import { Empty } from '@team-10/lib';
import got from 'got/dist/source';
import { getConnection } from 'typeorm';

import ChatEntity, { TextChatEntity } from '../entity/chat';
import { isAuthenticatedOrFail } from '../passport';
import Server from '../server';

import Route from './route';

interface NMTResponse {
  message: {
    result: {
      translatedText: string;
    }
  }
}

const supportedTranslations = [
  'ko -> en',
  'ja -> en',
  'fr -> en',
  'zh-cn -> en',
  'zh-tw -> en',
  'en -> ko',
  'ja -> ko',
  'zh-cn -> ko',
  'zh-tw -> ko',
  'vi -> ko',
  'id -> ko',
  'th -> ko',
  'de -> ko',
  'ru -> ko',
  'es -> ko',
  'it -> ko',
  'fr -> ko',
];

export default function generateRoute(server: Server): Route {
  const route = new Route(server);

  route.accept(
    'GET /translate',
    isAuthenticatedOrFail,
    async (params, body, user) => {
      const { chatId } = params;
      const userId = user.stringId;

      const chatEntity = await getConnection()
        .getRepository(ChatEntity).findOne({
          where: {
            uuid: chatId,
          },
          join: {
            alias: 'chat',
            innerJoinAndSelect: {
              classroom: 'chat.classroom',
            },
          },
        });
      if (!chatEntity) {
        return {
          success: false,
          error: {
            code: 'NONEXISTENT_CHAT',
            statusCode: 404,
            extra: {} as Empty,
          },
        };
      }
      if (!(chatEntity instanceof TextChatEntity)) {
        return {
          success: false,
          error: {
            code: 'INVALID_CHAT_TYPE',
            statusCode: 400,
            extra: {} as Empty,
          },
        };
      }

      const classroom = await server.managers.classroom.get(chatEntity.classroom.hash);
      if (!classroom) {
        return {
          success: false,
          error: {
            code: 'NONEXISTENT_CLASSROOM',
            statusCode: 400,
            extra: {} as Empty,
          },
        };
      }

      if (!classroom.hasMember(userId)) {
        return {
          success: false,
          error: {
            code: 'FORBIDDEN',
            statusCode: 403,
            extra: {},
          },
        };
      }

      const query = chatEntity.text;
      const language = await (async () => {
        const response = await got(
          'https://openapi.naver.com/v1/papago/detectLangs',
          {
            method: 'post',
            form: {
              query,
            },
            headers: {
              'X-Naver-Client-Id': process.env.AUTH_NAVER_CLIENT_ID,
              'X-Naver-Client-Secret': process.env.AUTH_NAVER_CLIENT_SECRET,
            },
          },
        );
        return JSON.parse(response.body).langCode;
      })();

      const targetLanguage = 'ko'; // TODO
      if (!supportedTranslations.includes(`${language} -> ${targetLanguage}`)) {
        return {
          success: false,
          error: {
            code: 'UNSUPPORTED_TRANSLATION',
            statusCode: 400,
            extra: {} as Empty,
          },
        };
      }

      const response = await got(
        'https://openapi.naver.com/v1/papago/n2mt',
        {
          method: 'post',
          form: {
            source: language, target: targetLanguage, text: query,
          },
          headers: {
            'X-Naver-Client-Id': process.env.AUTH_NAVER_CLIENT_ID,
            'X-Naver-Client-Secret': process.env.AUTH_NAVER_CLIENT_SECRET,
          },
        },
      );

      return {
        success: true,
        payload: (JSON.parse(response.body) as NMTResponse).message.result.translatedText,
      };
    },
  );

  return route;
}
