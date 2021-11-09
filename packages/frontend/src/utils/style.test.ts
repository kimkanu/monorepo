import ScreenType from '../types/screen';

import {
  mergeClassNames, mergeStyles, conditionalClassName, conditionalStyle,
} from './style';

describe('mergeClassNames', () => {
  test('Should concatenate all classNames', () => {
    expect(mergeClassNames()).toBe('');
    expect(mergeClassNames('a', 'b', 'c')).toBe('a b c');
    expect(mergeClassNames('a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j')).toBe('a b c d e f g h i j');
  });

  test('Should remove nulls and undefineds', () => {
    expect(mergeClassNames('a', null, 'b', undefined, 'c', null, 'd')).toBe('a b c d');
  });
});

describe('mergeStyles', () => {
  test('Should concatenate all styles', () => {
    expect(mergeStyles(
      { height: '100%', width: '100%' },
      { backgroundColor: 'red', boxShadow: 'none' },
    )).toStrictEqual({
      backgroundColor: 'red', boxShadow: 'none', height: '100%', width: '100%',
    });
  });

  test('Should remove nulls and undefineds', () => {
    expect(mergeStyles(
      { height: '100%', width: '100%' },
      null,
      { backgroundColor: 'red', boxShadow: 'none' },
      null,
      undefined,
    )).toStrictEqual({
      backgroundColor: 'red', boxShadow: 'none', height: '100%', width: '100%',
    });
  });

  test('Later styles should override the former ones', () => {
    expect(mergeStyles(
      { height: '100%', width: '100%' },
      { boxShadow: 'none', height: '100%' },
    )).toStrictEqual({
      boxShadow: 'none', height: '100%', width: '100%',
    });
  });
});

describe('conditionalClassName', () => {
  test('Should work well', () => {
    const classNameFunction = conditionalClassName({
      desktop: 'desktop',
      mobile: 'mobile',
      mobileLandscape: 'mobileLandscape',
      mobilePortrait: 'mobilePortrait',
      portrait: 'portrait',
    });
    expect(classNameFunction(ScreenType.MobilePortrait).split(' ').sort())
      .toStrictEqual(['mobile', 'mobilePortrait', 'portrait'].sort());
    expect(classNameFunction(ScreenType.MobileLandscape).split(' ').sort())
      .toStrictEqual(['mobile', 'mobileLandscape'].sort());
    expect(classNameFunction(ScreenType.Desktop).split(' ').sort())
      .toStrictEqual(['desktop', 'portrait'].sort());
  });
});

describe('conditionalStyle', () => {
  test('Should work well', () => {
    const styleFunction = conditionalStyle({
      desktop: { width: '1px' },
      mobile: { height: '2px' },
      mobileLandscape: { margin: '3px' },
      mobilePortrait: { padding: '4px' },
      portrait: { fontSize: '5px' },
    });
    expect(styleFunction(ScreenType.MobilePortrait))
      .toStrictEqual({
        fontSize: '5px', height: '2px', padding: '4px',
      });
    expect(styleFunction(ScreenType.MobileLandscape))
      .toStrictEqual({
        height: '2px', margin: '3px',
      });
    expect(styleFunction(ScreenType.Desktop))
      .toStrictEqual({
        fontSize: '5px', width: '1px',
      });
  });
});
