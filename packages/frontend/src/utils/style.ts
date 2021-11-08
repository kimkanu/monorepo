import React from 'react';

export function mergeClassNames(...classNames: (string | null | undefined)[]): string {
  return classNames.filter((c) => !!c).join(' ');
}

export function mergeStyles(
  ...styles: (React.CSSProperties | null | undefined)[]
): React.CSSProperties {
  return styles
    .filter((s) => !!s)
    .reduce((a, b) => ({ ...a, ...b }), {}) as React.CSSProperties;
}

export type Styled<T> = T & {
  style?: React.CSSProperties;
  className?: string;
};
