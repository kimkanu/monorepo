import React from 'react';
import { CSSTransition } from 'react-transition-group';

import useScreenType from '../../hooks/useScreenType';
import {
  Styled, mergeClassNames, mergeStyles, conditionalClassName, conditionalStyle,
} from '../../utils/style';

import styles from './Dropdown.module.css';

interface Props {
  right?: number;
  visible: boolean;
  onClose: () => void;
}

const Dropdown: React.FC<Styled<Props>> = ({
  style, className, visible, onClose, children, right = 0,
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
          'absolute w-100vw h-100wh flex flex-col cursor-default',
          conditionalClassName({
            desktop: mergeClassNames('items-end justify-start z-dropdown-desktop', styles.desktop),
            mobile: mergeClassNames('items-center justify-end z-dropdown-mobile', styles.mobile),
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
            conditionalStyle({
              desktop: {
                marginRight: right,
                top: 'calc(env(safe-area-inset-top, 0px) + 64px)',
              },
            })(screenType),
            {
              maxHeight: 'calc(100 * var(--wh) - 1rem)',
            },
            style,
          )}
          className={mergeClassNames(
            'h-fit max-h-5/6 bg-white overflow-hidden',
            conditionalClassName({
              desktop: 'w-96 z-dropdown-desktop-1 shadow-dropdown-desktop rounded-b-8 absolute',
              mobile: 'w-full z-dropdown-mobile-1 shadow-dropdown-mobile rounded-t-12',
              mobileLandscape: 'max-w-sm',
              mobilePortrait: 'max-w-md',
            })(screenType),
            className,
          )}
        >
          <div className="px-8 py-8 w-full h-full overflow-auto">
            {children}
            <div style={{ height: 'env(safe-area-inset-bottom, 0px)' }} />
          </div>
        </div>
      </div>

    </CSSTransition>
  );
};

export default Dropdown;
