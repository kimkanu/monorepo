import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  RouteComponentProps,
} from 'react-router-dom';

import Global from './components/Global';
import Layout from './components/Layout';
import Classroom from './pages/Classroom';
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
      <Route path="/classrooms/:id" component={() => <Classroom />} />
    </Layout>
  </Router>
);

export default App;
