/* eslint-disable jsx-a11y/label-has-associated-control */
import { Edit20Filled, SpinnerIos20Regular } from '@fluentui/react-icons';
import React from 'react';

import { Styled, mergeClassNames } from '../../utils/style';
import Button from '../buttons/Button';

import styles from './ProfileImageEditor.module.css';

interface Props {
  src: string;
  isChanging: boolean;
  onEdit: (file: Blob) => void;
}

const ProfileImageEditor: React.FC<Styled<Props>> = ({
  src, isChanging, onEdit, style, className,
}) => (
  <div className={mergeClassNames('w-56 h-56 relative mx-auto', className)} style={style}>
    <img
      src={src}
      alt="프로필 사진"
      style={{ '--shadow-color': 'rgba(0, 0, 0, 0.1)' } as React.CSSProperties}
      className="w-56 h-56 rounded-full overflow-hidden shadow-button object-cover object-center"
    />
    <label
      htmlFor={styles.input}
      className="rounded-full outline-none flex items-center justify-center font-bold transition-button duration-button w-12 h-12 bg-white text-emph shadow-color-neutral shadow-class hover:shadow-class-hover focus:shadow-class-hover active:shadow-class active:bg-gray-200 text-gray-700 cursor-pointer right-0 bottom-0 absolute"
    >
      {isChanging
        ? <SpinnerIos20Regular className="animate-spin block stroke-current" style={{ height: 20 }} />
        : <Edit20Filled style={{ transform: 'scale(120%)' }} className="block" />}
    </label>
    <input
      id={styles.input}
      className={styles.input}
      type="file"
      accept="image/png, image/jpeg, image/gif, image/tiff"
      onChange={(e) => {
        const file = e.currentTarget.files?.[0];
        if (file) {
          onEdit(file);
        }
      }}
    />
  </div>
);

export default ProfileImageEditor;
