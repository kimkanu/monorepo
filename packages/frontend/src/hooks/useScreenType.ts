import { useMediaQuery } from '@react-hook/media-query';

export enum ScreenType {
  MobilePortait = 0,
  MobileLandscape = 1,
  Desktop = 2,
}

const useScreenType: () => ScreenType = () => {
  const isDesktop = useMediaQuery('only screen and (min-width: 1024px) and (min-height: 576px)');
  const isPortrait = useMediaQuery('only screen and (max-device-aspect-ratio: 0.625)');

  if (isDesktop) {
    return ScreenType.Desktop;
  }
  return isPortrait ? ScreenType.MobilePortait : ScreenType.MobileLandscape;
};

export default useScreenType;
