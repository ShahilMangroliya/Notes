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

// Storage keys
export const THEME_STORAGE_KEY = 'notes.theme';
export const NOTES_LIST_KEY = 'notes.list';
export const NOTE_PREFIX = 'notes.';
export const VOICE_LANGUAGE_KEY = 'notes.voice.language';
export const TTS_RATE_KEY = 'notes.tts.rate';
export const TTS_PITCH_KEY = 'notes.tts.pitch';
export const TTS_VOICE_KEY = 'notes.tts.voice';

/**
 * Helper function to get note storage key
 * @param noteId - Note ID
 * @returns Storage key for the note
 */
export const getNoteKey = (noteId: string): string => {
  return `${NOTE_PREFIX}${noteId}`;
};
