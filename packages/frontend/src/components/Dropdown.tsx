import React from 'react';
import { CSSTransition } from 'react-transition-group';

import useScreenType, { ScreenType } from '../hooks/useScreenType';
import { Styled, mergeClassNames, mergeStyles } from '../utils/style';

import styles from './Dropdown.module.css';

interface Props {
  right?: number;
  visible: boolean;
  onClose: () => void;
}

const Dropdown: React.FC<Styled<Props>> = ({
  style, className, visible, onClose, children, right = 0,
}) => {
  const [additionalClassName, setAdditionalClassName] = React.useState<string | null>(null);
  const screenType = useScreenType();

  React.useEffect(() => {
    if (visible) {
      setAdditionalClassName(styles.visible);
    }
  }, [screenType]);

  React.useEffect(() => {
    setAdditionalClassName(null);
  }, [visible]);

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
          'absolute w-100vw h-100wh flex flex-col z-dropdown cursor-default',
          screenType === ScreenType.Desktop
            ? mergeClassNames('items-end justify-start', styles.desktop)
            : mergeClassNames('items-center justify-end', styles.mobile),
          additionalClassName,
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
            screenType === ScreenType.Desktop ? {
              marginRight: right,
              top: 'calc(env(safe-area-inset-top, 0px) + 64px)',
            } : null,
            {
              maxHeight: 'calc(100 * var(--wh) - 1rem)',
            },
            style,
          )}
          className={mergeClassNames(
            'h-fit max-h-5/6 z-dropdown-1 bg-white overflow-hidden',
            screenType === ScreenType.Desktop
              ? 'w-96 shadow-dropdown-desktop rounded-b-8 absolute'
              : 'w-full shadow-dropdown-mobile rounded-t-12',
            {
              [ScreenType.MobilePortait]: 'max-w-md',
              [ScreenType.MobileLandscape]: 'max-w-sm',
              [ScreenType.Desktop]: null,
            }[screenType],
            className,
          )}
        >
          <div className="px-8 py-8 w-full h-full overflow-auto">
            {children}
            {screenType !== ScreenType.Desktop && <div style={{ height: 'env(safe-area-inset-bottom, 0px)' }} />}
          </div>
        </div>
      </div>

    </CSSTransition>
  );
};

export default Dropdown;
