import type {NativeStackScreenProps} from '@react-navigation/native-stack';

/**
 * Root navigation stack parameter list
 */
export type RootStackParamList = {
  Home: undefined;
  NoteEditor: {
    noteId?: string; // undefined = create new
    noteType: 'text' | 'drawing';
  };
  NoteView: {
    noteId: string;
  };
  Settings: undefined;
};

/**
 * Home screen navigation props
 */
export type HomeScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Home'
>;

/**
 * Note editor screen navigation props
 */
export type NoteEditorScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'NoteEditor'
>;

/**
 * Note view screen navigation props
 */
export type NoteViewScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'NoteView'
>;

/**
 * Settings screen navigation props
 */
export type SettingsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Settings'
>;
