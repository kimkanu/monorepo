import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import meState from '../recoil/me';

export default function useRedirect(
  condition: boolean,
  to: string | null = null,
  dependencies: any[] = [condition],
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

export function useRedirectUnauthorized() {
  const me = useRecoilValue(meState.atom);
  useRedirect(me.loaded && !me.info, '/');
}
