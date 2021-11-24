import { Add20Regular, ArrowHookUpLeft20Regular } from '@fluentui/react-icons';
import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import Button from '../components/buttons/Button';
import NarrowPageWrapper from '../components/elements/NarrowPageWrapper';
import Title from '../components/elements/Title';
import ContentPadding from '../components/layout/ContentPadding';
import Fade from '../components/layout/Fade';
import meState from '../recoil/me';
import themeState from '../recoil/theme';

const WelcomeDone: React.FC = () => {
  const theme = useRecoilValue(themeState.atom);
  const me = useRecoilValue(meState.atom);

  const history = useHistory();
  const location = useLocation();

  return (
    <ContentPadding isFooterPresent>
      <Fade visible={me.loaded}>
        {(ref) => (
          <NarrowPageWrapper ref_={ref}>
            <section>
              <Title size="title">
                가입 완료!
                {' '}
                <i className="twa twa-raised-hands" />
              </Title>
              <p className="text-emph text-center my-12" style={{ wordBreak: 'keep-all', lineHeight: 1.6 }}>
                온라인과 오프라인의 장점을 접목한
                {' '}
                <span
                  style={{
                    background: `linear-gradient(${['blue', 'green'].includes(theme) ? '#7C98FC' : '#AF83F9'}, ${['blue', 'green'].includes(theme) ? '#44D28E' : '#FF8AAD'})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Blearn!
                </span>
                에서 즐겁고 편하게 공부하세요!
              </p>
              <div className="flex flex-col gap-6">
                <Button
                  width="full"
                  type="primary"
                  icon={<Add20Regular />}
                  text="수업 추가하러 가기"
                  onClick={() => {
                    history.replace('/');
                  }}
                />
                <Button
                  width="full"
                  type="neutral"
                  icon={<ArrowHookUpLeft20Regular />}
                  text="이전 페이지로 돌아가기"
                  onClick={() => {
                    const query = new URLSearchParams(location.search).get('redirect_uri') ?? '/';
                    history.replace(query);
                  }}
                />
              </div>
            </section>
          </NarrowPageWrapper>
        )}
      </Fade>

    </ContentPadding>
  );
};

export default WelcomeDone;
