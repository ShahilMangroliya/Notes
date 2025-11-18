import {MMKVLoader} from 'react-native-mmkv-storage';

const storageLoader = new MMKVLoader()
  .withInstanceID('notes-storage')
  .initialize();

export const storage = storageLoader;

export const getItem = (
  key: string,
  type: 'boolean' | 'string' | 'number' | 'arrayBuffer',
): boolean | string | number | ArrayBuffer | undefined => {
  if (type === 'boolean') {
    const value = storage.getBool(key);
    return value ?? undefined;
  } else if (type === 'string') {
    return storage.getString(key) ?? undefined;
  } else if (type === 'number') {
    return storage.getInt(key) ?? undefined;
  } else if (type === 'arrayBuffer') {
    // ArrayBuffer not directly supported, using array as fallback
    const array = storage.getArray<number>(key);
    if (array) {
      return new Uint8Array(array).buffer;
    }
    return undefined;
  } else {
    throw new Error('Invalid type');
  }
};

export const setItem = (
  key: string,
  value: boolean | string | number | ArrayBuffer,
) => {
  if (typeof value === 'boolean') {
    return storage.setBool(key, value);
  } else if (typeof value === 'string') {
    return storage.setString(key, value);
  } else if (typeof value === 'number') {
    return storage.setInt(key, value);
  } else if (value instanceof ArrayBuffer) {
    // ArrayBuffer not directly supported, convert to array
    const array = Array.from(new Uint8Array(value));
    return storage.setArray(key, array);
  } else {
    throw new Error('Invalid value type');
  }
};

export const removeItem = (key: string): boolean => {
  return storage.removeItem(key);
};

export const clear = () => {
  return storage.clearStore();
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
