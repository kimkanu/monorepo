import { Add20Regular, ArrowHookUpLeft20Regular } from '@fluentui/react-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useHistory } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import Button from '../components/buttons/Button';
import NarrowPageWrapper from '../components/elements/NarrowPageWrapper';
import Title from '../components/elements/Title';
import ContentPadding from '../components/layout/ContentPadding';
import themeState from '../recoil/theme';
import appHistory from '../utils/history';

const WelcomeDone: React.FC = () => {
  const theme = useRecoilValue(themeState.atom);

  const { t } = useTranslation('welcome');
  const history = useHistory();
  const location = useLocation();

  return (
    <ContentPadding>
      <NarrowPageWrapper>
        <section>
          <Title size="title">
            {t('welldone')}
            {' '}
            <i className="twa twa-raised-hands" />
          </Title>
          <p
            className="text-emph text-center my-12"
            style={{
              wordBreak: 'keep-all',
              lineHeight: 1.6,
            }}
          >
            {t('welcomeDoneDesc1')}
            {' '}
            <span
              className="font-black"
              style={{
                background: `linear-gradient(90deg, ${['blue', 'green'].includes(theme) ? '#7C98FC' : '#AF83F9'}, ${['blue', 'green'].includes(theme) ? '#44D28E' : '#FF8AAD'})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Blearn!
            </span>
            {t('welcomeDoneDesc2')}
          </p>
          <div className="flex flex-col gap-6 mb-16">
            <Button
              width="full"
              type="primary"
              icon={<Add20Regular />}
              text={t('add')}
              onClick={() => {
                appHistory.replace('/classrooms/new', history);
              }}
            />
            <Button
              width="full"
              type="neutral"
              icon={<ArrowHookUpLeft20Regular />}
              text={t('back')}
              onClick={() => {
                const query = new URLSearchParams(location.search).get('redirect_uri') ?? '/';
                appHistory.replace(query, history);
              }}
            />
          </div>
        </section>
      </NarrowPageWrapper>
    </ContentPadding>
  );
};

export default WelcomeDone;
