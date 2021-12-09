import { Circle20Filled, Star20Filled } from '@fluentui/react-icons';
import { ClassroomJSON } from '@team-10/lib';
import React from 'react';
import seedrandom from 'seedrandom';

import { mergeClassNames, Styled } from '../../utils/style';

import styles from './ClassButton.module.css';

const buttonStyles: { shadowColor: string; backgroundImage: string }[] = [
  { shadowColor: 'rgba(150, 50, 67, 0.5)', backgroundImage: 'linear-gradient(154.74deg, #FF4438 2.23%, #44244B 95.98%)' },
  { shadowColor: 'rgba(111, 109, 239, 0.6)', backgroundImage: 'linear-gradient(199.76deg, #47A7FF 14.47%, #AE0FD6 90.77%)' },
  { shadowColor: 'rgba(0, 0, 0, 0.25)', backgroundImage: 'linear-gradient(180deg, #161420 0%, #595867 100%)' },
  { shadowColor: 'rgba(71, 102, 120, 0.5)', backgroundImage: 'linear-gradient(to top, #476678 0%, #a7b1b6 100%)' },
  { shadowColor: 'rgba(118, 115, 213, 0.5)', backgroundImage: 'linear-gradient(-30deg, #3a73fe 0%, #ff7378 100%)' },
  { shadowColor: 'rgba(0, 154, 236, 0.5)', backgroundImage: 'linear-gradient(20deg, #0088ff 0%, #00d8ae 100%)' },
  { shadowColor: 'rgba(255, 91, 112, 0.5)', backgroundImage: 'linear-gradient(10deg, #ff4b82 0%, #ffbf03 100%)' },
  { shadowColor: 'rgba(51, 8, 103, 0.4)', backgroundImage: 'linear-gradient(to bottom, #30cfd0 0%, #330867 100%)' },
  { shadowColor: 'rgba(80, 82, 133, 0.5)', backgroundImage: 'linear-gradient(to top, #505285 0%, #585e92 12%, #65689f 25%, #7474b0 37%, #7e7ebb 50%, #8389c7 62%, #9795d4 75%, #a2a1dc 87%, #b5aee4 100%)' },
  { shadowColor: '#ff084480', backgroundImage: 'linear-gradient(to top, #ff0844 0%, #ffb199 100%)' },
];

interface Props {
  userId: string;
  classroom: ClassroomJSON;
  onClick?: React.MouseEventHandler;
}

const ClassButton: React.FC<Styled<Props>> = ({
  userId, classroom, onClick, style, className,
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
        'relative m-auto rounded-8 w-full h-48 p-5 flex flex-col justify-between font-bold shadow-class hover:shadow-class-hover active:shadow-class text-white text-left',
        styles.classButton,
        className,
      )}
      style={{
        maxWidth: 380, minWidth: 'min(100%, 300px)', '--shadow-color': shadowColor, ...style,
      } as React.CSSProperties}
      onClick={onClick}
    >
      {/* Background */}
      <div
        className={mergeClassNames('absolute rounded-8 w-full h-full top-0 left-0', styles.background)}
        style={{ backgroundImage }}
      />

      {/* Badges */}
      <div className="relative w-full flex justify-between">
        <div className="flex flex-col" style={{ gap: 2 }}>
          {classroom.isLive && (
          <div className="flex gap-3 items-center">
            <div className="w-5 h-5 inline-flex justify-center items-center">
              <Circle20Filled className="absolute left-0 top-0" />
              <Circle20Filled className="absolute left-0 top-0 animate-ping" />
            </div>
            <div className="text-emph">LIVE</div>
          </div>
          )}
          {classroom.instructor.stringId === userId && (
          <div className="flex gap-3 items-center">
            <div className="w-5 h-5 inline-flex justify-center items-center"><Star20Filled /></div>
            <div className="text-emph">MY</div>
          </div>
          )}
        </div>
        <span className="text-base font-mono mr-1">{classroom.hash}</span>
      </div>

      {/* Class name */}
      <div
        className="relative p-1 text-big"
        style={{
          lineHeight: '115%',
          maxHeight: 101,
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
