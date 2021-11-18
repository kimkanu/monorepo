import { FullScreenMaximize24Filled } from '@fluentui/react-icons';
import React from 'react';
import { CSSTransition } from 'react-transition-group';

import useScreenType from '../hooks/useScreenType';
import ScreenType from '../types/screen';
import { mergeClassNames, Styled } from '../utils/style';

import styles from './YTWrapper.module.css';

interface YTMaximizationHintProps {
  onClick?: React.MouseEventHandler;
}

const YTMaximizationHint: React.FC<YTMaximizationHintProps> = ({ onClick }) => (
  <div
    className="group w-full h-full absolute z-40 opacity-0 hover:opacity-100 flex justify-center items-center transition-all duration-300"
    role="button"
    onClick={onClick}
    tabIndex={0}
    aria-hidden
  >
    <div className="w-full h-full absolute top-0 left-0 bg-black opacity-60" />
    <FullScreenMaximize24Filled primaryFill="white" className="opacity-100 z-50" />
  </div>
);

interface Props {
  isPresent: boolean;
  inClassroom: boolean;
  onClick?: React.MouseEventHandler;
}

const YTWrapper: React.FC<Styled<Props>> = ({
  onClick, inClassroom, isPresent, style, className, children,
}) => {
  const TIMEOUT = 400;

  const [initialInClassroom, setInitialInClassroom] = React.useState(inClassroom);
  const nodeRef = React.useRef<HTMLDivElement>(null);

  const screenType = useScreenType();
  const screenTypeName = ScreenType[screenType];

  // The following two `useEffect`s deal with delayed changes of
  // `inClassroom` variable, which is stored in `initialInClassroom`.
  // When the transition is completed, `initialInClassroom` is set
  // to be the same with `inClassroom`.
  // It is necessary to define the initial state of the player.
  // Refer to Line 78.
  React.useEffect(() => {
    setInitialInClassroom(inClassroom);
  }, [screenType]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setInitialInClassroom(inClassroom);
    }, TIMEOUT);
    return () => clearTimeout(timeout);
  }, [inClassroom]);

  return (
    <CSSTransition
      in={inClassroom}
      timeout={TIMEOUT}
      nodeRef={nodeRef}
      classNames={{
        enter: styles[`min${screenTypeName}`],
        enterActive: styles[`beingMax${screenTypeName}`],
        enterDone: styles[`max${screenTypeName}`],
        exit: styles[`max${screenTypeName}`],
        exitActive: styles[`beingMin${screenTypeName}`],
        exitDone: styles[`min${screenTypeName}`],
      }}
    >
      <div
        ref={nodeRef}
        style={style}
        className={mergeClassNames(
          'relative overflow-hidden z-layout-2',
          inClassroom ? 'shadow-none' : 'shadow-button hover:shadow-button-hover',
          isPresent || inClassroom ? null : 'opacity-0 pointer-events-none select-none',
          className,
          styles[`${initialInClassroom ? 'max' : 'min'}${screenTypeName}`],
        )}
      >
        {!inClassroom && <YTMaximizationHint onClick={onClick} />}
        {children}
      </div>
    </CSSTransition>
  );
};

export default YTWrapper;
