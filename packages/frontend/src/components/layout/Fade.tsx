import { SpinnerIos20Filled } from '@fluentui/react-icons';
import React from 'react';
import { CSSTransition } from 'react-transition-group';

import styles from './Fade.module.css';

interface Props {
  visible: boolean;
  delay?: number;
  children: (ref: React.RefObject<any>) => React.ReactElement;
}

const Fade: React.FC<Props> = ({ visible, delay = 200, children }) => {
  const ref = React.useRef<HTMLDivElement>(null);

  return (
    <CSSTransition
      mountOnEnter
      unmountOnExit
      in={visible}
      timeout={delay}
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
      nodeRef={ref}
    >
      {children(ref)}
    </CSSTransition>
  );
};

export default Fade;
