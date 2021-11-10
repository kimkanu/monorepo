/* istanbul ignore file */
import React from 'react';
import {
  useLocation,
  useHistory,
} from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import classState from '../recoil/class';
import dialogState from '../recoil/dialog';
import dropdownState from '../recoil/dropdown';

import Debug from './Debug';
import Dialog from './Dialog';
import Dropdown from './Dropdown';
import ScreenHeightMeasure from './ScreenHeightMeasure';
import YTPlayer from './YTPlayer';
import YTWrapper from './YTWrapper';

const Global: React.FC = () => {
  const class_ = useRecoilValue(classState.atom);
  const dropdown = useRecoilValue(dropdownState.atom);
  const dialog = useRecoilValue(dialogState.atom);

  const location = useLocation();
  const inClass = /^\/classes\/\w{3}-\w{3}-\w{3}$/.test(location.pathname);

  const history = useHistory();

  return (
    <>
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
        isPresent={!!class_?.videoId}
        inClass={inClass}
        onClick={() => {
          if (class_?.id) {
            history.push(`/classes/${class_.id.toLowerCase()}`);
          }
        }}
      >
        <YTPlayer videoId={class_?.videoId} />
      </YTWrapper>
    </>
  );
};

export default Global;
