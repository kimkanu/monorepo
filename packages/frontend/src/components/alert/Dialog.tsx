import React from 'react';
import { CSSTransition } from 'react-transition-group';

import useScreenType from '../../hooks/useScreenType';
import {
  Styled, mergeClassNames, mergeStyles, conditionalClassName,
} from '../../utils/style';

import styles from './Dialog.module.css';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const Dialog: React.FC<Styled<Props>> = ({
  style, className, visible, onClose, children,
}) => {
  const TIMEOUT = 400;

  const screenType = useScreenType();

  const [initialVisible, setInitialVisible] = React.useState(visible);

  React.useEffect(() => {
    setInitialVisible(initialVisible);
  }, [screenType]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setInitialVisible(visible);
    }, TIMEOUT);
    return () => clearTimeout(timeout);
  }, [visible]);

  return (
    <CSSTransition
      mountOnEnter
      unmountOnExit
      in={visible}
      timeout={400}
      classNames={{
        appear: styles.invisible,
        appearActive: styles.beingVisible,
        appearDone: styles.visible,
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
          conditionalClassName({
            desktop: mergeClassNames('items-center justify-center', styles.desktop),
            mobile: mergeClassNames('items-center justify-end', styles.mobile),
          })(screenType),
          styles[`${initialVisible ? 'visible' : 'invisible'}`],
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
            conditionalClassName({
              desktop: 'w-96 shadow-dropdown-desktop rounded-8',
              mobile: 'w-full shadow-dropdown-mobile rounded-t-12',
              mobileLandscape: 'max-w-sm',
              mobilePortrait: 'max-w-md',
            })(screenType),
            className,
          )}
        >
          {children}
          <div style={{ height: 'env(safe-area-inset-bottom, 0px)' }} />
        </div>
      </div>
    </CSSTransition>
  );
};

export default Dialog;
