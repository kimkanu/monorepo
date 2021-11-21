import React from 'react';

import { mergeClassNames } from '../../utils/style';

interface Props {
  width: 'fit' | 'full';
  label: string;
  icon?: React.ReactElement;
  onClick?: React.MouseEventHandler;
}

const TempButton: React.FC<Props> = ({
  width, label, icon, onClick,
}) => (
  <button
    type="button"
    className={mergeClassNames(
      `h-12 rounded-full px-5
      outline-none
      flex items-center justify-center
      bg-primary-500 hover:bg-primary-500 focus:bg-primary-500 active:bg-primary-700
      text-white text-emph font-bold
      shadow-button hover:shadow-button-hover focus:shadow-button-hover active:shadow-button shadow-color-primary
      transition-button duration-button`,
      width === 'fit' ? 'w-fit' : 'w-full',
    )}
    onClick={onClick}
  >
    {icon && (
      <div className="mr-3 select-none pointer-events-none">
        {icon}
      </div>
    )}
    <span>{label}</span>
  </button>
);

export default TempButton;
