import {createMMKV} from 'react-native-mmkv';

export const storage = createMMKV();

export const getItem = (
  key: string,
  type: 'boolean' | 'string' | 'number' | 'arrayBuffer',
): boolean | string | number | ArrayBuffer | undefined => {
  if (type === 'boolean') {
    return storage.getBoolean(key);
  } else if (type === 'string') {
    return storage.getString(key);
  } else if (type === 'number') {
    return storage.getNumber(key);
  } else if (type === 'arrayBuffer') {
    return storage.getBuffer(key);
  } else {
    throw new Error('Invalid type');
  }
};

export const setItem = (
  key: string,
  value: boolean | string | number | ArrayBuffer,
) => {
  return storage.set(key, value);
};

export const removeItem = (key: string): boolean => {
  return storage.remove(key);
};

export const clear = () => {
  return storage.clearAll();
};

export default {getItem, setItem, removeItem, clear};

export const THEME_STORAGE_KEY = 'notes.theme';
