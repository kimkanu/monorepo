import { useRecoilValue } from 'recoil';

import screenSizeState from '../recoil/screenSize';
import ScreenType from '../types/screen';

const CHAT_SECTION_HEIGHT_THRESHOLD = 80;

const useScreenType: () => ScreenType = () => {
  const {
    width, actualHeight, viewportHeight, offset,
  } = useRecoilValue(screenSizeState.atom);
  const height = viewportHeight + offset;

  const isDesktop = width >= 1024 && height >= 576;
  const isPortrait = !isDesktop && (
    viewportHeight - width * (9 / 16) - 140 >= CHAT_SECTION_HEIGHT_THRESHOLD
  );

  if (isDesktop) {
    return ScreenType.Desktop;
  }
  return isPortrait ? ScreenType.MobilePortrait : ScreenType.MobileLandscape;
};

export default useScreenType;
