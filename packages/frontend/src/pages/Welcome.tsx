import { ContactCard20Filled, SpinnerIos20Regular } from '@fluentui/react-icons';
import CancelablePromise from 'cancelable-promise';
import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';

import Button from '../components/buttons/Button';
import NarrowPageWrapper from '../components/elements/NarrowPageWrapper';
import Title from '../components/elements/Title';
import TextInput from '../components/input/TextInput';
import ContentPadding from '../components/layout/ContentPadding';
import meState from '../recoil/me';
import toastState from '../recoil/toast';
import fetchAPI from '../utils/fetch';

const Welcome: React.FC = () => {
  const history = useHistory();
  const location = useLocation();

  const [me, setMe] = useRecoilState(meState.atom);
  const addToast = useSetRecoilState(toastState.new);

  const idRef = React.useRef<HTMLInputElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const [displayName, setDisplayName] = React.useState('');
  const [stringId, setStringId] = React.useState('');
  const [isIdInitial, setIdInitial] = React.useState(true);
  const [isWaitingResponse, setWaitingResponse] = React.useState(false);
  const continueButtonIcon = !isWaitingResponse ? undefined : <SpinnerIos20Regular className="animate-spin block text-white stroke-current" style={{ height: 20 }} />;
  const [isStringIdValid, setStringIdValid] = React.useState(true);

  React.useEffect(() => {
    if (me.loaded && me.info) {
      if (me.info.initialized) {
        const query = new URLSearchParams(location.search).get('redirect_uri') ?? '/';
        history.replace(query);
      } else {
        setDisplayName(me.info.displayName);
        setStringId(me.info.stringId);
      }
    } else if (me.loaded) {
      history.replace('/login?redirect_uri=/welcome');
    }
  }, [me.loaded]);

  return (
    <ContentPadding isFooterPresent>
      <NarrowPageWrapper>
        <Title size="title">
          반갑습니다
          {' '}
          <i className="twa twa-grinning" />
        </Title>
        <p className="text-emph text-center my-12">
          서비스 이용에 필요한 정보를 채워주세요!
        </p>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <span className="text-base text-left font-bold text-gray-800">이름</span>
            <TextInput
              value={displayName}
              nextRef={idRef}
              onInput={setDisplayName}
              readOnly={isWaitingResponse}
              font="mono"
              icon={<ContactCard20Filled />}
              validator={(v) => !!v}
              filled
            />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-base text-left font-bold text-gray-800">아이디</span>
            <TextInput
              ref_={idRef}
              nextRef={buttonRef}
              value={stringId}
              onInput={setStringId}
              readOnly={isWaitingResponse}
              font="mono"
              icon={<ContactCard20Filled />}
              filled
              validator={(value) => new CancelablePromise<boolean>((
                resolve, reject, onCancel,
              ) => {
                if (!/^[\w\d._\-:]{3,}$/.test(value) || value === 'me' || !me.loaded || !me.info) {
                  setStringIdValid(false);
                  resolve(false);
                  return;
                }
                if (value === me.info.stringId) {
                  setStringIdValid(true);
                  resolve(true);
                  return;
                }
                if (isIdInitial && value !== me.info.stringId) {
                  setIdInitial(false);
                  setStringIdValid(true);
                  resolve(true);
                  return;
                }

                const timeout = setTimeout(() => {
                  fetchAPI('GET /users/:id', { id: value })
                    .then((response) => {
                      setStringIdValid(!response.success);
                      resolve(!response.success);
                    })
                    .catch((e) => {
                      setStringIdValid(false);
                      reject(e);
                    });
                }, 250);
                onCancel(() => {
                  clearTimeout(timeout);
                });
              })}
            />
          </div>
          <div className="mt-4 mb-16">
            <Button
              ref_={buttonRef}
              width="full"
              type="primary"
              text={!isWaitingResponse ? '가입 완료하기' : undefined}
              icon={continueButtonIcon}
              disabled={!displayName || !isStringIdValid}
              className={isWaitingResponse ? 'pointer-events-none' : undefined}
              onClick={async () => {
                if (isWaitingResponse) return;
                try {
                  setWaitingResponse(true);
                  const response = await fetchAPI('PATCH /users/me', {}, { stringId, displayName });
                  if (response.success) {
                    if (me.loaded && !!me.info) {
                      setMe({
                        loaded: true,
                        info: {
                          ...me.info,
                          stringId: response.payload.stringId,
                          displayName: response.payload.displayName,
                          initialized: true,
                        },
                      });
                      const query = new URLSearchParams(location.search).get('redirect_uri') ?? '/';
                      history.replace(`/welcome/done?redirect_uri=${query}`);
                    }
                  } else {
                    setWaitingResponse(false);
                    addToast({
                      sentAt: new Date(),
                      type: 'error',
                      message: `[${response.error.code}] ${response.error.extra?.details ?? ''}`,
                    });
                  }
                } catch (e) {
                  addToast({
                    sentAt: new Date(),
                    type: 'error',
                    message: '알 수 없는 오류가 발생했습니다.',
                  });
                }
              }}
            />
          </div>
        </div>
      </NarrowPageWrapper>
    </ContentPadding>
  );
};

export default Welcome;
