/* istanbul ignore file */
import React from 'react';
import { Link } from 'react-router-dom';

import TempButton from '../components/TempButton';
import DropdownTest from '../components/test/DropdownTest';

interface Props {
  name: string;
}

const Test: React.FC<Props> = ({ name }) => {
  switch (name) {
    case '': {
      return (
        <div className="w-full h-full max-w-sm flex flex-col justify-center items-center mx-auto gap-4">
          <Link className="block relative w-full" to="/tests/dropdown">
            <TempButton width="full" label="Dropdown and Dialog" />
          </Link>
        </div>
      );
    }
    case 'dropdown': {
      return <DropdownTest />;
    }
    default: {
      return null;
    }
  }
};

export default Test;
