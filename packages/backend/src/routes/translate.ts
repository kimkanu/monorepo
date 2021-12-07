import Server from '../server';

import Route from './route';

/**
 * 예시 route입니다.
 * @param server Server instance
 * @returns Route
 */

const express = require('express');

const app = express();
const clientid = 'YOUR_CLIENT_ID';
const clientsecret = 'YOUR_CLIENT_SECRET';
const query = '번역할 문장을 입력하세요.';

function login(req, res) {
  const apiurl = 'https://openapi.naver.com/v1/papago/n2mt';
  const request = require('request');
  const options = {
    url: apiurl,
    form: { source: 'ko', target: 'en', text: query },
    headers: { 'X-Naver-Client-Id': clientid, 'X-Naver-Client-Secret': clientsecret }
  };
  request.post(options, post)

function post(error, response, body) {
  if (!error && response.statusCode == 200) {
    res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
    res.end(body);
    } else {
      res.status(response.statusCode).end();
      console.log('error = ' + response.statusCode);
    }
  };  
  app.listen(3000, function () {
    console.log('http://127.0.0.1:3000/translate app listening on port 3000!');
  });

export default function generateRoute(server: Server): Route {
  const route = new Route(server);

  route.accept(
    'GET /translate',
    async (params, body, user, req, res, next) => {
      /* chatid가 존재하는지 확인하고 chatid의 채팅을 파파고 api로 */
      console.log('/translate로 GET 요청이 들어옴');
      console.log(params);
      const text = { body };
      return {
        success: true,
        payload: {
          message: '1234',
        },
      };
    },
  );

  return route;
};
