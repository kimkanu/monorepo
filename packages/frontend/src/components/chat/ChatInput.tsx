import {
  Send24Filled,
  Image24Regular,
} from '@fluentui/react-icons';
import React from 'react';

import { mergeClassNames } from '../../utils/style';

import AmbientButton from '../buttons/AmbientButton';
import TextInput from '../input/TextInput';

interface Props {
  dark: boolean; // 모바일 가로 교실 화면인지
  text: string;
  onInput?: (newText: string) => void;
  onPhoto: (file: Blob) => void;
  onSend?: () => void;
  extended?: boolean;
}

const ChatInput: React.FC<Props> = ({
  dark, extended = false, text, onInput, onPhoto, onSend,
}) => (
  <div
    className={mergeClassNames(
      'w-full flex justify-center gap-2',
      dark ? 'bg-gray-900 bg-opacity-50 max-w-sm rounded-full' : null,
      extended ? 'pt-4 rounded-t-8' : dark ? 'py-1.5' : 'pb-3',
    )}
    style={{ height: extended ? 128 : 60, boxShadow: extended ? '0 0 16px var(--shadow-color)' : 'none' }}
  >
    {extended ? (
      <div className="flex flex-col justify-between w-full px-4">
        <div style={{ height: 60 }}>
          <TextInput
            value={text}
            onInput={onInput}
            onSubmit={onSend ? () => onSend() : undefined}
          />
        </div>
        <div style={{ height: 60 }} className="w-full flex flex-row justify-between">
          <div className="w-12 h-12 overflow-hidden flex">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label
              htmlFor="ChatInput__input"
              className={mergeClassNames(
                'flex justify-center items-center transition rounded-full bg-transparent w-12 h-12 cursor-pointer',
                dark ? 'text-white bg-gray-800 hover:bg-gray-500 hover:bg-opacity-50' : 'text-gray-700 hover:bg-gray-200',
              )}
            >
              <Image24Regular />
            </label>
            <input
              id="ChatInput__input"
              style={{ width: 0 }}
              type="file"
              accept="image/png, image/jpeg, image/gif, image/tiff"
              onChange={(e) => {
                const file = e.currentTarget.files?.[0];
                if (file) {
                  onPhoto(file);
                  console.log(file);
                  e.currentTarget.value = '';
                }
              }}
            />
          </div>
          <AmbientButton
            size={48}
            icon={<Send24Filled className="text-primary-500" />}
            onClick={onSend}
            dark={dark}
            filled
          />
        </div>
      </div>
    ) : (
      <div className={mergeClassNames('w-full flex flex-row justify-center', dark ? 'gap-2' : 'gap-4')}>
        <div className="w-12 h-12 overflow-hidden flex">
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label
            htmlFor="ChatInput__input"
            className={mergeClassNames(
              'flex justify-center items-center transition rounded-full bg-transparent w-12 h-12 cursor-pointer',
              dark ? 'text-white bg-gray-800 hover:bg-gray-500 hover:bg-opacity-50' : 'text-gray-700 hover:bg-gray-200',
            )}
          >
            <Image24Regular />
          </label>
          <input
            id="ChatInput__input"
            style={{ width: 0 }}
            type="file"
            accept="image/png, image/jpeg, image/gif, image/tiff"
            onChange={(e) => {
              const file = e.currentTarget.files?.[0];
              if (file) {
                onPhoto(file);
                console.log(file);
                e.currentTarget.value = '';
              }
            }}
          />
        </div>
        <TextInput
          value={text}
          onInput={onInput}
          onSubmit={onSend}
          className={mergeClassNames(dark ? 'bg-gray-600 bg-opacity-70' : null)}
          containerStyle={extended ? {} : { width: 'calc(100% - 8rem)' }}
          style={dark ? { color: 'white' } : {}}
        />
        <AmbientButton
          size={48}
          icon={<Send24Filled className="text-primary-500" />}
          onClick={onSend}
          dark={dark}
          filled
        />
      </div>
    )}
  </div>
);

export default ChatInput;
