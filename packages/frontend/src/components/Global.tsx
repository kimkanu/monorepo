/* istanbul ignore file */
import React from 'react';
import {
  useLocation,
  useHistory,
} from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import classroomState from '../recoil/classroom';
import dialogState from '../recoil/dialog';
import dropdownState from '../recoil/dropdown';
import toastState from '../recoil/toast';

import Debug from './Debug';
import Dialog from './Dialog';
import Dropdown from './Dropdown';
import ScreenHeightMeasure from './ScreenHeightMeasure';
import ToastDisplay from './ToastDisplay';
import YTPlayer from './YTPlayer';
import YTWrapper from './YTWrapper';

const Global: React.FC<Styled<{}>> = ({ className, style }) => {
  const classroom = useRecoilValue(classroomState.atom);
  const dropdown = useRecoilValue(dropdownState.atom);
  const dialog = useRecoilValue(dialogState.atom);
  const toasts = useRecoilValue(toastState.atom);

  const location = useLocation();
  const inClassroom = /^\/classrooms\/\w{3}-\w{3}-\w{3}$/.test(location.pathname);

  const history = useHistory();

  return (
    <div className={className} style={style}>
      {/* 화면 vh 조정 */}
      <ScreenHeightMeasure />

      {/* 디버그용 컴포넌트 */}
      <Debug />

      <Dropdown visible={dropdown.visible} onClose={dropdown.onClose ?? (() => {})}>
        {dropdown.element}
      </Dropdown>

      <Dialog visible={dialog.visible} onClose={dialog.onClose ?? (() => {})}>
        {dialog.element}
      </Dialog>

      <YTWrapper
        isPresent={!!classroom?.videoId}
        inClassroom={inClassroom}
        onClick={() => {
          if (classroom?.id) {
            history.push(`/classes/${classroom.id.toLowerCase()}`);
          }
        }}
      >
        <YTPlayer videoId={classroom?.videoId} />
      </YTWrapper>

      <ToastDisplay toasts={toasts} />
    </div>
  );
};

export default Global;
