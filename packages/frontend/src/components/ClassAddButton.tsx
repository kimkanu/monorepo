import React from 'react';

import { useSetRecoilState } from 'recoil';

import dialogState from '../recoil/dialog';

import JoinCreateContent from './JoinCreateContent';

interface Props {
  handleCreate: (courseName: string) => void;
}

const ClassAddButton: React.FC<Props> = ({ handleCreate }) => {
  const setDialog = useSetRecoilState(dialogState.atom);
  const setDialogVisible = useSetRecoilState(dialogState.visible);

  return (
    <div>
      <button
        type="button"
        className="justify-center group rounded-lg w-full h-48 bg-gray-300 sm:flex items-center hover:shadow-class-hover"
        onClick={() => {
          setDialog({
            visible: true,
            element: <JoinCreateContent
              handleCreate={handleCreate}
              onClose={() => setDialogVisible(false)}
            />,
            onClose: () => setDialogVisible(false),
          });
        }}
      >
        <div>
          <div className="text-title text-center text-gray-700 font-black"> &#43; </div>
          <div className="text-big text-center text-gray-700 font-semibold mb-4"> Join/Create New Class </div>
        </div>
      </button>
    </div>
  );
};

export default ClassAddButton;
