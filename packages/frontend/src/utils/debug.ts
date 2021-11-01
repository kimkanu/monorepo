/* eslint-disable import/prefer-default-export */

export function enumColorClassNames(index: number) {
  const colorClassNames = [
    'text-red-600',
    'text-yellow-600',
    'text-green-600',
    'text-blue-600',
    'text-indigo-600',
    'text-purple-600',
    'text-pink-600',
  ];

  return colorClassNames[index % colorClassNames.length];
}
