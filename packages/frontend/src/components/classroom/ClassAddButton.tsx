import React from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  onClick?: React.MouseEventHandler;
}

const ClassAddButton: React.FC<Props> = ({ onClick }) => {
  const { t } = useTranslation('main');
  return (
    <div>
      <button
        type="button"
        className="rounded-8 m-auto w-full h-48 bg-gray-200 hover:bg-gray-300 active:bg-gray-400 flex justify-center items-center transition-button px-6"
        onClick={onClick}
        style={{ maxWidth: 380, minWidth: 'min(100%, 300px)' }}
      >
        <div>
          <div className="text-title text-center text-gray-600" style={{ fontSize: 108, lineHeight: '96px', margin: '-20px 0 -4px 0' }}>+</div>
          <div className="text-big text-center text-gray-600 font-bold">{t('add')}</div>
        </div>
      </button>
    </div>
  );
};
export default ClassAddButton;
