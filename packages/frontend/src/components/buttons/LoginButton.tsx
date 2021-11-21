import { Provider } from '@team-10/lib';
import React from 'react';

import Button from './Button';

import styles from './LoginButton.module.css';

interface Props {
  provider: Provider;
  logo: string;
  onClick?: React.MouseEventHandler;
}

const providerDisplayName: Record<Provider, string> = {
  naver: '네이버 아이디로 로그인',
  github: 'GitHub 계정으로 로그인',
};

const LoginButton: React.FC<Props> = ({
  provider,
  logo,
  onClick,
}) => (
  <div>
    <Button
      width="full"
      type="primary"
      text={providerDisplayName[provider]}
      className={styles[provider]}
      onClick={onClick}
    />
    <div style={{ width: 62, height: 48 }} className="absolute left-0 top-0 flex justify-center items-center pointer-events-none select-none">
      <img src={logo} className="w-10 h-10" alt={`${provider.toLocaleUpperCase()} 로고`} />
    </div>
  </div>
);

export default LoginButton;
