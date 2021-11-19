import { Circle16Filled, Star16Filled } from '@fluentui/react-icons';
import React from 'react';

import { mergeClassNames, Styled } from '../../utils/style';

interface Props {
  courseName: string;
  live: boolean;
  my: boolean;
  background: string;
}

const ClassButton: React.FC<Styled<Props>> = ({
  courseName, live, my, background,
}) => (
  <li>
    <button type="button" className={mergeClassNames('rounded-lg w-full h-48 sm:flex font-semibold items-center shadow-class hover:shadow-class-hover', background)}>
      <div>
        {
          live && (
            <div className="text-emph text-white text-left ml-5 mt-5">
              <Circle16Filled className="animate-pulse mr-2 -mb-0.5 inline-block" />
              <div className="inline-block"> Live </div>
            </div>
          )
        }
        {
          my && (
            <div className="text-emph text-white text-left ml-5 flex items-center">
              <div className="inline-block">
                <Star16Filled className="mr-2 pt-2 inline-block" />
              </div>
              <div className="inline-block"> My </div>
            </div>
          )
        }
        <div className="mt-8 ml-6 mb-6 text-big text-center text-white">
          {courseName}
        </div>
      </div>
    </button>
  </li>
);

export default ClassButton;
