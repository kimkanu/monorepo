import {
  NumberSymbol20Regular, LockClosed20Regular, Book20Regular,
  ArrowCounterclockwise20Regular, Checkmark20Regular, Clipboard20Regular,
} from '@fluentui/react-icons';
import { ClassroomJSON, ResponseError } from '@team-10/lib';
import CancelablePromise from 'cancelable-promise';
import React from 'react';
import { useHistory } from 'react-router-dom';

import copyTextToClipboard from '../../utils/clipboard';
import fetchAPI from '../../utils/fetch';
import appHistory from '../../utils/history';

import Button from '../buttons/Button';
import Title from '../elements/Title';
import TextInput from '../input/TextInput';

interface Props {
  isInstructor: boolean;
  classroom: ClassroomJSON;
  classroomName: string;
  onInputClassroomName: (name: string) => void;
  onChangeClassroomName?: (name: string) => void;
  onChangeClassroomNameError?: (error: ResponseError) => void;
  isPasscodeChanging: boolean;
  onResetPasscode?: () => Promise<void>;
}
const ClassroomSettingsContent: React.FC<Props> = ({
  isInstructor,
  classroom,
  classroomName,
  onInputClassroomName,
  onChangeClassroomName,
  onChangeClassroomNameError,
  isPasscodeChanging,
  onResetPasscode,
}) => {
  const [isCopyChecked, setCopyChecked] = React.useState(false);
  const history = useHistory();

  return (
    <div>
      <Title size="sect">설정</Title>
      <section className="mt-8">
        <Title size="sub" className="mb-6">수업 정보</Title>
        <div className="relative w-full h-12 mb-4">
          <TextInput
            value={classroomName}
            onInput={onInputClassroomName}
            icon={<Book20Regular />}
            name="courseName"
            font="mono"
            placeholderText="수업 이름"
            align="left"
            validator={(newName) => new CancelablePromise<boolean>((
              resolve, reject, onCancel,
            ) => {
              if (classroomName === classroom.name) {
                resolve(true);
                return;
              }

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
                        resolve(true);
                      }
                    } else if (onChangeClassroomNameError) {
                      onChangeClassroomNameError(response.error);
                      resolve(false);
                    }
                  })
                  .catch(() => {
                    resolve(false);
                  });
              }, 1000);

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
            font="mono"
            align="left"
            readOnly
            button={(
              <div className="absolute h-12 right-0" style={{ width: 136 }}>
                <Button
                  type="neutral"
                  disabled={false}
                  width="fit-content"
                  height={48}
                  text="Copy"
                  icon={isCopyChecked ? <Checkmark20Regular className="z-10" /> : <Clipboard20Regular className="z-10" />}
                  className="absolute right-0 z-5 w-2/5 font-sans"
                  onClick={async () => {
                    const ret = await copyTextToClipboard(`${classroom.hash} ${classroom.passcode}`);
                    if (ret) {
                      setCopyChecked(true);
                      setTimeout(() => {
                        setCopyChecked(false);
                      }, 1000);
                    }
                  }}
                />
              </div>
            )}
          />
        </div>
        {isInstructor && (
          <TextInput
            value={classroom.passcode}
            icon={<LockClosed20Regular />}
            font="mono"
            align="left"
            readOnly
            button={(
              <div className="absolute h-12 right-0" style={{ width: 136 }}>
                <Button
                  type="destructive"
                  disabled={false}
                  width="full"
                  height={48}
                  text="Reset"
                  icon={<ArrowCounterclockwise20Regular className="z-10" />}
                  className="absolute right-0 z-5 w-2/5 font-sans"
                  onClick={onResetPasscode}
                  isLoading={isPasscodeChanging}
                />
              </div>
            )}
          />
        )}
      </section>
      <section className="mt-8">
        <Title size="sub" className="mb-6">수업 관리</Title>
        <Button
          type="destructive"
          disabled={false}
          width="full"
          height={48}
          className="font-sans"
          text={isInstructor ? '수업 삭제하기' : '수업 나가기'}
          onClick={() => {
            appHistory.push(`/classrooms/${classroom.hash}/settings/${isInstructor ? 'remove' : 'leave'}`, history);
          }}
        />
      </section>
    </div>
  );
};

export default ClassroomSettingsContent;
