import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';

export default function useRedirect(condition: boolean, dependencies: any[]) {
  const location = useLocation();
  const history = useHistory();

  React.useEffect(() => {
    if (condition) {
      const query = new URLSearchParams(location.search).get('redirect_uri') ?? '/';
      history.replace(query);
    }
  }, dependencies);
}
