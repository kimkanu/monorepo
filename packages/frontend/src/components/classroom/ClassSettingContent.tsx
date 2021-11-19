import {
  NumberSymbol20Regular, LockClosed20Regular, Book20Regular,
  ArrowCounterclockwise20Regular,
} from '@fluentui/react-icons';
import React from 'react';

import { randomInt } from '../../utils/math';
import Button from '../buttons/Button';
import TextInput from '../input/TextInput';

const getRandomPassword = () => `${randomInt(1e6)}`.padStart(6, '0');

interface Props {
  isInstructor: boolean;
  originCourseName: string;
  classId: string;
  originClassPassword?: string;
}
const ClassSettingContent: React.FC<Props> = ({
  isInstructor, originCourseName, classId, originClassPassword,
}) => {
  const [classPassword, setClassPassword] = React.useState(originClassPassword);
  const [courseName, setCourseName] = React.useState(originCourseName);

  const resetPassword = () => { setClassPassword(getRandomPassword); };

  return (
    <div>
      <section className="mt-4">
        <h1 className="text-sect font-bold mb-12">
          Settings
        </h1>
        <h2 className="text-sub font-bold mb-6">
          Class Information
        </h2>
        <div className="relative w-full h-12 mb-4">
          <TextInput
            value={courseName}
            onInput={setCourseName}
            icon={<Book20Regular />}
            name="courseName"
            font="mono"
            placeholderText="Class Name"
            align="left"
          />
        </div>
        <div className="relative w-full h-12 mb-4">
          <TextInput
            value={classId}
            icon={<NumberSymbol20Regular />}
            name="classId"
            font="mono"
            align="left"
            readOnly
          />
        </div>
        {
          isInstructor && (
            <div className="inline-flex relative w-full h-12 mb-4 bg-gray-200 text-emph font-mono pr-5 pl-14 rounded-full items-center">
              <div className="text-gray-700 mr-4 z-10 absolute left-5 top-3.5 select-none pointer-events-none">
                <LockClosed20Regular className="stroke-current" />
              </div>
              <div className="relative flex w-full h-full items-center">
                <span>{classPassword}</span>
              </div>
              <Button
                type="destructive"
                disabled={false}
                width="fit-content"
                height={48}
                text="Reset"
                icon={<ArrowCounterclockwise20Regular className="z-10" />}
                className="absolute right-0 z-5 w-2/5 font-sans"
                onClick={resetPassword}
              />
            </div>
          )
        }
      </section>
      <section className="mt-10 mb-4">
        <h2 className="text-sub font-bold mb-6">
          Class Management
        </h2>
        <Button
          type="destructive"
          disabled={false}
          width="full"
          height={48}
          className="font-sans"
          text={
            isInstructor
              ? 'Remove the Class'
              : 'Leave the Class'
          }
        />
      </section>
    </div>
  );
};
export default ClassSettingContent;
