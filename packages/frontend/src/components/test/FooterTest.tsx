import React from 'react';

import Footer from '../layout/Footer';

const members = [{
  id: 'Alice',
  img: 'dummy',
  isHost: true,
  isMe: false,
  isSpeaking: false,
},
{
  id: 'Bob',
  img: 'dummy',
  isHost: false,
  isMe: false,
  isSpeaking: true,
},
{
  id: 'Charlie',
  img: 'dummy',
  isHost: false,
  isMe: true,
  isSpeaking: false,
},
{
  id: 'David',
  img: 'dummy',
  isHost: false,
  isMe: false,
  isSpeaking: false,
},
{
  id: 'David',
  img: 'dummy',
  isHost: false,
  isMe: false,
  isSpeaking: false,
},
{
  id: 'David',
  img: 'dummy',
  isHost: false,
  isMe: false,
  isSpeaking: false,
},
{
  id: 'David',
  img: 'dummy',
  isHost: false,
  isMe: false,
  isSpeaking: false,
},
{
  id: 'David',
  img: 'dummy',
  isHost: false,
  isMe: false,
  isSpeaking: false,
}];

const FooterTest: React.FC = () => (<Footer members={members} />);

export default FooterTest;
