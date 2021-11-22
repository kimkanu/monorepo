import React from 'react';

import { Styled, mergeClassNames } from '../../utils/style';

interface Props {
  size: 'title' | 'sect' | 'sub';
}

const Title: React.FC<Styled<Props>> = ({
  size, style, className, children,
}) => (
  size === 'title'
    ? <h1 style={style} className={mergeClassNames('text-center text-title font-bold my-16', className)}>{children}</h1>
    : size === 'sect'
      ? <h2 style={style} className={mergeClassNames('text-sect font-bold mb-12 mt-4', className)}>{children}</h2>
      : <h3 style={style} className={mergeClassNames('text-sub font-bold mb-6 mt-4', className)}>{children}</h3>
);

export default Title;
