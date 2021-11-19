/* istanbul ignore file */
import { NumberSymbol20Regular, Comment20Regular, TextAlignJustify20Regular } from '@fluentui/react-icons';
import React from 'react';
import { useSetRecoilState } from 'recoil';

import dialogState from '../../recoil/dialog';
import dropdownState from '../../recoil/dropdown';
import TempButton from '../buttons/TempButton';

const DialogContent: React.FC = () => {
  const nextInputRef = React.useRef<HTMLInputElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  return (
    <section>
      <h2 className="text-sect font-bold mb-8">
        Join Class
      </h2>
      <div className="relative w-full h-12 mb-4">
        <div className="text-gray-700 mr-4 absolute left-5 top-3.5 select-none pointer-events-none">
          <NumberSymbol20Regular className="stroke-current" />
        </div>
        <input
          placeholder="Hash 1"
          className="bg-gray-200 placeholder-gray-500 text-emph w-full h-full pr-5 pl-14 rounded-full font-mono"
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !!e.currentTarget.value && nextInputRef.current) {
              nextInputRef.current.focus();
            }
          }}
        />
      </div>
      <div className="relative w-full h-12 mb-4">
        <div className="text-gray-700 mr-4 absolute left-5 top-3.5 select-none pointer-events-none">
          <NumberSymbol20Regular className="stroke-current" />
        </div>
        <input
          ref={nextInputRef}
          placeholder="Hash 2"
          className="bg-gray-200 placeholder-gray-500 text-emph w-full h-full pr-5 pl-14 rounded-full font-mono"
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !!e.currentTarget.value && buttonRef.current) {
              buttonRef.current.focus();
            }
          }}
        />
      </div>
      <button
        ref={buttonRef}
        type="button"
        className="
          w-full h-12 rounded-full
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
        <div className="mr-3 select-none pointer-events-none">
          <NumberSymbol20Regular className="stroke-current" />
        </div>
        <span>Re-hash</span>
      </button>
    </section>
  );
};

const DropdownContent: React.FC = () => (
  <section>
    <h2 className="text-sect font-bold">Sample Dropdown</h2>
  </section>
);

const DropdownTest: React.FC = () => {
  const setDialog = useSetRecoilState(dialogState.atom);
  const setDialogVisible = useSetRecoilState(dialogState.visible);

  const setDropdown = useSetRecoilState(dropdownState.atom);
  const setDropdownVisible = useSetRecoilState(dropdownState.visible);

  return (
    <div className="w-full h-full flex flex-col gap-4 justify-center items-center">
      <TempButton
        width="fit"
        label="Open Dropdown"
        icon={<TextAlignJustify20Regular className="stroke-current" />}
        onClick={() => {
          setDropdown({
            visible: true,
            element: <DropdownContent />,
            onClose: () => setDropdownVisible(false),
          });
        }}
      />
      <TempButton
        width="fit"
        label="Open Dialog"
        icon={<Comment20Regular className="stroke-current" />}
        onClick={() => {
          setDialog({
            visible: true,
            element: <DialogContent />,
            onClose: () => setDialogVisible(false),
          });
        }}
      />
    </div>
  );
};

export default DropdownTest;
