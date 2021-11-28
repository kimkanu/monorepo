import { ContactCard20Filled, SpinnerIos20Regular } from '@fluentui/react-icons';
import CancelablePromise from 'cancelable-promise';
import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil';

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

  const me = useRecoilValue(meState.atom);
  const [meInfo, setMeInfo] = useRecoilState(meState.info);
  const addToast = useSetRecoilState(toastState.new);

  const idRef = React.useRef<HTMLInputElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const [displayName, setDisplayName] = React.useState<string | null>(null);
  const [stringId, setStringId] = React.useState<string | null>(null);
  const [initialId, setInitialId] = React.useState<string>('');
  const [isWaitingResponse, setWaitingResponse] = React.useState(false);
  const continueButtonIcon = !isWaitingResponse ? undefined : <SpinnerIos20Regular className="animate-spin block text-white stroke-current" style={{ height: 20 }} />;
  const [isStringIdValid, setStringIdValid] = React.useState(true);
  const [isRedirectPrevented, setRedirectPrevented] = React.useState(false);

  React.useEffect(() => {
    if (meInfo) {
      if (meInfo.initialized && !isRedirectPrevented) {
        const query = new URLSearchParams(location.search).get('redirect_uri') ?? '/';
        history.replace(query);
      } else {
        setDisplayName(meInfo.displayName!);
        setStringId(meInfo.stringId!);
        setInitialId(meInfo.stringId!);
      }
    }
  }, [me.loaded, meInfo]);

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
              validator={(v) => new CancelablePromise<boolean>((
                resolve, reject, onCancel,
              ) => {
                if (v === null) {
                  const timeout = setTimeout(() => {
                    resolve(true);
                  }, 1e+9);
                  onCancel(() => {
                    clearTimeout(timeout);
                  });
                  return;
                }

                resolve(!!v);
              })}
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
                if (value === null) {
                  const timeout = setTimeout(() => {
                    resolve(true);
                  }, 1e+9);
                  onCancel(() => {
                    clearTimeout(timeout);
                  });
                  return;
                }

                if (!/^[\w\d._\-:]{3,}$/.test(value) || value === 'me' || !me.loaded || !me.info) {
                  setStringIdValid(false);
                  resolve(false);
                  return;
                }
                if (stringId !== null && value === initialId) {
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
                    .catch(() => {
                      setStringIdValid(false);
                      resolve(false);
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
                  if (!displayName || !stringId || !isStringIdValid) return;
                  setWaitingResponse(true);
                  const response = await fetchAPI('PATCH /users/me', {}, { stringId, displayName });
                  if (response.success) {
                    setMeInfo({
                      ...response.payload,
                      initialized: true,
                    });
                    const query = new URLSearchParams(location.search).get('redirect_uri') ?? '/';
                    setRedirectPrevented(true);
                    history.replace(`/welcome/done?redirect_uri=${query}`);
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
