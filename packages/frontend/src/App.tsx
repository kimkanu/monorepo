import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  RouteComponentProps,
} from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import Global from './components/Global';
import Layout from './components/Layout';
import Classroom from './pages/Classroom';
import Test from './pages/Test';
import themeState from './recoil/theme';


const App: React.FC = () => {
  const theme = useRecoilValue(themeState.atom);

  return (
    <Router>
      <Global />
      <Layout className={`theme-${theme}`}>
        <Route exact path="/tests/" render={() => <Test name="" />} />
        <Route
          path="/tests/:name"
          render={({ match }: RouteComponentProps<{ name: string }>) => (
            <Test name={match.params.name} />
          )}
        />
        <Route path="/classes/:id" render={() => <Classroom />} />
      </Layout>
    </Router>
  );
};

export default App;
