import { Circle20Filled, Star20Filled } from '@fluentui/react-icons';
import React from 'react';
import seedrandom from 'seedrandom';

import { Classroom } from '../../types/classroom';
import { mergeClassNames, Styled } from '../../utils/style';

import styles from './ClassButton.module.css';

const buttonStyles: { shadowColor:string;backgroundImage:string }[] = [
  { shadowColor: 'rgba(150, 50, 67, 0.5)', backgroundImage: 'linear-gradient(154.74deg, #FF4438 2.23%, #44244B 95.98%)' },
  { shadowColor: 'rgba(111, 109, 239, 0.6)', backgroundImage: 'linear-gradient(199.76deg, #47A7FF 14.47%, #AE0FD6 90.77%)' },
  { shadowColor: 'rgba(0, 0, 0, 0.25)', backgroundImage: 'linear-gradient(180deg, #161420 0%, #595867 100%)' },
];

interface Props {
  classroom: Classroom;
}

const ClassButton: React.FC<Styled<Props>> = ({
  classroom, style, className,
}) => {
  const [index, setIndex] = React.useState(Math.abs(seedrandom(classroom.hash).int32()));
  const { shadowColor, backgroundImage } = buttonStyles[index % buttonStyles.length];

  React.useEffect(() => {
    setIndex(Math.abs(seedrandom(classroom.hash).int32()));
  }, [classroom.hash]);

  return (
    <button
      type="button"
      className={mergeClassNames(
        'relative rounded-8 w-full h-48 p-5 flex flex-col justify-between font-bold shadow-class hover:shadow-class-hover active:shadow-class text-white text-left',
        styles.classButton,
        className,
      )}
      style={{
        maxWidth: 380, minWidth: 'min(100%, 300px)', '--shadow-color': shadowColor, ...style,
      } as React.CSSProperties}
    >
      {/* Background */}
      <div
        className={mergeClassNames('absolute rounded-8 w-full h-full top-0 left-0', styles.background)}
        style={{ backgroundImage }}
      />

      {/* Badges */}
      <div className="relative flex flex-col" style={{ gap: 2 }}>
        {classroom.isLive && (
          <div className="flex gap-3 items-center">
            <div className="w-5 h-5 inline-flex justify-center items-center">
              <Circle20Filled className="absolute left-0 top-0" />
              <Circle20Filled className="absolute left-0 top-0 animate-ping" />
            </div>
            <div className="text-emph">LIVE</div>
          </div>
        )}
        {classroom.isMine && (
          <div className="flex gap-3 items-center">
            <div className="w-5 h-5 inline-flex justify-center items-center"><Star20Filled /></div>
            <div className="text-emph">MY</div>
          </div>
        )}
      </div>

      {/* Class name */}
      <div
        className="relative p-1 text-big"
        style={{
          lineHeight: '100%',
          maxHeight: 88,
          lineClamp: 3,
          WebkitLineClamp: 3,
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          wordBreak: 'break-word',
          overflow: 'hidden',
          hyphens: 'auto',
        }}
      >
        {classroom.name}
      </div>
    </button>
  );
};

export default ClassButton;
