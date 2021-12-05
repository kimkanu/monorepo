import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import ClassList from '../components/classroom/ClassList';
import Title from '../components/elements/Title';
import ContentPadding from '../components/layout/ContentPadding';
import classroomsState from '../recoil/classrooms';
import meState from '../recoil/me';
import appHistory from '../utils/history';

const Main = React.forwardRef<HTMLDivElement>((props, ref) => {
  const classrooms = useRecoilValue(classroomsState.atom);
  const me = useRecoilValue(meState.atom);
  const history = useHistory();
  const { t } = useTranslation('main');

  return (
    <ContentPadding ref={ref}>
      {!me.loaded ? null : me.info ? (
        <>
          <Title size="title">{t('class')}</Title>
          <ClassList
            userId={me.info.stringId}
            classrooms={classrooms}
            onClickClassroom={(classroom) => appHistory.push(`/classrooms/${classroom.hash}`, history)}
            onJoinOrCreate={() => appHistory.push('/classrooms/new', history)}
          />
          <div className="transition-all duration-300" style={{ height: classrooms[0]?.video ? 152 : 64 }} />
        </>
      ) : (
        <>
          <Title size="title">{t('login')}</Title>
        </>
      )}
    </ContentPadding>
  );
});

export default Main;
