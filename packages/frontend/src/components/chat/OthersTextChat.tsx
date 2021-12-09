import { SpinnerIos20Regular, Translate20Filled, ArrowCounterclockwise20Regular } from '@fluentui/react-icons/lib/cjs/index';
import { TextChatContent } from '@team-10/lib';
import React from 'react';

import { mergeClassNames } from '../../utils/style';
import AmbientButton from '../buttons/AmbientButton';

import styles from './Chat.module.css';

interface Props {
  dark: boolean;
  content: TextChatContent;
  translation?: string;
  onTranslate: () => Promise<void>;
}
const OthersTextChat: React.FC<Props> = ({
  dark, content, translation, onTranslate,
}) => {
  const [isTranslated, setTranslated] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);
  const [isTranslatable, setTranslatable] = React.useState(true);
  return (
    <div
      style={{ padding: '5px 12px' }}
      className={mergeClassNames(
        'text-base rounded-tl rounded-tr-2xl rounded-b-2xl relative',
        dark ? 'bg-gray-600 bg-opacity-70 text-white' : 'bg-gray-200',
        styles.maxWidth,
      )}
    >
      {isTranslatable && (
        <div className="absolute bottom-0 w-8 h-8" style={{ right: -40 }}>
          <AmbientButton
            size={32}
            dark={dark}
            icon={isLoading
              ? <SpinnerIos20Regular className="animate-spin block" style={{ height: 20 }} />
              : isTranslated
                ? <ArrowCounterclockwise20Regular />
                : <Translate20Filled />}
            onClick={() => {
              if (!isLoading) return;
              if (translation) {
                setTranslated((t) => !t);
              } else if (!isTranslated) {
                setLoading(true);
                onTranslate()
                  .then(() => {
                    setLoading(false);
                    setTranslated(true);
                  })
                  .catch(() => setTranslatable(false));
              }
            }}
          />
        </div>
      )}
      {content.text}
    </div>
  );
};

export default OthersTextChat;
