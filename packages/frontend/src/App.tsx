import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { useSocket } from 'socket.io-react-hook';

import YTPlayer from './components/YTPlayer';
import YTWrapper from './components/YTWrapper';
import { mergeClassNames } from './utils/style';

function App() {
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

  return (
    <RecoilRoot>
      <Router>
        <div className="w-full h-full p-8">
          <Route
            path="/"
            render={({ location, history }) => {
              const inClass = /^\/classes\/\d+$/.test(location.pathname);
              return (
                <YTWrapper
                  inClass={inClass}
                  onClick={() => {
                    history.push('/classes/12345');
                  }}
                >
                  <YTPlayer className="rounded-lg" />
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
