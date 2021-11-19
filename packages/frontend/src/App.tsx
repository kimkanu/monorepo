import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  RouteComponentProps,
  Switch,
} from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import Global from './components/layout/Global';
import Layout from './components/layout/Layout';
import Classroom from './pages/Classroom';
import Main from './pages/Main';
import Test from './pages/Test';
import themeState from './recoil/theme';

const App: React.FC = () => {
  const theme = useRecoilValue(themeState.atom);

  return (
    <Router>
      <Global className={`theme-${theme}`} />
      <Layout className={`theme-${theme}`}>
        <Switch>
          <Route exact path="/" render={() => <Main />} />
          <Route path="/classrooms/:id" render={() => <Classroom />} />

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
        </Switch>
      </Layout>
    </Router>
  );
};

export default App;
