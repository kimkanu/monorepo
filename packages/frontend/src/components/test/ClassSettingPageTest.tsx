import React from 'react';
import { useSetRecoilState } from 'recoil';

import dialogState from '../../recoil/dialog';
import ClassSettingContent from '../ClassSettingContent';
import TempButton from '../TempButton';

const ClassSettingPageTest: React.FC = () => {
  const setStudentDialog = useSetRecoilState(dialogState.atom);
  const setStudentDialogVisible = useSetRecoilState(dialogState.visible);
  const setInstructorDialog = useSetRecoilState(dialogState.atom);
  const setInstructorDialogVisible = useSetRecoilState(dialogState.visible);

  return (
    <div className="w-full h-full flex flex-col gap-4 justify-center items-center">
      <TempButton
        width="fit"
        label="Open Dialog"
        onClick={() => {
          setStudentDialog({
            visible: true,
            element: <ClassSettingContent userType="Student" courseName="CS412" classId="ABC-DEF" />,
            onClose: () => setStudentDialogVisible(false),
          });
        }}
      />
      <TempButton
        width="fit"
        label="Open Dialog"
        onClick={() => {
          setInstructorDialog({
            visible: true,
            element: <ClassSettingContent userType="Instructor" courseName="CS412" classId="ABC-DEF" />,
            onClose: () => setInstructorDialogVisible(false),
          });
        }}
      />
    </div>
  );
};

export default ClassSettingPageTest;
