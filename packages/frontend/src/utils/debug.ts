/* istanbul ignore file */
/* eslint-disable import/prefer-default-export */

export function enumColorClassNames(index: number) {
  const colorClassNames = [
    'text-red-500',
    'text-green-500',
    'text-blue-500',
    'text-violet-500',
    'text-pink-500',
  ];

  return colorClassNames[index % colorClassNames.length];
}
