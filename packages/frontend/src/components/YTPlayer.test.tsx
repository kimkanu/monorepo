import { render, screen } from '@testing-library/react';
import React from 'react';

import YTPlayer from './YTPlayer';

test('`No videos are shared.` message should be present when the videoId is not given.', () => {
  const { container } = render(<YTPlayer />);
  const noVideosMessageElement = screen.getByText(/No videos are shared./i);
  expect(noVideosMessageElement).toBeInTheDocument();
  expect(container.getElementsByClassName('youtubeContainer').length).toBe(0);
});

test('When a videoId is given, there should be an element with classname `youtubeContainer`.', () => {
  const { container } = render(<YTPlayer videoId="Zyi9QUB-fyo" />);
  expect(container.getElementsByClassName('youtubeContainer').length).toBe(1);
});

test('When a playlist is given, there should be an element with classname `youtubeContainer`.', () => {
  const { container } = render(
    <YTPlayer
      options={{
        playerVars: {
          list: 'PLC77007E23FF423C6',
          listType: 'playlist',
        },
      }}
    />,
  );
  expect(container.getElementsByClassName('youtubeContainer').length).toBe(1);
});
