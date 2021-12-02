import { SocketUser } from '@team-10/lib';
import React from 'react';
import { useSetRecoilState } from 'recoil';

import useSocket from '../../hooks/useSocket';
import meState from '../../recoil/me';

const MyInfoPatcher: React.FC = () => {
  const { socket } = useSocket<SocketUser.Events.Response, SocketUser.Events.Request>('/');
  const setMyInfo = useSetRecoilState(meState.info);

  React.useEffect(() => {
    const listener = ({ patch }: SocketUser.Broadcast.Patch) => {
      setMyInfo((info) => (info ? { ...info, ...patch } : null));
    };
    socket.on('user/PatchBroadcast', listener);

    return () => {
      socket.off('user/PatchBroadcast', listener);
    };
  }, [socket]);

  return null;
};

export default MyInfoPatcher;
