import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  RouteComponentProps,
} from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import Global from './components/layout/Global';
import Layout from './components/layout/Layout';
import Classroom from './pages/Classroom';
import Login from './pages/Login';
import Main from './pages/Main';
import Profile from './pages/Profile';
import Test from './pages/Test';
import Welcome from './pages/Welcome';
import WelcomeDone from './pages/WelcomeDone';
import themeState from './recoil/theme';

const classroomHashRegex = new RegExp('[BHJKLMNPST][AEIOU][KLMNPSTZ]-[BHJKLMNPST][AEIOU][KLMNPSTZ]-[BHJKLMNPST][AEIOU][KLMNPSTZ]');

const App: React.FC = () => {
  const theme = useRecoilValue(themeState.atom);

  return (
    <Router>
      <Global theme={theme} className={`theme-${theme}`} />
      <Layout className={`theme-${theme}`}>
        {/* Main page */}
        <Route
          exact
          path={['/', '/classrooms/new']}
          render={() => <Main />}
        />
        <Route
          path="/classrooms/:hash"
          render={({ match }) => (match.params.hash === 'new' ? null : <Main />)}
        />

        {/* Welcome pages */}
        <Route
          exact
          path="/welcome"
          render={() => <Welcome />}
        />
        <Route
          exact
          path="/welcome/done"
          render={() => <WelcomeDone />}
        />

        {/* Classroom page */}
        <Route
          path="/classrooms/:hash"
          render={({ match }) => (
            classroomHashRegex.test(match.params.hash)
              ? <Classroom hash={match.params.hash} />
              : null
          )}
        />

        {/* Login page */}
        <Route
          exact
          path="/login"
          render={() => <Login />}
        />

        {/* Profile page */}
        <Route
          exact
          path="/profile"
          render={() => <Profile />}
        />

        {process.env.NODE_ENV === 'development' && (
          <>
            <Route exact path="/tests/" render={() => <Test name="" />} />
            <Route
              path="/tests/:name"
              render={({ match }: RouteComponentProps<{ name: string }>) => (
                <Test name={match.params.name} />
              )}
            />
          </>
        )}
      </Layout>
    </Router>
  );
};

export default App;
