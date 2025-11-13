# Voice Features Implementation

## Overview

Speech-to-Text (voice input) and Text-to-Speech (read aloud) functionality for enhanced accessibility and productivity.

## Dependencies

```bash
npm install @react-native-voice/voice react-native-tts
```

## Platform Configuration

### iOS Setup

**File:** `ios/Notes/Info.plist`

```xml
<key>NSMicrophoneUsageDescription</key>
<string>We need access to your microphone for voice input</string>
<key>NSSpeechRecognitionUsageDescription</key>
<string>We need access to speech recognition for voice input</string>
```

### Android Setup

**File:** `android/app/src/main/AndroidManifest.xml`

```xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.INTERNET" />
```

## Speech-to-Text (Voice Input)

### useVoiceInput Hook

**File:** `src/hooks/useVoiceInput.ts`

```typescript
import {useEffect, useCallback} from 'react';
import Voice from '@react-native-voice/voice';
import {useAppDispatch, useAppSelector} from './hooks';
import {
  startListening,
  stopListening,
  setRecognizedText,
  setSTTError,
} from '@/redux/voiceSlice';

export const useVoiceInput = () => {
  const dispatch = useAppDispatch();
  const {isListening, recognizedText, language} = useAppSelector(
    state => state.voice.stt
  );

  useEffect(() => {
    // Setup voice recognition listeners
    Voice.onSpeechStart = () => {
      dispatch(startListening());
    };

    Voice.onSpeechEnd = () => {
      dispatch(stopListening());
    };

    Voice.onSpeechResults = (e) => {
      if (e.value && e.value.length > 0) {
        dispatch(setRecognizedText(e.value[0]));
      }
    };

    Voice.onSpeechPartialResults = (e) => {
      if (e.value && e.value.length > 0) {
        dispatch(setRecognizedText(e.value[0]));
      }
    };

    Voice.onSpeechError = (e) => {
      dispatch(setSTTError(e.error?.message || 'Speech recognition error'));
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, [dispatch]);

  const start = useCallback(async () => {
    try {
      await Voice.start(language);
    } catch (error) {
      dispatch(setSTTError('Failed to start voice recognition'));
    }
  }, [language, dispatch]);

  const stop = useCallback(async () => {
    try {
      await Voice.stop();
    } catch (error) {
      dispatch(setSTTError('Failed to stop voice recognition'));
    }
  }, [dispatch]);

  const cancel = useCallback(async () => {
    try {
      await Voice.cancel();
      dispatch(stopListening());
    } catch (error) {
      dispatch(setSTTError('Failed to cancel voice recognition'));
    }
  }, [dispatch]);

  return {
    isListening,
    recognizedText,
    start,
    stop,
    cancel,
  };
};
```

### VoiceInput Component

**File:** `src/components/VoiceInput/VoiceInput.tsx`

```typescript
export interface VoiceInputProps {
  onResult: (text: string) => void;
  onClose: () => void;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({onResult, onClose}) => {
  const {isListening, recognizedText, start, stop} = useVoiceInput();

  const handleDone = useCallback(() => {
    stop();
    onResult(recognizedText);
    onClose();
  }, [recognizedText, stop, onResult, onClose]);

  return (
    <Modal $visible={isListening} onClose={onClose}>
      <ModalContent>
        <WaveformAnimation $isActive={isListening} />

        <RecognizedText>{recognizedText || 'Listening...'}</RecognizedText>

        <ButtonRow>
          <Button onPress={handleDone}>
            <ButtonText>Done</ButtonText>
          </Button>
          <Button onPress={onClose} $variant="secondary">
            <ButtonText>Cancel</ButtonText>
          </Button>
        </ButtonRow>
      </ModalContent>
    </Modal>
  );
};
```

### Permission Handling

**File:** `src/util/PermissionHelper.ts`

```typescript
import {PermissionsAndroid, Platform} from 'react-native';

export const requestMicrophonePermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Microphone Permission',
          message: 'Notes app needs access to your microphone for voice input',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (error) {
      return false;
    }
  }
  // iOS permissions handled via Info.plist
  return true;
};
```

## Text-to-Speech (Read Aloud)

### useTextToSpeech Hook

**File:** `src/hooks/useTextToSpeech.ts`

```typescript
import {useEffect, useCallback} from 'react';
import Tts from 'react-native-tts';
import {useAppDispatch, useAppSelector} from './hooks';
import {
  startSpeaking,
  stopSpeaking,
  setTTSProgress,
  setTTSError,
} from '@/redux/voiceSlice';

export const useTextToSpeech = () => {
  const dispatch = useAppDispatch();
  const {isPlaying, rate, pitch, voice} = useAppSelector(
    state => state.voice.tts
  );

  useEffect(() => {
    // Initialize TTS
    Tts.setDefaultLanguage('en-US');
    Tts.setDefaultRate(rate);
    Tts.setDefaultPitch(pitch);

    // Setup listeners
    Tts.addEventListener('tts-start', () => {
      dispatch(startSpeaking());
    });

    Tts.addEventListener('tts-finish', () => {
      dispatch(stopSpeaking());
    });

    Tts.addEventListener('tts-cancel', () => {
      dispatch(stopSpeaking());
    });

    Tts.addEventListener('tts-error', (error) => {
      dispatch(setTTSError(error.message || 'TTS error'));
    });

    Tts.addEventListener('tts-progress', (event) => {
      const progress = (event.location / event.length) * 100;
      dispatch(setTTSProgress(progress));
    });

    return () => {
      Tts.removeAllListeners('tts-start');
      Tts.removeAllListeners('tts-finish');
      Tts.removeAllListeners('tts-cancel');
      Tts.removeAllListeners('tts-error');
      Tts.removeAllListeners('tts-progress');
    };
  }, [dispatch]);

  useEffect(() => {
    Tts.setDefaultRate(rate);
  }, [rate]);

  useEffect(() => {
    Tts.setDefaultPitch(pitch);
  }, [pitch]);

  const speak = useCallback(async (text: string) => {
    try {
      await Tts.speak(text);
    } catch (error) {
      dispatch(setTTSError('Failed to speak text'));
    }
  }, [dispatch]);

  const pause = useCallback(async () => {
    try {
      await Tts.stop();
      dispatch(stopSpeaking());
    } catch (error) {
      dispatch(setTTSError('Failed to stop speaking'));
    }
  }, [dispatch]);

  const resume = useCallback(async () => {
    // Note: Resume not supported by all platforms
    dispatch(startSpeaking());
  }, [dispatch]);

  return {
    isPlaying,
    speak,
    pause,
    resume,
  };
};
```

### ReadAloud Component

**File:** `src/components/TextToSpeech/ReadAloud.tsx`

```typescript
export interface ReadAloudProps {
  text: string;
}

export const ReadAloud: React.FC<ReadAloudProps> = ({text}) => {
  const {isPlaying, speak, pause} = useTextToSpeech();
  const {rate, pitch} = useAppSelector(state => state.voice.tts);
  const dispatch = useAppDispatch();

  const handleTogglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      speak(text);
    }
  }, [isPlaying, speak, pause, text]);

  return (
    <Container>
      {/* Play/Pause Button */}
      <FAB
        icon={isPlaying ? 'pause' : 'play'}
        onPress={handleTogglePlay}
        $position="bottom-right"
      />

      {/* Controls Panel (when playing) */}
      {isPlaying && (
        <ControlsPanel>
          <Label>Speed: {rate.toFixed(1)}x</Label>
          <Slider
            $value={rate}
            onValueChange={(value) => dispatch(setTTSRate(value))}
            $min={0.5}
            $max={2.0}
            $step={0.1}
          />

          <Label>Pitch: {pitch.toFixed(1)}</Label>
          <Slider
            $value={pitch}
            onValueChange={(value) => dispatch(setTTSPitch(value))}
            $min={0.5}
            $max={2.0}
            $step={0.1}
          />
        </ControlsPanel>
      )}
    </Container>
  );
};
```

## Voice Commands (Advanced)

```typescript
// Parse voice commands from recognized text
const VOICE_COMMANDS = {
  'new line': () => insertText('\n'),
  'new paragraph': () => createNewBlock(),
  'bold': () => toggleFormatting('bold'),
  'italic': () => toggleFormatting('italic'),
  'underline': () => toggleFormatting('underline'),
  'heading': () => setBlockType('heading1'),
  'bullet': () => setBlockType('bullet'),
} as const;

const processVoiceCommand = (text: string): string | null => {
  const lowercased = text.toLowerCase();

  for (const [command, action] of Object.entries(VOICE_COMMANDS)) {
    if (lowercased.includes(command)) {
      action();
      return text.replace(new RegExp(command, 'gi'), '').trim();
    }
  }

  return text;
};
```

## Language Support

```typescript
export const VOICE_LANGUAGES = [
  {code: 'en-US', label: 'English (US)'},
  {code: 'en-GB', label: 'English (UK)'},
  {code: 'es-ES', label: 'Spanish'},
  {code: 'fr-FR', label: 'French'},
  {code: 'de-DE', label: 'German'},
  {code: 'it-IT', label: 'Italian'},
  {code: 'pt-BR', label: 'Portuguese (Brazil)'},
  {code: 'ja-JP', label: 'Japanese'},
  {code: 'ko-KR', label: 'Korean'},
  {code: 'zh-CN', label: 'Chinese (Simplified)'},
] as const;

// Language selector component
export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  value,
  onChange,
}) => {
  return (
    <Picker value={value} onValueChange={onChange}>
      {VOICE_LANGUAGES.map(lang => (
        <Picker.Item key={lang.code} label={lang.label} value={lang.code} />
      ))}
    </Picker>
  );
};
```

## Settings Integration

**File:** `src/screens/Settings/Settings.tsx`

```typescript
// Voice settings section
<SettingsSection title="Voice Features">
  <SettingItem label="Voice Input Language">
    <LanguageSelector
      value={sttLanguage}
      onChange={(lang) => dispatch(setSTTLanguage(lang))}
    />
  </SettingItem>

  <SettingItem label="Default Speech Rate">
    <Slider
      $value={ttsRate}
      onValueChange={(rate) => dispatch(setTTSRate(rate))}
      $min={0.5}
      $max={2.0}
      $step={0.1}
    />
  </SettingItem>

  <SettingItem label="Default Pitch">
    <Slider
      $value={ttsPitch}
      onValueChange={(pitch) => dispatch(setTTSPitch(pitch))}
      $min={0.5}
      $max={2.0}
      $step={0.1}
    />
  </SettingItem>
</SettingsSection>
```

## Error Handling

```typescript
// Permission denied
if (!hasPermission) {
  Alert.alert(
    'Permission Required',
    'Please grant microphone permission in Settings to use voice input.',
    [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Open Settings', onPress: openSettings},
    ]
  );
}

// Service unavailable
if (error === 'SERVICE_NOT_AVAILABLE') {
  Alert.alert(
    'Service Unavailable',
    'Speech recognition is not available on this device.',
    [{text: 'OK'}]
  );
}

// Network error (for cloud-based STT)
if (error === 'NETWORK_ERROR') {
  Alert.alert(
    'Network Error',
    'Please check your internet connection and try again.',
    [{text: 'Retry', onPress: retry}, {text: 'Cancel'}]
  );
}
```

## Testing Checklist

### Speech-to-Text
- [ ] Request microphone permission
- [ ] Start voice recognition
- [ ] Display recognized text in real-time
- [ ] Stop voice recognition
- [ ] Cancel voice recognition
- [ ] Insert recognized text into editor
- [ ] Handle multiple languages
- [ ] Handle voice commands
- [ ] Handle errors gracefully

### Text-to-Speech
- [ ] Play/pause speech
- [ ] Adjust speech rate
- [ ] Adjust pitch
- [ ] Select voice (if available)
- [ ] Display reading progress
- [ ] Handle background playback
- [ ] Stop on interruption (call, notification)
- [ ] Resume after interruption

### Integration
- [ ] Voice input button in text editor
- [ ] Read aloud button in note view
- [ ] Save voice settings
- [ ] Load voice settings on app start
- [ ] Accessibility labels for all controls
