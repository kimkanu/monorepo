import React from 'react';

import ScreenType from '../types/screen';

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

type ScreenTypeKeys =
  | 'mobile'
  | 'mobilePortrait'
  | 'mobileLandscape'
  | 'desktop'
  | 'portrait'; // MobilePortait + Desktop

type ClassNames = {
  [keys in ScreenTypeKeys]: string | null;
};
export function conditionalClassName(classNames: Partial<ClassNames>) {
  return (screenType: ScreenType) => mergeClassNames(
    screenType === ScreenType.MobilePortait ? classNames.mobilePortrait : null,
    screenType === ScreenType.MobileLandscape ? classNames.mobileLandscape : null,
    screenType === ScreenType.Desktop ? classNames.desktop : null,
    screenType !== ScreenType.Desktop ? classNames.mobile : null,
    screenType !== ScreenType.MobileLandscape ? classNames.portrait : null,
  );
}

type Styles = {
  [keys in ScreenTypeKeys]: React.CSSProperties;
};
export function conditionalStyle(styles: Partial<Styles>) {
  return (screenType: ScreenType) => mergeStyles(
    screenType === ScreenType.MobilePortait ? styles.mobilePortrait : null,
    screenType === ScreenType.MobileLandscape ? styles.mobileLandscape : null,
    screenType === ScreenType.Desktop ? styles.desktop : null,
    screenType !== ScreenType.Desktop ? styles.mobile : null,
    screenType !== ScreenType.MobileLandscape ? styles.portrait : null,
  );
}
