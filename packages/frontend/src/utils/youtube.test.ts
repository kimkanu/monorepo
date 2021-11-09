import YouTube from 'react-youtube';

import { getYouTubePlayerStateName } from './youtube';

test('getYouTubePlayerStateName should work correctly', () => {
  expect(getYouTubePlayerStateName(YouTube.PlayerState.UNSTARTED)).toBe('UNSTARTED');
  expect(getYouTubePlayerStateName(YouTube.PlayerState.ENDED)).toBe('ENDED');
  expect(getYouTubePlayerStateName(YouTube.PlayerState.PLAYING)).toBe('PLAYING');
  expect(getYouTubePlayerStateName(YouTube.PlayerState.PAUSED)).toBe('PAUSED');
  expect(getYouTubePlayerStateName(YouTube.PlayerState.BUFFERING)).toBe('BUFFERING');
  expect(getYouTubePlayerStateName(YouTube.PlayerState.CUED)).toBe('CUED');

  // Generate some integer in [-1000, 999].
  const generateOtherInt = (): number => {
    const value = Math.floor(Math.random() * 2000) - 1000;
    if ([
      YouTube.PlayerState.UNSTARTED,
      YouTube.PlayerState.ENDED,
      YouTube.PlayerState.PLAYING,
      YouTube.PlayerState.PAUSED,
      YouTube.PlayerState.BUFFERING,
      YouTube.PlayerState.CUED,
    ].includes(value)) {
      return generateOtherInt();
    }
    return value;
  };

  // Run `FLAKY_TEST_COUNT` times.
  const FLAKY_TEST_COUNT = 10;
  for (let i = 0; i < FLAKY_TEST_COUNT; i += 1) {
    expect(getYouTubePlayerStateName(generateOtherInt())).toBe(null);
  }
});
