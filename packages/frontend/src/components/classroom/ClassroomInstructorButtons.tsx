import { ClassroomsHashPatchResponse } from '@team-10/lib';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil';

import classroomsState from '../../recoil/classrooms';
import mainClassroomHashState from '../../recoil/mainClassroomHash';
import meState from '../../recoil/me';
import toastState from '../../recoil/toast';
import fetchAPI from '../../utils/fetch';
import appHistory from '../../utils/history';
import Button from '../buttons/Button';

const ClassroomInstructorButtons: React.FC = () => {
  const mainClassroomHash = useRecoilValue(mainClassroomHashState.atom);
  const [mainClassroom, setMainClassroom] = useRecoilState(
    classroomsState.byHash(mainClassroomHash),
  );
  const history = useHistory();
  const myId = useRecoilValue(meState.id);
  const addToast = useSetRecoilState(toastState.new);
  const [isLoading, setLoading] = React.useState(false);

  return mainClassroom?.instructor?.stringId === myId && mainClassroom?.video ? (
    <div className="w-fit px-2 flex gap-6">
      {!!mainClassroom && (
        <Button
          type={mainClassroom.isLive ? 'destructive' : 'primary'}
          width="fit-content"
          height={36}
          isLoading={isLoading}
          text={mainClassroom.isLive ? '수업 끝' : '수업 시작'}
          onClick={async () => {
            if (!mainClassroom) return;
            setLoading(true);
            const response = await fetchAPI(
              'PATCH /classrooms/:hash',
              { hash: mainClassroom.hash! },
              { operation: 'toggle', start: !mainClassroom.isLive },
            ) as ClassroomsHashPatchResponse<'toggle'>;
            if (!response.success) {
              addToast({
                sentAt: new Date(),
                type: 'error',
                message: `[${response.error.code}]`,
              });
            }
            setLoading(false);
          }}
        />
      )}
      {!!mainClassroom && mainClassroom.isLive && (
        <Button
          type="primary"
          width="fit-content"
          height={36}
          text="영상 변경"
          onClick={async () => {
            appHistory.push(`/classrooms/${mainClassroom.hash}/share`, history);
          }}
        />
      )}
      {!!mainClassroom && mainClassroom.isLive && (
        <Button
          type="destructive"
          width="fit-content"
          height={36}
          text="공유 중지"
          onClick={() => {
            if (!mainClassroom) return;
            setMainClassroom((c) => ({
              ...c,
              video: null,
            }));
          }}
        />
      )}
    </div>
  ) : null;
};

export default ClassroomInstructorButtons;
