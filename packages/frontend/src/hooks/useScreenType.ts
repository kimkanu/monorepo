import { useRecoilValue } from 'recoil';

import screenSizeState from '../recoil/screenSize';

export enum ScreenType {
  MobilePortait = 0,
  MobileLandscape = 1,
  Desktop = 2,
}

const useScreenType: () => ScreenType = () => {
  const { width, viewportHeight, offset } = useRecoilValue(screenSizeState.atom);
  const height = viewportHeight + offset;

  const isDesktop = width >= 1024 && height >= 576;
  const isPortrait = !isDesktop && width / height <= 5 / 8;

  if (isDesktop) {
    return ScreenType.Desktop;
  }
  return isPortrait ? ScreenType.MobilePortait : ScreenType.MobileLandscape;
};

export default useScreenType;
