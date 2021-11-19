/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
/* istanbul ignore file */
import {
  ArrowCounterclockwise20Regular,
  NumberSymbol20Regular,
  Mail20Regular,
  Password24Regular,
  Send20Regular,
} from '@fluentui/react-icons';
import React from 'react';

import Button from '../buttons/Button';
import TextInput from '../input/TextInput';

import { RadioInput } from './TestComponents';

function emailValidator(emailAddress: string) {
  const sQtext = '[^\\x0d\\x22\\x5c\\x80-\\xff]';
  const sDtext = '[^\\x0d\\x5b-\\x5d\\x80-\\xff]';
  const sAtom = '[^\\x00-\\x20\\x22\\x28\\x29\\x2c\\x2e\\x3a-\\x3c\\x3e\\x40\\x5b-\\x5d\\x7f-\\xff]+';
  const sQuotedPair = '\\x5c[\\x00-\\x7f]';
  const sDomainLiteral = `\\x5b(${sDtext}|${sQuotedPair})*\\x5d`;
  const sQuotedString = `\\x22(${sQtext}|${sQuotedPair})*\\x22`;
  const sDomainRef = sAtom;
  const sSubDomain = `(${sDomainRef}|${sDomainLiteral})`;
  const sWord = `(${sAtom}|${sQuotedString})`;
  const sDomain = `${sSubDomain}(\\x2e${sSubDomain})*`;
  const sLocalPart = `${sWord}(\\x2e${sWord})*`;
  const sAddrSpec = `${sLocalPart}\\x40${sDomain}`; // complete RFC822 email address spec
  const sValidEmail = `^${sAddrSpec}$`; // as whole string

  const reValidEmail = new RegExp(sValidEmail);

  return reValidEmail.test(emailAddress);
}

function generateClassroomHash(): string {
  const generateSyllable = (): string => {
    const random = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
    const first = ['B', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'S', 'T', 'W'];
    const second = ['A', 'E', 'I', 'O', 'U'];
    const third = ['K', 'L', 'M', 'N', 'P', 'S', 'T', 'Z'];

    return `${random(first)}${random(second)}${random(third)}`;
  };

  return `${generateSyllable()}-${generateSyllable()}-${generateSyllable()}`;
}

const TextInputTest: React.FC = () => {
  const [icon, setIcon] = React.useState(0);
  const [text, setText] = React.useState('');

  const buttonRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (icon === 1) {
      setText(generateClassroomHash());
    } else if (icon === 2) {
      setText('example@email.com');
    }
  }, [icon]);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div className="flex gap-8 w-fit">
        <RadioInput inputClassName="text-gray-700" labelClassName="hover:bg-gray-200" checked={icon === 0} text="None" onChange={() => setIcon(0)} />
        <RadioInput inputClassName="text-gray-700" labelClassName="hover:bg-gray-200" checked={icon === 1} text="Hash" onChange={() => setIcon(1)} />
        <RadioInput inputClassName="text-gray-700" labelClassName="hover:bg-gray-200" checked={icon === 2} text="Email" onChange={() => setIcon(2)} />
        <RadioInput inputClassName="text-gray-700" labelClassName="hover:bg-gray-200" checked={icon === 3} text="Password" onChange={() => setIcon(3)} />
      </div>
      <div className="px-12 w-full max-w-md h-14 flex justify-center items-center mt-8">
        <TextInput
          value={text}
          onInput={setText}
          icon={{
            0: null,
            1: <NumberSymbol20Regular />,
            2: <Mail20Regular />,
            3: <div style={{ transform: 'scale(91.6%) translate(-2px,-2px)' }}><Password24Regular /></div>,
          }[icon]}
          font={icon !== 0 ? 'mono' : 'sans'}
          type={icon === 3 ? 'password' : 'text'}
          readOnly={icon === 1}
          button={icon === 1 ? (
            <Button
              ref_={buttonRef}
              icon={<ArrowCounterclockwise20Regular />}
              type="destructive"
              width="fit-content"
              text="Reset"
              onClick={() => setText(generateClassroomHash())}
            />
          ) : icon === 2 ? (
            <Button
              ref_={buttonRef}
              icon={<Send20Regular className="block" style={{ transform: 'translateX(1px)' }} />}
              type="primary"
              width="fit-content"
              onClick={() => setText('')}
              disabled={!emailValidator(text)}
            />
          ) : undefined}
          nextRef={icon === 2 ? buttonRef : undefined}
          name={icon === 2 ? 'email' : undefined}
          validator={icon !== 2 ? undefined : emailValidator}
        />
      </div>
    </div>
  );
};

export default TextInputTest;
