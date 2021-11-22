import { ContactCard20Filled, SpinnerIos20Regular } from '@fluentui/react-icons';
import { UsersMePatchResponse, UsersOtherGetResponse } from '@team-10/lib';
import CancelablePromise from 'cancelable-promise';
import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';

import Button from '../components/buttons/Button';
import TextInput from '../components/input/TextInput';
import ContentPadding from '../components/layout/ContentPadding';
import Fade from '../components/layout/Fade';
import loadingState from '../recoil/loading';
import meState from '../recoil/me';
import { MeInfo } from '../types/user';

const Welcome: React.FC = () => {
  const history = useHistory();
  const location = useLocation();

  const [me, setMe] = useRecoilState(meState.atom);
  const setLoading = useSetRecoilState(loadingState.atom);

  const idRef = React.useRef<HTMLInputElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const [displayName, setDisplayName] = React.useState('');
  const [stringId, setStringId] = React.useState('');
  const [isIdInitial, setIdInitial] = React.useState(true);
  const [isWaitingResponse, setWaitingResponse] = React.useState(false);
  const continueButtonIcon = !isWaitingResponse ? undefined : <SpinnerIos20Regular className="animate-spin block text-white stroke-current" style={{ height: 20 }} />;
  const [isStringIdValid, setStringIdValid] = React.useState(true);

  React.useEffect(() => {
    if (!me.loading && me.info) {
      if (me.info.initialized) {
        // const query = decodeURI(new URLSearchParams(location.search).get('redirect_uri') ?? '/');
        // history.replace(query);
      } else {
        setDisplayName(me.info.displayName);
        setStringId(me.info.stringId);
      }
    } else if (!me.loading) {
      history.replace('/login?redirect_uri=/welcome');
    }
  }, [me.loading]);

  return (
    <ContentPadding isFooterPresent>
      <Fade visible={!me.loading}>
        {(ref) => (
          <div ref={ref} className="mx-auto" style={{ maxWidth: 480 }}>
            <h1 className="text-title mt-16 mb-12 font-bold text-center">
              반갑습니다
              {' '}
              <img
                className="w-12 h-12 inline-block align-bottom"
                src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/285/grinning-face-with-big-eyes_1f603.png"
                alt="Smiley"
              />
            </h1>
            <p className="text-emph text-center my-12">
              서비스 이용에 필요한 정보를 채워주세요!
            </p>
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <span className="text-base text-left font-bold text-gray-800">이름</span>
                <TextInput value={displayName} nextRef={idRef} onInput={setDisplayName} font="mono" icon={<ContactCard20Filled />} validator={(v) => !!v} filled />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-base text-left font-bold text-gray-800">아이디</span>
                <TextInput
                  ref_={idRef}
                  nextRef={buttonRef}
                  value={stringId}
                  onInput={setStringId}
                  font="mono"
                  icon={<ContactCard20Filled />}
                  filled
                  validator={(value) => new CancelablePromise<boolean>((
                    resolve, reject, onCancel,
                  ) => {
                    if (!/^[\w\d._\-:]{3,}$/.test(value) || value === 'me' || me.loading || !me.info) {
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
                      fetch(`/api/users/${value}`)
                        .then((res) => res.json())
                        .then((response: UsersOtherGetResponse) => {
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
                      const response: UsersMePatchResponse = await fetch(
                        'https://192.168.0.17:3567/api/users/me',
                        {
                          method: 'PATCH',
                          body: JSON.stringify({ stringId, displayName }),
                          headers: { 'Content-Type': 'application/json' },
                        },
                      ).then((r) => r.json());
                      if (response.success) {
                        const query = new URLSearchParams(location.search).get('redirect_uri') ?? '/';
                        history.replace(`/welcome/done?redirect_uri=${query}`);
                      }
                    } catch (e) {
                      // TODO: toast
                      setWaitingResponse(false);
                      console.log('TODO: toast');
                    }
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </Fade>
    </ContentPadding>
  );
};

export default Welcome;
