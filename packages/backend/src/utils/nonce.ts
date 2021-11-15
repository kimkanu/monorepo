import Crypto from 'crypto';

export default function nonce<EventName extends string>(eventName: EventName): `${EventName}-${number}` {
  return `${eventName}-${Crypto.randomInt(2 ** 48 - 7)}`;
}
