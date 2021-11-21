/* istanbul ignore file */
import { consoleLogHi } from '@team-10/lib';
import React from 'react';
import { Link } from 'react-router-dom';

import TempButton from '../components/buttons/TempButton';
import AudioVisualizerTest from '../components/test/AudioVisualizerTest';
import ButtonTest from '../components/test/ButtonTest';
import ClassSettingPageTest from '../components/test/ClassSettingPageTest';
import DropdownTest from '../components/test/DropdownTest';
import JoinCreatePageTest from '../components/test/JoinCreatePageTest';
import SocketStreamTest from '../components/test/SocketStreamTest';
import TextInputTest from '../components/test/TextInputTest';
import ToastTest from '../components/test/ToastTest';

/** 여기에 테스트할 컴포넌트를 넣어주세요! `pathname: ['설명', 컴포넌트]` 형식 */
const componentsToTest: Record<string, [string, React.ReactElement]> = {
  dropdown: ['Dropdown and Dialog', <DropdownTest />],
  'audio-visualizer': ['Audio Visualizer', <AudioVisualizerTest />],
  'socket-stream': ['Socket Stream', <SocketStreamTest />],
  toast: ['Toasts', <ToastTest />],
  joincreate: ['Join/Create Class', <JoinCreatePageTest />],
  buttons: ['Buttons', <ButtonTest />],
  classsetting: ['class setting', <ClassSettingPageTest />],
  'text-input': ['Text Input', <TextInputTest />],
};

interface Props {
  name: string;
}

const Test: React.FC<Props> = ({ name }) => {
  React.useEffect(() => {
    consoleLogHi();
  }, []);

  if (name === '') {
    return (
      <div className="w-full h-full max-w-sm flex flex-col justify-center items-center mx-auto gap-4">
        {Object.entries(componentsToTest).map(([pathname, [description]]) => (
          <Link key={pathname} className="block relative w-full" to={`/tests/${pathname}`}>
            <TempButton width="full" label={description} />
          </Link>
        ))}
      </div>
    );
  }

  const index = Object.keys(componentsToTest).findIndex((key) => key === name);
  if (index >= 0) {
    return componentsToTest[name][1];
  }

  return null;
};

export default Test;
