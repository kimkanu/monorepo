import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  RouteComponentProps,
} from 'react-router-dom';

import Global from './components/Global';
import Layout from './components/Layout';
import Class from './pages/Class';
import Test from './pages/Test';

const App: React.FC = () => (
  <Router>
    <Global />
    <Layout>
      <Route exact path="/tests/" component={() => <Test name="" />} />
      <Route
        path="/tests/:name"
        component={({ match }: RouteComponentProps<{ name: string }>) => (
          <Test name={match.params.name} />
        )}
      />
      <Route path="/classes/:id" component={() => <Class />} />
    </Layout>
  </Router>
);

export default App;
