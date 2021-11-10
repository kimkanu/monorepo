import { NumberSymbol20Filled } from '@fluentui/react-icons';
import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
} from 'react-router-dom';
import { useSocket } from 'socket.io-react-hook';

import Debug from './components/Debug';
import Dialog from './components/Dialog';
import Dropdown from './components/Dropdown';
import ScreenHeightMeasure from './components/ScreenHeightMeasure';
import YTPlayer from './components/YTPlayer';
import YTWrapper from './components/YTWrapper';
import useScreenType from './hooks/useScreenType';
import ScreenType from './types/screen';
import { conditionalClassName } from './utils/style';

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

  const [dropdownVisible, setDropdownVisible] = React.useState(false);
  const [dialogVisible, setDialogVisible] = React.useState(false);
  const nextInputRef = React.useRef<HTMLInputElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  return (
    <Router>
      {/* 화면 vh 조정 */}
      <ScreenHeightMeasure />

      <Debug>
        <span className="bold text-blue-500">
          {connected ? 'Connected!' : 'Disconnected.'}
        </span>
        <br />
        {/* Tailwind screen prefix에 대한 workaround (이슈 #49 참조) */}
        <span
          className={conditionalClassName({
            desktop: 'text-blue-500',
            mobileLandscape: 'text-green-500',
            mobilePortrait: 'text-red-500',
          })(screenType)}
        >
          Screen type:
          {' '}
          {ScreenType[screenType]}
        </span>
        <br />
        <button
          type="button"
          onClick={() => {
            setVideoId(videoId ? undefined : 'Zyi9QUB-fyo');
          }}
        >
          {videoId ? 'Remove videoId' : 'Set videoId'}
        </button>
        <br />
        <Link
          to="/test/dropdown"
          onClick={() => {
            setDropdownVisible(true);
          }}
        >
          Dropdown
        </Link>
        <br />
        <Link
          to="/test/dropdown"
          onClick={() => {
            setDialogVisible(true);
          }}
        >
          Dialog
        </Link>
      </Debug>
      <div className="w-full h-full bg-white">
        <div className="absolute border-t-4 border-primary-500 z-layout bottom-0 w-full" style={{ height: 'calc(env(safe-area-inset-bottom, 0px) + 72px)' }} />

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
        <Route
          path="/test/dropdown"
          render={() => (
            <>
              <Dropdown visible={dropdownVisible} onClose={() => setDropdownVisible(false)}>
                <section>
                  <h2 className="text-sect font-bold">
                    Sample Dropdown
                  </h2>
                </section>
              </Dropdown>
              <Dialog visible={dialogVisible} onClose={() => setDialogVisible(false)}>
                <section>
                  <h2 className="text-sect font-bold mb-8">
                    Join Class
                  </h2>
                  <div className="relative w-full h-12 mb-4">
                    <div className="text-gray-700 mr-4 absolute left-5 top-3.5 select-none pointer-events-none">
                      <NumberSymbol20Filled />
                    </div>
                    <input
                      className="bg-gray-200 text-emph w-full h-full pr-5 pl-14 rounded-full font-mono"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !!e.currentTarget.value && nextInputRef.current) {
                          nextInputRef.current.focus();
                        }
                      }}
                    />
                  </div>
                  <div className="relative w-full h-12 mb-4">
                    <div className="text-gray-700 mr-4 absolute left-5 top-3.5 select-none pointer-events-none">
                      <NumberSymbol20Filled />
                    </div>
                    <input
                      ref={nextInputRef}
                      className="bg-gray-200 text-emph w-full h-full pr-5 pl-14 rounded-full font-mono"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !!e.currentTarget.value && buttonRef.current) {
                          buttonRef.current.focus();
                        }
                      }}
                    />
                  </div>
                  <button
                    ref={buttonRef}
                    type="button"
                    className="
                    w-full h-12 rounded-full
                    outline-none
                    flex items-center justify-center
                    bg-primary-500 hover:bg-primary-500 focus:bg-primary-500 active:bg-primary-700
                    text-white text-emph font-bold
                    shadow-button hover:shadow-button-hover focus:shadow-button-hover active:shadow-button shadow-color-primary
                    transition-button duration-button
                    "
                    onClick={(e) => {
                      e.currentTarget.blur();
                    }}
                  >
                    <div className="mr-3 select-none pointer-events-none">
                      <NumberSymbol20Filled />
                    </div>
                    <span>Re-hash</span>
                  </button>
                </section>
              </Dialog>
            </>
          )}
        />
      </div>
    </Router>
  );
}

export default App;
