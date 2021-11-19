import {
  NumberSymbol20Regular, LockClosed20Regular, Book20Regular,
  ArrowCounterclockwise20Regular,
} from '@fluentui/react-icons';
import React from 'react';

import useInput from '../hooks/useInput';

import Button from './Button';

function getRandPassword(): string {
  let password = '';
  for (let i = 0; i < 6; i += 1) {
    const n = Math.floor(Math.random() * 10);
    password += n.toString();
  }
  return password;
}

interface Props {
  userType: string;
  originCourseName: string;
  classId: string;
  originClassPassword?: string;
}

const ClassSettingContent: React.FC<Props> = ({
  userType, originCourseName, classId, originClassPassword,
}) => {
  const [ClassPassword, setClassPassword] = React.useState(originClassPassword);
  const [CourseName, onChangeCourseName] = useInput(originCourseName);

  function resetPassword(): React.MouseEventHandler {
    const newPassword = getRandPassword();
    return () => { setClassPassword(newPassword); };
  }

  return (
    <div>
      <section>
        <h1 className="text-sect font-bold mb-8">
          Settings
        </h1>
        <h2 className="text-sub font-bold mb-7">
          ClassInformation
        </h2>
        <div className="relative w-full h-12 mb-4">
          <div className="text-gray-700 mr-4 absolute left-5 top-3.5 select-none pointer-events-none">
            <Book20Regular className="stroke-current" />
          </div>
          <input
            placeholder="Class Name"
            value={CourseName}
            onChange={onChangeCourseName}
            className="bg-gray-200 placeholder-gray-200 placeholder-sans text-emph w-full h-full pr-5 pl-14 rounded-full font-mono"
          />
        </div>
        <div className="relative w-full h-12 mb-4 bg-gray-200 text-emph font-mono pr-5 pl-14 rounded-full items-center">
          <div className="text-gray-700 mr-4 absolute left-5 top-3.5 select-none pointer-events-none">
            <NumberSymbol20Regular className="stroke-current" />
          </div>
          <div className="flex w-full h-full items-center">
            <span>{classId}</span>
          </div>
        </div>
        {
          userType === 'Instructor' && (
            <div className="inline-flex relative w-full h-12 mb-4 bg-gray-200 text-emph font-mono pr-5 pl-14 rounded-full items-center">
              <div className="text-gray-700 mr-4 z-10 absolute left-5 top-3.5 select-none pointer-events-none">
                <LockClosed20Regular className="stroke-current" />
              </div>
              <div className="relative flex w-full h-full items-center">
                <span>{ClassPassword}</span>
              </div>
              <Button
                type="destructive"
                disabled={false}
                width="fit-content"
                height={48}
                text="Reset"
                icon={<ArrowCounterclockwise20Regular className="z-10" />}
                className="absolute right-0 z-5 w-2/5"
                onClick={resetPassword()}
              />
            </div>
          )
        }
      </section>
      <section className="mt-12 mb-10">
        <h2 className="text-sub font-bold mb-6">
          Class Management
        </h2>
        <Button
          type="destructive"
          disabled={false}
          width="full"
          height={48}
          text={
            userType === 'Instructor'
              ? 'Remove the Class'
              : 'Leave the Class'
          }
        />
      </section>
    </div>
  );
};

export default ClassSettingContent;
