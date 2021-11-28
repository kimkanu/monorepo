import {
  NumberSymbol20Regular, LockClosed20Regular, Book20Regular,
  ArrowCounterclockwise20Regular,
} from '@fluentui/react-icons';
import { ClassroomJSON, ResponseError } from '@team-10/lib';
import CancelablePromise from 'cancelable-promise';
import React from 'react';

import fetchAPI from '../../utils/fetch';

import Button from '../buttons/Button';
import Title from '../elements/Title';
import TextInput from '../input/TextInput';

interface Props {
  isInstructor: boolean;
  classroom: ClassroomJSON;
  onChangeClassroomName?: (name: string) => void;
  onChangeClassroomNameError?: (error: ResponseError) => void;
  onResetPasscode?: () => Promise<void>;
}
const ClassroomSettingsContent: React.FC<Props> = ({
  isInstructor,
  classroom,
  onChangeClassroomName,
  onChangeClassroomNameError,
  onResetPasscode,
}) => (
  <div>
    <Title size="sect">설정</Title>
    <section className="mt-14">
      <Title size="sub" className="mb-6">수업 정보</Title>
      <div className="relative w-full h-12 mb-4">
        <TextInput
          value={classroom.name}
          icon={<Book20Regular />}
          name="courseName"
          font="mono"
          placeholderText="Class Name"
          align="left"
          validator={(newName) => new CancelablePromise<boolean>((
            resolve, reject, onCancel,
          ) => {
            if (!newName) {
              resolve(false);
              return;
            }

            const timeout = setTimeout(() => {
              fetchAPI('PATCH /classrooms/:hash', { hash: classroom.hash }, {
                operation: 'rename',
                name: newName,
              })
                .then((response) => {
                  if (response.success) {
                    if (onChangeClassroomName) {
                      onChangeClassroomName(newName);
                    }
                  } else if (onChangeClassroomNameError) {
                    onChangeClassroomNameError(response.error);
                  }
                })
                .catch(() => {
                  resolve(false);
                });
            }, 1500);

            onCancel(() => {
              clearTimeout(timeout);
            });
          })}
        />
      </div>
      <div className="relative w-full h-12 mb-4">
        <TextInput
          value={classroom.hash}
          icon={<NumberSymbol20Regular />}
          name="classId"
          font="mono"
          align="left"
          readOnly
        />
      </div>
      {isInstructor && (
        <div className="inline-flex relative w-full h-12 mb-4 bg-gray-200 text-emph font-mono pr-5 pl-14 rounded-full items-center">
          <div className="text-gray-700 mr-4 z-10 absolute left-5 top-3.5 select-none pointer-events-none">
            <LockClosed20Regular className="stroke-current" />
          </div>
          <div className="relative flex w-full h-full items-center">
            <span>{classroom.passcode}</span>
          </div>
          <Button
            type="destructive"
            disabled={false}
            width="fit-content"
            height={48}
            text="Reset"
            icon={<ArrowCounterclockwise20Regular className="z-10" />}
            className="absolute right-0 z-5 w-2/5 font-sans"
            onClick={onResetPasscode}
          />
        </div>
      )}
    </section>
    <section className="mt-14">
      <Title size="sub" className="mb-6">수업 관리</Title>
      <Button
        type="destructive"
        disabled={false}
        width="full"
        height={48}
        className="font-sans"
        text={isInstructor ? 'Remove the Class' : 'Leave the Class'}
      />
    </section>
  </div>
);
export default ClassroomSettingsContent;
