import {useCallback, useEffect} from 'react';
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
import {checkAudioPermission} from '@/util/PermissionHelper';

/**
 * Custom hook for managing voice features (STT and TTS)
 */
export const useVoice = () => {
  const dispatch = useAppDispatch();

  const sttState = useAppSelector(selectSTTState);
  const ttsState = useAppSelector(selectTTSState);

  // Setup and cleanup Voice listeners
  useEffect(() => {
    // Setup voice event handlers
    Voice.onSpeechStart = () => {
      // Speech started
    };

    Voice.onSpeechRecognized = () => {
      // Speech recognized
    };

    Voice.onSpeechEnd = () => {
      // Speech ended - stop listening and reset icon
      dispatch(stopListening());
    };

    Voice.onSpeechError = (event: any) => {
      dispatch(
        setSTTError(event?.error?.message || 'Speech recognition error'),
      );
      dispatch(stopListening());
    };

    Voice.onSpeechResults = (event: any) => {
      if (event?.value && event.value.length > 0) {
        dispatch(setRecognizedText(event.value[0]));
      }
    };

    Voice.onSpeechPartialResults = (event: any) => {
      // Update with partial results as user speaks
      if (event?.value && event.value.length > 0) {
        dispatch(setRecognizedText(event.value[0]));
      }
    };

    Voice.onSpeechVolumeChanged = () => {
      // Volume changed (optional)
    };

    // Cleanup on unmount
    return () => {
      Voice.destroy()
        .then(() => Voice.removeAllListeners())
        .catch(() => {
          // Ignore cleanup errors
        });
    };
  }, [dispatch]);

  // Speech-to-Text Actions
  const handleStartListening = useCallback(async () => {
    try {
      // Check if Voice is available
      const isAvailable = await Voice.isAvailable();
      if (!isAvailable) {
        dispatch(setSTTError('Voice recognition is not available'));
        return;
      }

      // Check audio permissions (comprehensive check)
      try {
        await checkAudioPermission();
      } catch {
        dispatch(setSTTError('Microphone permission denied'));
        return;
      }

      // Start voice recognition
      await Voice.start('en-US');
      dispatch(startListening());
    } catch (error) {
      dispatch(
        setSTTError(
          (error as Error).message || 'Failed to start voice recognition',
        ),
      );
      dispatch(stopListening());
    }
  }, [dispatch]);

  const handleStopListening = useCallback(async () => {
    try {
      await Voice.stop();
      dispatch(clearRecognizedText());
      dispatch(stopListening());
    } catch {
      // Ignore stop errors - Voice might already be stopped
      dispatch(clearRecognizedText());
      dispatch(stopListening());
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

        // Speak text using default TTS settings
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
    [dispatch],
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
