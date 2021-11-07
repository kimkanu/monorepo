import { NumberSymbol20Filled } from '@fluentui/react-icons';
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
          <span className="bold text-blue-500">
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
            <span className="hidden mobile-port:inline text-red-500">
              Screen type: MobilePortait
            </span>
            <span className="hidden mobile-land:inline text-green-500">
              Screen type: MobileLandscape
            </span>
            <span className="hidden desktop:inline text-blue-500">
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
        <div className="w-full h-full bg-white">
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
          <Route
            path="/test/tailwind"
            render={() => (
              <div className="p-8 w-80 flex flex-col gap-4">
                {/* Sample input */}
                <div className="relative w-full h-12">
                  <div className="text-gray-700 mr-4 absolute left-5 top-3.5 select-none pointer-events-none">
                    <NumberSymbol20Filled />
                  </div>
                  <input
                    className="bg-gray-200 text-emph w-full h-full pr-5 pl-14 rounded-full font-mono"
                  />
                </div>
                {/* Sample button */}
                <button
                  type="button"
                  className="
                  w-full h-12 rounded-full
                  flex items-center justify-center
                  bg-primary-500 hover:bg-primary-500 active:bg-primary-700
                  text-white text-emph font-bold
                  shadow-button hover:shadow-button-hover active:shadow-button shadow-color-primary
                  "
                >
                  <div className="mr-3 select-none pointer-events-none">
                    <NumberSymbol20Filled />
                  </div>
                  <span>Re-hash</span>
                </button>
              </div>
            )}
          />
        </div>
      </Router>
    </RecoilRoot>
  );
}

export default App;
