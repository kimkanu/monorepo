import { Search20Regular, SpinnerIos20Regular } from '@fluentui/react-icons';
import { ResponseError, YouTubeVideoDescription } from '@team-10/lib';
import React from 'react';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { useLocation, useHistory } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import Dialog from '../components/alert/Dialog';
import Button from '../components/buttons/Button';
import Title from '../components/elements/Title';
import TextInput from '../components/input/TextInput';
import classroomsState from '../recoil/classrooms';
import meState from '../recoil/me';
import toastState from '../recoil/toast';
import fetchAPI from '../utils/fetch';
import appHistory, { classroomPrefixRegex } from '../utils/history';

const useYouTubeSearch = () => {
  const [items, setItems] = React.useState<YouTubeVideoDescription[]>([]);
  const [isLoading, setLoading] = React.useState(false);
  const [q, setQ] = React.useState<string>('');
  const [nextPageToken, setNextPageToken] = React.useState<string | null | undefined>(undefined);
  const [error, setError] = React.useState<ResponseError | null>(null);

  const loadMore = React.useCallback((query: string = q) => {
    if (isLoading) return;
    if (nextPageToken === null) return;
    if (query === '') return;

    if (query !== q) {
      setQ(query);
      setItems([]);
    }

    setLoading(true);
    fetchAPI(
      'GET /youtube',
      query !== q ? { q: query } : { q: query, pageToken: nextPageToken } as any,
    ).then((response) => {
      if (response.success) {
        setError(null);
        setNextPageToken(response.payload.nextPageToken ?? null);
        setItems((i) => [...i, ...response.payload.result]);
      } else {
        setError(response.error);
      }
    }).finally(() => {
      setLoading(false);
    });
  }, [isLoading, q, nextPageToken]);

  return {
    isLoading, items, nextPageToken, hasNextPage: nextPageToken !== null, error, loadMore,
  };
};

const YouTubeItem: React.FC<{ desc: YouTubeVideoDescription }> = ({
  desc: {
    thumbnail,
    title,
    publishedAt,
    creator,
    video,
  },
}) => {
  const location = useLocation();
  const history = useHistory();
  const hash = location.pathname.match(classroomPrefixRegex)?.[1] ?? null;
  const setClassroom = useSetRecoilState(classroomsState.byHash(hash));

  return (
    <button
      type="button"
      className="flex gap-4 p-4 text-left hover:bg-gray-200 rounded-8 transition-button"
      style={{ margin: '0 -16px', width: 'calc(100% + 32px)' }}
      onClick={() => {
        if (!hash) return;
        setClassroom((c) => (!c ? null : {
          ...c,
          video,
        }));
        appHistory.goBack(history);
      }}
    >
      <img
        src={thumbnail}
        alt={`${video.type === 'single' ? `비디오 ${video.videoId}` : `재생목록 ${video.playlistId}`}의 섬네일`}
        className="object-cover object-center rounded-2xl shadow-button"
        style={{ width: 156, height: 88, '--shadow-color': 'rgba(0, 0, 0, 0.1)' } as React.CSSProperties}
      />
      <div style={{ width: 'calc(100% - 172px)' }}>
        <div
          style={{
            lineClamp: 2,
            WebkitLineClamp: 2,
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            lineHeight: '24px',
            height: 48,
          }}
          className="text-emph font-bold overflow-hidden"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: title }}
        />
        <div className="truncate text-tiny text-gray-600" style={{ lineHeight: '20px' }}>
          {creator}
          <br />
          {video.type === 'single' ? '비디오' : '재생목록'}
          {' · '}
          {publishedAt.slice(0, 10)}
        </div>
      </div>
    </button>
  );
};

const ClassroomShare: React.FC = () => {
  const me = useRecoilValue(meState.atom);
  const location = useLocation();
  const history = useHistory();

  const hash = location.pathname.match(classroomPrefixRegex)?.[1] ?? null;
  const isVisible = /^\/classrooms\/(\w{3}-\w{3}-\w{3})\/share\/?$/.test(location.pathname);

  const [searchText, setSearchText] = React.useState('');
  const {
    isLoading, items, hasNextPage, error, loadMore,
  } = useYouTubeSearch();
  const [sentryRef] = useInfiniteScroll({
    loading: isLoading,
    hasNextPage,
    onLoadMore: () => loadMore(),
    disabled: !!error || !searchText,
    rootMargin: '0px 0px 400px 0px',
  });

  return (
    <Dialog
      visible={me.loaded && !!me.info && isVisible}
      onClose={() => appHistory.goBack(history)}
      style={{ width: 480, maxWidth: '100vw' }}
    >
      <Title size="sect">영상 공유</Title>

      <TextInput
        value={searchText}
        onInput={setSearchText}
        placeholderText="유튜브 영상 검색"
        containerClassName={!isLoading && items.length === 0 ? 'mt-8 mb-2' : 'my-8'}
        onSubmit={() => {
          loadMore(searchText);
        }}
        button={(
          <Button
            type="primary"
            width="fit-content"
            icon={<Search20Regular />}
            isLoading={isLoading}
            disabled={!searchText}
            onClick={() => {
              loadMore(searchText);
            }}
          />
        )}
      />

      <div>
        {items.map((item) => (
          <YouTubeItem key={(item.video as any).playlistId ?? item.video.videoId} desc={item} />
        ))}

        {(isLoading || hasNextPage) && (
          <div ref={sentryRef} style={{ transform: 'scale(200%)' }} className="w-5 h-5 m-auto pt-6 py-10">
            <SpinnerIos20Regular className="stroke-current stroke-2 text-gray-300 block w-5 h-5 animate-spin" />
          </div>
        )}
      </div>
    </Dialog>
  );
};

export default ClassroomShare;
