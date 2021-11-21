/* istanbul ignore file */
import React from 'react';
import { useSetRecoilState } from 'recoil';

import dialogState from '../../recoil/dialog';
import TempButton from '../buttons/TempButton';
import ClassSettingContent from '../classroom/ClassSettingContent';

const ClassSettingPageTest: React.FC = () => {
  const setDialog = useSetRecoilState(dialogState.atom);
  const setDialogVisible = useSetRecoilState(dialogState.visible);

  return (
    <div className="w-full h-full flex flex-col gap-4 justify-center items-center">
      <TempButton
        width="fit"
        label="Student Setting"
        onClick={() => {
          setDialog({
            visible: true,
            element: <ClassSettingContent isInstructor={false} originCourseName="CS412" classId="ABC-DEF" />,
            onClose: () => setDialogVisible(false),
          });
        }}
      />
      <TempButton
        width="fit"
        label="Instructor Setting"
        onClick={() => {
          setDialog({
            visible: true,
            element: <ClassSettingContent isInstructor originCourseName="CS412" classId="ABC-DEF" originClassPassword="123456" />,
            onClose: () => setDialogVisible(false),
          });
        }}
      />
    </div>
  );
};

export default ClassSettingPageTest;
