import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
} from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { useSocket } from 'socket.io-react-hook';

import Debug from './components/Debug';
import YTPlayer from './components/YTPlayer';
import YTWrapper from './components/YTWrapper';
import useScreenType, { ScreenType } from './hooks/useScreenType';
import { enumColorClassNames } from './utils/debug';

function App() {
  const screenType = useScreenType();
  const { socket, connected } = useSocket(
    '/',
    process.env.NODE_ENV === 'production' || !process.env.REACT_APP_PROXY_URL
      ? undefined
      : {
        host: process.env.REACT_APP_PROXY_URL.replace(/https?:\/\//g, ''),
      },
  );

  React.useEffect(() => {
    fetch('/api')
      .then((r) => r.text())
      .then((s) => console.log(`/: ${s}`));
  }, []);

  const [videoId, setVideoId] = React.useState<string | undefined>(undefined);

  return (
    <RecoilRoot>
      <Router>
        <Debug>
          <span className="bold text-blue-600">
            {connected ? 'Connected!' : 'Disconnected.'}
          </span>
          <br />
          {/* useScreenType으로 screen type 가져오는 법 */}
          <span className={enumColorClassNames(screenType)}>
            Screen type:
            {' '}
            {ScreenType[screenType]}
          </span>
          <br />
          {/* `mobile-port:`, `mobile-land:`, `desktop:`을 앞에 붙여서
              화면 종류별로 다른 tailwind 클래스 적용하기 */}
          <>
            <span className="hidden mobile-port:inline text-red-600">
              Screen type: MobilePortait
            </span>
            <span className="hidden mobile-land:inline text-yellow-600">
              Screen type: MobileLandscape
            </span>
            <span className="hidden desktop:inline text-green-600">
              Screen type: Desktop
            </span>
          </>
          <br />
          <button
            type="button"
            onClick={() => {
              setVideoId(videoId ? undefined : 'Zyi9QUB-fyo');
            }}
          >
            {videoId ? 'Remove videoId' : 'Set videoId'}
          </button>
        </Debug>
        <div className="w-full h-full bg-gray-100">
          {/* Example usage of `YTWrapper` and `YTPlayer`. */}
          <Route
            path="/"
            render={({ location, history }) => {
              const inClass = /^\/classes\/\d+$/.test(location.pathname);
              return (
                <YTWrapper
                  isPresent={!!videoId}
                  inClass={inClass}
                  onClick={() => {
                    history.push('/classes/12345');
                  }}
                >
                  <YTPlayer videoId={videoId} />
                </YTWrapper>
              );
            }}
          />
        </div>
        <div className="absolute top-0 left-0 z-10">
          <Route
            path="/classes/:id"
            render={() => (
              <Link to="/">Back</Link>
            )}
          />

        </div>
      </Router>
    </RecoilRoot>
  );
}

export default App;
