import { render } from '@testing-library/react';
import React from 'react';
import { RecoilRoot } from 'recoil';

import YTPlayer from './YTPlayer';
import YTWrapper from './YTWrapper';

const VIDEO_ID = 'Zyi9QUB-fyo';

test('If videoId is not set, it should be disappeared when minimized.', () => {
  const { container } = render(
    <RecoilRoot>
      <YTWrapper className="___TEST___" isPresent={false} inClassroom={false}>
        <YTPlayer />
      </YTWrapper>
    </RecoilRoot>,
  );

  expect(
    (container.getElementsByClassName('___TEST___')[0] as HTMLDivElement)
      .classList
      .contains('opacity-0'),
  ).toBe(true);
});

test('If videoId is set, it should not be disappeared when minimized.', async () => {
  const { container } = render(
    <RecoilRoot>
      <YTWrapper className="___TEST___" isPresent inClassroom={false}>
        <YTPlayer videoId={VIDEO_ID} />
      </YTWrapper>
    </RecoilRoot>,
  );

  await new Promise((r) => setTimeout(r, 600));

  expect(
    (container.getElementsByClassName('___TEST___')[0] as HTMLDivElement)
      .classList
      .contains('opacity-0'),
  ).toBe(false);
});
