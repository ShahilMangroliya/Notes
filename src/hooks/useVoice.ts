import {useCallback} from 'react';
import {useAppDispatch, useAppSelector} from './hooks';
import {
  startListening,
  stopListening,
  setRecognizedText,
  clearRecognizedText,
  setSTTError,
  startSpeaking,
  stopSpeaking,
  setTTSError,
} from '@/redux/voiceSlice';
import {selectSTTState, selectTTSState} from '@/redux/selectors';
import Voice from '@react-native-voice/voice';
import Tts from 'react-native-tts';
import {requestMicrophonePermission} from '@/util/PermissionHelper';

/**
 * Custom hook for managing voice features (STT and TTS)
 */
export const useVoice = () => {
  const dispatch = useAppDispatch();

  const sttState = useAppSelector(selectSTTState);
  const ttsState = useAppSelector(selectTTSState);

  // Speech-to-Text Actions
  const handleStartListening = useCallback(async () => {
    try {
      // Request microphone permission
      const granted = await requestMicrophonePermission();
      if (!granted) {
        dispatch(setSTTError('Microphone permission denied'));
        return;
      }

      // Start voice recognition
      await Voice.start('en-US');
      dispatch(startListening());

      // Setup voice event handlers
      Voice.onSpeechResults = (event: any) => {
        if (event.value && event.value.length > 0) {
          dispatch(setRecognizedText(event.value[0]));
        }
      };

      Voice.onSpeechError = (event: any) => {
        dispatch(setSTTError(event.error?.message || 'Speech recognition error'));
        dispatch(stopListening());
      };
    } catch (error) {
      dispatch(setSTTError((error as Error).message));
      dispatch(stopListening());
    }
  }, [dispatch]);

  const handleStopListening = useCallback(async () => {
    try {
      await Voice.stop();
      dispatch(stopListening());
    } catch (error) {
      dispatch(setSTTError((error as Error).message));
    }
  }, [dispatch]);

  const handleClearRecognizedText = useCallback(() => {
    dispatch(clearRecognizedText());
  }, [dispatch]);

  // Text-to-Speech Actions
  const handleSpeak = useCallback(
    async (text: string) => {
      try {
        dispatch(startSpeaking());

        // Configure TTS
        await Tts.setDefaultRate(ttsState.rate);
        await Tts.setDefaultPitch(ttsState.pitch);

        // Speak text
        await Tts.speak(text);

        // Setup TTS event handlers
        Tts.addEventListener('tts-finish', () => {
          dispatch(stopSpeaking());
        });

        Tts.addEventListener('tts-cancel', () => {
          dispatch(stopSpeaking());
        });
      } catch (error) {
        dispatch(setTTSError((error as Error).message));
        dispatch(stopSpeaking());
      }
    },
    [ttsState.rate, ttsState.pitch, dispatch],
  );

  const handleStopSpeaking = useCallback(async () => {
    try {
      await Tts.stop();
      dispatch(stopSpeaking());
    } catch (error) {
      dispatch(setTTSError((error as Error).message));
    }
  }, [dispatch]);

  return {
    // STT State
    isListening: sttState.isListening,
    recognizedText: sttState.recognizedText,
    sttError: sttState.error,

    // TTS State
    isPlaying: ttsState.isPlaying,
    ttsError: ttsState.error,

    // STT Actions
    startListening: handleStartListening,
    stopListening: handleStopListening,
    clearRecognizedText: handleClearRecognizedText,

    // TTS Actions
    speak: handleSpeak,
    stopSpeaking: handleStopSpeaking,
  };
};

export default useVoice;
