/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AnimatedRoute } from 'react-router-transition';
import { useRecoilValue } from 'recoil';

import Global from './components/layout/Global';
import Layout from './components/layout/Layout';
import Classroom from './pages/Classroom';
import ClassroomMembers from './pages/ClassroomMembers';
import ClassroomSettings from './pages/ClassroomSettings';
import Login from './pages/Login';
import Main from './pages/Main';
import NewClassroom from './pages/NewClassroom';
import Profile from './pages/Profile';
import ProfileConnect from './pages/ProfileConnect';
import Test from './pages/Test';
import Welcome from './pages/Welcome';
import WelcomeDone from './pages/WelcomeDone';
import meState from './recoil/me';
import themeState from './recoil/theme';
import { clamp } from './utils/math';

const classroomHashRegex = new RegExp('[BHJKLMNPST][AEIOU][KLMNPSTZ]-[BHJKLMNPST][AEIOU][KLMNPSTZ]-[BHJKLMNPST][AEIOU][KLMNPSTZ]');

const transitionProps = (additionalMapStyles: (progress: number) => any = () => {}) => ({
  style: { top: 'calc(env(safe-area-inset-top, 0px) + 64px)' },
  atEnter: { progress: -1 },
  atActive: { progress: 0 },
  atLeave: { progress: 1 },
  mapStyles: ({ progress }: { progress: number }) => ({
    transform: `translateY(calc(${-progress * 32}px))`,
    opacity: clamp(0, 1 - Math.abs(progress * 2), 1),
    overflow: progress === 0 ? 'auto' : 'hidden',
    '--overflow': progress === 0 ? 'auto' : 'hidden',
    height: progress === 0 ? '100%' : undefined,
    ...additionalMapStyles(progress),
  }),
});

const App: React.FC = () => {
  const theme = useRecoilValue(themeState.atom);
  const meInfo = useRecoilValue(meState.info);

  return (
    <Router>
      <Global theme={theme} className={`theme-${theme}`} />
      <Layout className={`theme-${theme}`}>
        {/* Main page */}
        <AnimatedRoute
          exact
          path={['/', '/classrooms/new']}
          render={() => <Main />}
          {...transitionProps()}
          className="w-full absolute"
        />
        <NewClassroom />

        {/* Login page */}
        <AnimatedRoute
          exact
          path="/login"
          render={() => <Login />}
          {...transitionProps()}
          className="w-full absolute"
        />

        {/* Welcome pages */}
        <AnimatedRoute
          exact
          path={meInfo ? ['/welcome'] : []}
          render={() => <Welcome />}
          {...transitionProps()}
          className="w-full absolute"
        />
        <AnimatedRoute
          exact
          path={meInfo ? ['/welcome/done'] : []}
          render={() => <WelcomeDone />}
          {...transitionProps()}
          className="w-full absolute"
        />

        {/* Classroom page */}
        <AnimatedRoute
          path={meInfo ? ['/classrooms/:hash'] : []}
          render={({ match }) => (
            classroomHashRegex.test(match.params.hash ?? '')
              ? <Classroom hash={match.params.hash ?? ''} />
              : null
          )}
          {...transitionProps()}
          className="w-full h-full"
        />
        <ClassroomMembers />
        <ClassroomSettings />

        {/* Profile page */}
        <AnimatedRoute
          exact
          path={meInfo ? ['/profile', '/profile/connect'] : []}
          render={() => <Profile />}
          {...transitionProps()}
          className="w-full absolute"
        />
        <ProfileConnect />

        {process.env.NODE_ENV === 'development' && (
          <>
            <AnimatedRoute
              exact
              path="/tests/"
              render={() => <Test name="" />}
              {...transitionProps()}
              className="w-full absolute"
            />
            <AnimatedRoute
              path="/tests/:name"
              render={({ match }) => (
                <Test name={match.params.name!} />
              )}
              {...transitionProps()}
              className="w-full absolute"
            />
          </>
        )}
      </Layout>
    </Router>
  );
};

export default App;
