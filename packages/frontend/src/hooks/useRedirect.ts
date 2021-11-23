import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';

export default function useRedirect(
  condition: boolean,
  dependencies: any[],
  to: string | null = null,
) {
  const location = useLocation();
  const history = useHistory();

  React.useEffect(() => {
    if (condition) {
      if (to) {
        history.replace(to);
      } else {
        const query = new URLSearchParams(location.search).get('redirect_uri') ?? '/';
        history.replace(query);
      }
    }
  }, dependencies);
}
