import React from 'react';

interface Props {
  onClick?: React.MouseEventHandler;
}

const ClassAddButton: React.FC<Props> = ({ onClick }) => (
  <div>
    <button
      type="button"
      className="rounded-8 m-auto w-full h-48 bg-gray-200 hover:bg-gray-300 active:bg-gray-400 flex justify-center items-center transition-button px-6"
      onClick={onClick}
      style={{ maxWidth: 380, minWidth: 'min(100%, 300px)' }}
    >
      <div>
        <div className="text-title text-center text-gray-600" style={{ fontSize: 108, lineHeight: '96px', margin: '-20px 0 -4px 0' }}>+</div>
        <div className="text-big text-center text-gray-600 font-bold">수업 참가 · 생성하기</div>
      </div>
    </button>
  </div>
);

export default ClassAddButton;
