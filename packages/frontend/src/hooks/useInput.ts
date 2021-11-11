import React, { Dispatch, ChangeEvent, SetStateAction } from 'react';

const useInput = <T>(initialData: T):
[T, (e: ChangeEvent<HTMLInputElement>) => void, Dispatch<SetStateAction<T>>] => {
  const [value, setValue] = React.useState(initialData);
  const handler = React.useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value as unknown as T);
  }, []);
  return [value, handler, setValue];
};

export default useInput;
