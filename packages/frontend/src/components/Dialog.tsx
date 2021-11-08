import React from 'react';
import { CSSTransition } from 'react-transition-group';

import useScreenType, { ScreenType } from '../hooks/useScreenType';
import { Styled, mergeClassNames, mergeStyles } from '../utils/style';

import styles from './Dialog.module.css';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const Dialog: React.FC<Styled<Props>> = ({
  style, className, visible, onClose, children,
}) => {
  const screenType = useScreenType();

  return (
    <CSSTransition
      unmountOnExit
      in={visible}
      timeout={400}
      classNames={{
        enter: styles.invisible,
        enterActive: styles.beingVisible,
        enterDone: styles.visible,
        exit: styles.visible,
        exitActive: styles.beingInvisible,
        exitDone: styles.invisible,
      }}
    >
      <div
        role="button"
        tabIndex={0}
        className={mergeClassNames(
          'absolute w-100vw h-100wh flex flex-col z-dialog cursor-default',
          screenType === ScreenType.Desktop
            ? mergeClassNames('items-center justify-center', styles.desktop)
            : mergeClassNames('items-center justify-end', styles.mobile),
        )}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
        onKeyUp={(e) => {
          if (e.key === 'Escape') {
            onClose();
          }
        }}
      >
        <div
          style={mergeStyles(
            {
              maxHeight: 'calc(90 * var(--wh))',
              overflow: 'auto',
            },
            style,
          )}
          className={mergeClassNames(
            'h-fit max-h-5/6 px-8 py-8 z-dialog-1 bg-white',
            screenType === ScreenType.Desktop
              ? 'w-96 shadow-dropdown-desktop rounded-8'
              : 'w-full shadow-dropdown-mobile rounded-t-12',
            {
              [ScreenType.MobilePortait]: 'max-w-md',
              [ScreenType.MobileLandscape]: 'max-w-sm',
              [ScreenType.Desktop]: null,
            }[screenType],
            className,
          )}
        >
          {children}
          {screenType !== ScreenType.Desktop && <div style={{ height: 'env(safe-area-inset-bottom, 0px)' }} />}
        </div>
      </div>
    </CSSTransition>
  );
};

export default Dialog;
