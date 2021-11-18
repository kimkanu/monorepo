import {
  NumberSymbol20Regular, LockClosed20Regular,
  QrCode28Regular, Book20Regular,
} from '@fluentui/react-icons';
import React from 'react';

import Button from './Button';
import TextInput from './TextInput';

interface Props {
  handleCreate: (courseName: string) => void;
  onClose: () => void;
}

const JoinCreateContent: React.FC<Props> = ({ handleCreate, onClose }) => {
  const joinNextInputRef = React.useRef<HTMLInputElement>(null);
  const joinButtonRef = React.useRef<HTMLButtonElement>(null);
  const createButtonRef = React.useRef<HTMLButtonElement>(null);
  const [joinClassId, setClassId] = React.useState('');
  const [joinPassword, setPassword] = React.useState('');
  const [createCourseName, setCourseName] = React.useState('');

  return (
    <div>
      <section>
        <div className="flex justify-between mb-8 items-end">
          <h2 className="text-sect font-bold mb-0">
            Join Class
          </h2>
          <button type="button" className="text-gray-700 bg-gray-200 rounded-full p-2 justify-self-end">
            <QrCode28Regular className="stroke-current" />
          </button>
        </div>
        <div className="relative w-full h-12 mb-4">
          <TextInput
            value={joinClassId}
            onInput={setClassId}
            icon={<NumberSymbol20Regular />}
            type="text"
            name="joinClassId"
            font="mono"
            placeholderText="Classromm ID"
            align="left"
            nextRef={joinNextInputRef}
          />
        </div>
        <div className="relative w-full h-12 mb-4">
          <TextInput
            value={joinPassword}
            onInput={setPassword}
            icon={<LockClosed20Regular />}
            type="password"
            name="joinPassword"
            font="mono"
            placeholderText="Password"
            align="left"
            nextRef={joinButtonRef}
          />
        </div>
        <Button
          type="primary"
          disabled={(joinClassId === '') && (joinPassword === '')}
          text="Join"
          width="full"
          height={48}
          ref_={joinButtonRef}
        />
      </section>
      <section className="mt-14">
        <h2 className="text-sect font-bold mb-8">
          Create Class
        </h2>
        <div className="relative w-full h-12 mb-4">
          <TextInput
            value={createCourseName}
            onInput={setCourseName}
            icon={<Book20Regular />}
            type="text"
            name="createCourseName"
            font="mono"
            placeholderText="Class Name"
            align="left"
            nextRef={createButtonRef}
          />
        </div>
        <Button
          type="primary"
          disabled={createCourseName === ''}
          text="Create"
          width="full"
          height={48}
          ref_={createButtonRef}
          onClick={() => {
            handleCreate(createCourseName);
            onClose();
          }}
        />
      </section>
    </div>
  );
};

export default JoinCreateContent;
