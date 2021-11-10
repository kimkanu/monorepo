import React from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';

import Global from './components/Global';
import Layout from './components/Layout';
import Class from './pages/Class';

const App: React.FC = () => (
  <Router>
    <Global />
    <Layout>
      <Route path="/classes/:id" component={() => <Class />} />
    </Layout>
  </Router>
);

export default App;
