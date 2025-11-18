import {createSlice, PayloadAction} from '@reduxjs/toolkit';

/**
 * Speech-to-text state interface
 */
export interface STTState {
  isListening: boolean;
  recognizedText: string;
  language: string;
  error: string | null;
}

/**
 * Text-to-speech state interface
 */
export interface TTSState {
  isPlaying: boolean;
  progress: number; // 0-100
  rate: number; // Speech rate (0.0 - 1.0, 0.5 is normal speed)
  pitch: number; // Speech pitch (0.5 - 2.0)
  voice: string | null; // Voice identifier
  error: string | null;
}

/**
 * Voice features state interface
 */
export interface VoiceState {
  stt: STTState;
  tts: TTSState;
}

const initialState: VoiceState = {
  stt: {
    isListening: false,
    recognizedText: '',
    language: 'en-US',
    error: null,
  },
  tts: {
    isPlaying: false,
    progress: 0,
    rate: 0.5, // Default to normal speed (0.0-1.0 range for react-native-tts)
    pitch: 1.0,
    voice: null,
    error: null,
  },
};

const voiceSlice = createSlice({
  name: 'voice',
  initialState,
  reducers: {
    // STT actions
    startListening: state => {
      state.stt.isListening = true;
      state.stt.recognizedText = '';
      state.stt.error = null;
    },

    stopListening: state => {
      state.stt.isListening = false;
    },

    setRecognizedText: (state, action: PayloadAction<string>) => {
      state.stt.recognizedText = action.payload;
    },

    appendRecognizedText: (state, action: PayloadAction<string>) => {
      state.stt.recognizedText += action.payload;
    },

    clearRecognizedText: state => {
      state.stt.recognizedText = '';
    },

    setSTTLanguage: (state, action: PayloadAction<string>) => {
      state.stt.language = action.payload;
    },

    setSTTError: (state, action: PayloadAction<string>) => {
      state.stt.error = action.payload;
      state.stt.isListening = false;
    },

    clearSTTError: state => {
      state.stt.error = null;
    },

    // TTS actions
    startSpeaking: state => {
      state.tts.isPlaying = true;
      state.tts.progress = 0;
      state.tts.error = null;
    },

    stopSpeaking: state => {
      state.tts.isPlaying = false;
      state.tts.progress = 0;
    },

    setTTSProgress: (state, action: PayloadAction<number>) => {
      state.tts.progress = action.payload;
    },

    setTTSRate: (state, action: PayloadAction<number>) => {
      // react-native-tts rate range is 0.0 to 1.0 (0.5 is normal speed)
      state.tts.rate = Math.max(0.0, Math.min(1.0, action.payload));
    },

    setTTSPitch: (state, action: PayloadAction<number>) => {
      // react-native-tts pitch range is 0.5 to 2.0
      state.tts.pitch = Math.max(0.5, Math.min(2.0, action.payload));
    },

    setTTSVoice: (state, action: PayloadAction<string | null>) => {
      state.tts.voice = action.payload;
    },

    setTTSError: (state, action: PayloadAction<string>) => {
      state.tts.error = action.payload;
      state.tts.isPlaying = false;
    },

    clearTTSError: state => {
      state.tts.error = null;
    },

    resetVoiceState: () => initialState,
  },
});

export const {
  // STT actions
  startListening,
  stopListening,
  setRecognizedText,
  appendRecognizedText,
  clearRecognizedText,
  setSTTLanguage,
  setSTTError,
  clearSTTError,
  // TTS actions
  startSpeaking,
  stopSpeaking,
  setTTSProgress,
  setTTSRate,
  setTTSPitch,
  setTTSVoice,
  setTTSError,
  clearTTSError,
  resetVoiceState,
} = voiceSlice.actions;

export default voiceSlice.reducer;
