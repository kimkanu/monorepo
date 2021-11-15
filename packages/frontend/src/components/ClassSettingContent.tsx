import { NumberSymbol20Regular, LockClosed20Regular, Book20Regular } from '@fluentui/react-icons';
import React from 'react';

import useInput from '../hooks/useInput';

import { mergeClassNames } from '../utils/style';

interface Props {
  userType: string;
  courseName: string;
  classId: string;
  originClassPassword?: string;
}

const ClassSettingContent: React.FC<Props> = ({
  userType, courseName, classId, originClassPassword,
}) => {
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [ClassPassword, setClassPassword] = useInput(originClassPassword);

  return (
    <div>
      <section>
        <h1 className="text-sect font-bold mb-12">
          Settings
        </h1>
        <h2 className="text-sect font-bold mb-8">
          ClassInformation
        </h2>
        <div className="relative w-full h-12 mb-4">
          <div className="text-gray-700 mr-4 absolute left-5 top-3.5 select-none pointer-events-none">
            <Book20Regular className="stroke-current" />
          </div>
          <span
            className="bg-gray-200 placeholder-gray-500 text-emph w-full h-full pr-5 pl-14 rounded-full font-mono"
          >
            {courseName}
          </span>
        </div>
        <div className="relative w-full h-12 mb-4">
          <div className="text-gray-700 mr-4 absolute left-5 top-3.5 select-none pointer-events-none">
            <NumberSymbol20Regular className="stroke-current" />
          </div>
          <span
            className="bg-gray-200 placeholder-gray-500 text-emph w-full h-full pr-5 pl-14 rounded-full font-mono"
          >
            {classId}
          </span>
        </div>
        {
          userType === 'Instructor' && (
            <form method="post">
              <div className="relative w-full h-12 mb-4">
                <div className="text-gray-700 mr-4 absolute left-5 top-3.5 select-none pointer-events-none">
                  <LockClosed20Regular className="stroke-current" />
                </div>
                <input
                  type="text"
                  placeholder="Password"
                  value={ClassPassword}
                  className="bg-gray-200 placeholder-gray-500 placeholder-sans text-emph w-full h-full pr-5 pl-14 rounded-full font-mono"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !!e.currentTarget.value && buttonRef.current) {
                      buttonRef.current.focus();
                    }
                  }}
                />
                <button
                  ref={buttonRef}
                  type="submit"
                  className={
                    mergeClassNames(
                      'w-full h-12 rounded-full outline-none flex items-center justify-center text-emph font-bold',
                      ClassPassword ? `bg-primary-500 hover:bg-primary-500 focus:bg-primary-500 active:bg-primary-700
                      text-white
                      shadow-button hover:shadow-button-hover focus:shadow-button-hover active:shadow-button shadow-color-primary
                      transition-button duration-button` : 'bg-gray-200 pointer-events-none',
                    )
                  }
                  onClick={(e) => {
                    e.currentTarget.blur();
                  }}
                >
                  <span>Change</span>
                </button>
              </div>
            </form>
          )
        }
      </section>
      <section className="mt-14">
        <h2 className="text-sect font-bold mb-8">
          Class Management
        </h2>
        <button
          type="submit"
          className="w-2/5 h-12 rounded-full
            outline-none
            flex items-center justify-center
            bg-primary-500 hover:bg-primary-500 focus:bg-primary-500 active:bg-primary-700
            text-white text-emph font-bold
            shadow-button hover:shadow-button-hover focus:shadow-button-hover active:shadow-button shadow-color-primary
            transition-button duration-button
          "
          onClick={(e) => {
            e.currentTarget.blur();
          }}
        >
          {
            userType === 'Instructor'
              ? <span>Remove the Class</span>
              : <span>Leave the Class</span>
          }
        </button>
      </section>
    </div>
  );
};

export default ClassSettingContent;
