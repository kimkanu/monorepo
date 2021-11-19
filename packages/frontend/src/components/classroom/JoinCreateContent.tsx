import {
  NumberSymbol20Regular, LockClosed20Regular,
  QrCode28Regular, Book20Regular,
} from '@fluentui/react-icons';
import React from 'react';

import AmbientButton from '../buttons/AmbientButton';
import Button from '../buttons/Button';
import TextInput from '../input/TextInput';

const JoinCreateContent: React.FC = () => {
  const passwordJoinRef = React.useRef<HTMLInputElement>(null);
  const joinButtonRef = React.useRef<HTMLButtonElement>(null);
  const createButtonRef = React.useRef<HTMLButtonElement>(null);
  const [classroomIdJoin, setClassroomIdJoin] = React.useState('');
  const [passwordJoin, setPasswordJoin] = React.useState('');
  const [classNameCreate, setClassNameCreate] = React.useState('');

  return (
    <div>
      <section>
        <div className="flex justify-between mb-6 items-end">
          <h2 className="text-sect font-bold">
            Join Class
          </h2>
          <div className="w-8 h-8 relative">
            <AmbientButton icon={<QrCode28Regular />} size={48} style={{ top: -8, left: -8 }} className="absolute" />
          </div>
        </div>
        <div className="w-full flex flex-col gap-4">
          <TextInput
            value={classroomIdJoin}
            onInput={setClassroomIdJoin}
            placeholderText="Classroom ID"
            nextRef={passwordJoinRef}
            icon={<NumberSymbol20Regular />}
          />
          <TextInput
            ref_={passwordJoinRef}
            type="password"
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
          />
        </div>
      </section>
      <section className="mt-14">
        <h2 className="text-sect font-bold mb-6">
          Create Class
        </h2>
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
          />
        </div>
      </section>
    </div>
  );
};

export default JoinCreateContent;
