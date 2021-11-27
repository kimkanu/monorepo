import {
  NumberSymbol20Regular, LockClosed20Regular,
  QrCode28Regular, Book20Regular,
} from '@fluentui/react-icons';
import React from 'react';

import AmbientButton from '../buttons/AmbientButton';
import Button from '../buttons/Button';
import Title from '../elements/Title';
import TextInput from '../input/TextInput';

interface Props {
  onJoin?: (hash: string, passcode: string) => void;
  isLoadingJoin: boolean;
  onCreate?: (name: string) => void;
  isLoadingCreate: boolean;
}

const JoinCreateContent: React.FC<Props> = ({
  onJoin = () => {},
  isLoadingJoin,
  onCreate = () => {},
  isLoadingCreate,
}) => {
  const passwordJoinRef = React.useRef<HTMLInputElement>(null);
  const joinButtonRef = React.useRef<HTMLButtonElement>(null);
  const createButtonRef = React.useRef<HTMLButtonElement>(null);
  const [classroomIdJoin, setClassroomIdJoin] = React.useState('');
  const [passwordJoin, setPasswordJoin] = React.useState('');
  const [classNameCreate, setClassNameCreate] = React.useState('');

  return (
    <div>
      <section>
        <Title size="sect" className="mb-6">
          <div className="flex justify-between items-end">
            수업 참가하기
            <div className="w-8 h-8 relative">
              <AmbientButton icon={<QrCode28Regular />} size={48} style={{ top: -8, left: -8 }} className="absolute" />
            </div>
          </div>
        </Title>
        <div className="w-full flex flex-col gap-4">
          <TextInput
            value={classroomIdJoin}
            onInput={(v, e) => {
              const prev = classroomIdJoin;
              const { currentTarget } = e;
              const { selectionStart, selectionEnd } = currentTarget;
              if (prev.length === 11 && v.length > 11) {
                setTimeout(() => {
                  currentTarget.selectionStart = selectionStart;
                  currentTarget.selectionEnd = selectionEnd;
                }, 0);
                return;
              }
              const next = Array.from(v.toUpperCase().replace(/[^A-Za-z]/g, '').slice(0, 9)).reduce((all, one, i) => {
                const ch = Math.floor(i / 3);
                // eslint-disable-next-line no-param-reassign
                all[ch] = ([] as string[]).concat((all[ch] ?? []), one);
                return all;
              }, [] as string[][]).map((x) => x.join('')).join('-');
              if (prev.length !== next.length) {
                setTimeout(() => {
                  currentTarget.selectionStart = (selectionStart ?? 0)
                    + (next.length - prev.length === 2 ? 1 : 0);
                  currentTarget.selectionEnd = currentTarget.selectionStart;
                }, 0);
              }
              setClassroomIdJoin(next);
            }}
            placeholderText="Classroom ID"
            font="mono"
            nextRef={passwordJoinRef}
            icon={<NumberSymbol20Regular />}
          />
          <TextInput
            ref_={passwordJoinRef}
            type="password"
            font="mono"
            value={passwordJoin}
            onInput={setPasswordJoin}
            placeholderText="Password"
            nextRef={joinButtonRef}
            icon={<LockClosed20Regular />}
          />
          <Button
            ref_={joinButtonRef}
            type="primary"
            text="Join"
            width="full"
            disabled={!(classroomIdJoin && passwordJoin)}
            onClick={() => onJoin(classroomIdJoin, passwordJoin)}
            isLoading={isLoadingJoin}
          />
        </div>
      </section>
      <section className="mt-14">
        <Title size="sect" className="mb-6">수업 만들기</Title>
        <div className="w-full flex flex-col gap-4">
          <TextInput
            value={classNameCreate}
            onInput={setClassNameCreate}
            placeholderText="Class Name"
            nextRef={createButtonRef}
            icon={<Book20Regular />}
          />
          <Button
            ref_={createButtonRef}
            type="primary"
            text="Create"
            width="full"
            disabled={!classNameCreate}
            onClick={() => onCreate(classNameCreate)}
            isLoading={isLoadingCreate}
          />
        </div>
      </section>
    </div>
  );
};

export default JoinCreateContent;
