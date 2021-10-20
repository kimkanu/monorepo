/* eslint-disable import/prefer-default-export */

import { DefaultValue } from 'recoil';

export const guardRecoilDefaultValue = (
  candidate: any,
): candidate is DefaultValue => {
  if (candidate instanceof DefaultValue) return true;
  return false;
};
