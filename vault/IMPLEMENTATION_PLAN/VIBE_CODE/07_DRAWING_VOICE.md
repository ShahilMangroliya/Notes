# Vibe Code Guide - Part 7: Drawing & Voice Features

## Part A: Drawing Editor with Skia

### File: `src/screens/NoteEditor/DrawingEditor/DrawingEditor.tsx`

#### Instructions

Create a high-performance drawing canvas using @shopify/react-native-skia:

```typescript
import React, {useCallback, useRef, useState} from 'react';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {Canvas, Path, Skia} from '@shopify/react-native-skia';
import styled from 'styled-components/native';
import {v4 as uuidv4} from 'uuid';

import DrawingToolbar from './DrawingToolbar';

import type {DrawingContent, DrawingStroke, Point} from '@/types/note';
import {useAppSelector} from '@/hooks/hooks';

export interface DrawingEditorProps {
  content: DrawingContent;
  onChange: (content: DrawingContent) => void;
}

export const DrawingEditor: React.FC<DrawingEditorProps> = ({content, onChange}) => {
  const {selectedTool, brushSize, brushColor} = useAppSelector(
    state => state.editor.drawingEditor
  );

  const currentStroke = useRef<Point[]>([]);
  const [, forceUpdate] = useState(0);

  const handleTouchStart = useCallback((x: number, y: number) => {
    currentStroke.current = [{x, y}];
    forceUpdate(n => n + 1);
  }, []);

  const handleTouchMove = useCallback((x: number, y: number) => {
    currentStroke.current.push({x, y});
    forceUpdate(n => n + 1);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (currentStroke.current.length === 0) return;

    if (selectedTool === 'eraser') {
      // Eraser: remove intersecting strokes
      const remainingStrokes = content.strokes.filter(
        stroke => !isStrokeIntersecting(stroke, currentStroke.current, brushSize)
      );

      onChange({
        ...content,
        strokes: remainingStrokes,
      });
    } else {
      // Pencil: add new stroke
      const newStroke: DrawingStroke = {
        id: uuidv4(),
        points: [...currentStroke.current],
        color: brushColor,
        width: brushSize,
        tool: 'pencil',
        timestamp: Date.now(),
      };

      onChange({
        ...content,
        strokes: [...content.strokes, newStroke],
      });
    }

    currentStroke.current = [];
    forceUpdate(n => n + 1);
  }, [content, selectedTool, brushSize, brushColor, onChange]);

  const gesture = Gesture.Pan()
    .onStart((e) => handleTouchStart(e.x, e.y))
    .onUpdate((e) => handleTouchMove(e.x, e.y))
    .onEnd(handleTouchEnd);

  const renderStrokes = () => {
    const paths = content.strokes.map(stroke => {
      const path = createPathFromPoints(stroke.points);
      return {path, stroke};
    });

    // Also render current stroke in progress
    if (currentStroke.current.length > 0) {
      const currentPath = createPathFromPoints(currentStroke.current);
      paths.push({
        path: currentPath,
        stroke: {
          color: selectedTool === 'eraser' ? '#FF0000' : brushColor,
          width: brushSize,
        } as any,
      });
    }

    return paths;
  };

  return (
    <Container>
      <DrawingToolbar />

      <GestureDetector gesture={gesture}>
        <StyledCanvas>
          <Canvas style={{flex: 1}}>
            {renderStrokes().map((item, index) => (
              <Path
                key={index}
                path={item.path}
                color={item.stroke.color}
                style="stroke"
                strokeWidth={item.stroke.width}
                strokeCap="round"
                strokeJoin="round"
              />
            ))}
          </Canvas>
        </StyledCanvas>
      </GestureDetector>
    </Container>
  );
};

const createPathFromPoints = (points: Point[]) => {
  const path = Skia.Path.Make();

  if (points.length === 0) return path;

  path.moveTo(points[0].x, points[0].y);

  for (let i = 1; i < points.length; i++) {
    path.lineTo(points[i].x, points[i].y);
  }

  return path;
};

const isStrokeIntersecting = (
  stroke: DrawingStroke,
  eraserPoints: Point[],
  eraserRadius: number
): boolean => {
  return stroke.points.some(point =>
    eraserPoints.some(eraserPoint => {
      const distance = Math.sqrt(
        Math.pow(point.x - eraserPoint.x, 2) +
        Math.pow(point.y - eraserPoint.y, 2)
      );
      return distance <= eraserRadius;
    })
  );
};

const Container = styled.View`
  flex: 1;
`;

const StyledCanvas = styled.View`
  flex: 1;
  background-color: #FFFFFF;
`;

export default DrawingEditor;
```

### File: `src/screens/NoteEditor/DrawingEditor/DrawingToolbar.tsx`

```typescript
import React from 'react';
import styled from 'styled-components/native';
import IconButton from '@/components/IconButton';
import Slider from '@/components/Slider';
import ColorPicker from '@/components/ColorPicker';
import {useAppDispatch, useAppSelector} from '@/hooks/hooks';
import {setDrawingTool, setBrushSize, setBrushColor} from '@/redux/editorSlice';

export const DrawingToolbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const {selectedTool, brushSize, brushColor} = useAppSelector(
    state => state.editor.drawingEditor
  );

  return (
    <ToolbarContainer>
      <ToolSection>
        <IconButton
          icon="✏️"
          onPress={() => dispatch(setDrawingTool('pencil'))}
          $active={selectedTool === 'pencil'}
          accessibilityLabel="Pencil tool"
        />
        <IconButton
          icon="🧹"
          onPress={() => dispatch(setDrawingTool('eraser'))}
          $active={selectedTool === 'eraser'}
          accessibilityLabel="Eraser tool"
        />
      </ToolSection>

      <Slider
        $value={brushSize}
        onValueChange={(size) => dispatch(setBrushSize(size))}
        $min={1}
        $max={50}
        $step={1}
        label="Size"
      />

      {selectedTool === 'pencil' && (
        <ColorPicker
          $selectedColor={brushColor}
          onColorSelect={(color) => dispatch(setBrushColor(color))}
          $variant="compact"
        />
      )}
    </ToolbarContainer>
  );
};

const ToolbarContainer = styled.View`
  padding: 16px;
  background-color: ${props => props.theme.surface};
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.border};
`;

const ToolSection = styled.View`
  flex-direction: row;
  gap: 8px;
  margin-bottom: 16px;
`;

export default DrawingToolbar;
```

## Part B: Voice Features

### File 1: Voice Input Hook - `src/hooks/useVoiceInput.ts`

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
    Voice.onSpeechStart = () => dispatch(startListening());
    Voice.onSpeechEnd = () => dispatch(stopListening());

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

  return {isListening, recognizedText, start, stop};
};

export default useVoiceInput;
```

### File 2: Text-to-Speech Hook - `src/hooks/useTextToSpeech.ts`

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
  const {isPlaying, rate, pitch} = useAppSelector(state => state.voice.tts);

  useEffect(() => {
    Tts.setDefaultLanguage('en-US');
    Tts.setDefaultRate(rate);
    Tts.setDefaultPitch(pitch);

    Tts.addEventListener('tts-start', () => dispatch(startSpeaking()));
    Tts.addEventListener('tts-finish', () => dispatch(stopSpeaking()));
    Tts.addEventListener('tts-cancel', () => dispatch(stopSpeaking()));

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
  }, [dispatch, rate, pitch]);

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

  return {isPlaying, speak, pause};
};

export default useTextToSpeech;
```

### File 3: Voice Input Component - `src/components/VoiceInput/VoiceInput.tsx`

```typescript
import React, {useCallback} from 'react';
import styled from 'styled-components/native';
import Modal from '@/components/Modal';
import Button from '@/components/Button';
import ButtonText from '@/components/Button/ButtonText';
import useVoiceInput from '@/hooks/useVoiceInput';

export interface VoiceInputProps {
  $visible: boolean;
  onResult: (text: string) => void;
  onClose: () => void;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({
  $visible,
  onResult,
  onClose,
}) => {
  const {isListening, recognizedText, start, stop} = useVoiceInput();

  const handleDone = useCallback(() => {
    stop();
    onResult(recognizedText);
    onClose();
  }, [recognizedText, stop, onResult, onClose]);

  React.useEffect(() => {
    if ($visible) {
      start();
    }
  }, [$visible]);

  return (
    <Modal $visible={$visible} onClose={onClose}>
      <Container>
        <WaveIcon>🎤</WaveIcon>
        <StatusText>{isListening ? 'Listening...' : 'Processing...'}</StatusText>
        <RecognizedText>{recognizedText || 'Start speaking...'}</RecognizedText>

        <ButtonRow>
          <Button onPress={handleDone}>
            <ButtonText>Done</ButtonText>
          </Button>
          <Button onPress={onClose} $variant="secondary">
            <ButtonText>Cancel</ButtonText>
          </Button>
        </ButtonRow>
      </Container>
    </Modal>
  );
};

const Container = styled.View`
  padding: 24px;
  align-items: center;
`;

const WaveIcon = styled.Text`
  font-size: 64px;
  margin-bottom: 16px;
`;

const StatusText = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin-bottom: 16px;
`;

const RecognizedText = styled.Text`
  font-size: 16px;
  color: ${props => props.theme.textSecondary};
  text-align: center;
  margin-bottom: 24px;
  min-height: 60px;
`;

const ButtonRow = styled.View`
  flex-direction: row;
  gap: 12px;
`;

export default VoiceInput;
```

### File 4: Read Aloud Component - `src/components/TextToSpeech/ReadAloud.tsx`

```typescript
import React from 'react';
import styled from 'styled-components/native';
import FAB from '@/components/FAB';
import Slider from '@/components/Slider';
import useTextToSpeech from '@/hooks/useTextToSpeech';
import {useAppDispatch, useAppSelector} from '@/hooks/hooks';
import {setTTSRate, setTTSPitch} from '@/redux/voiceSlice';

export interface ReadAloudProps {
  text: string;
}

export const ReadAloud: React.FC<ReadAloudProps> = ({text}) => {
  const {isPlaying, speak, pause} = useTextToSpeech();
  const dispatch = useAppDispatch();
  const {rate, pitch} = useAppSelector(state => state.voice.tts);

  const handleToggle = () => {
    if (isPlaying) {
      pause();
    } else {
      speak(text);
    }
  };

  return (
    <>
      <FAB
        icon={<Icon>{isPlaying ? '⏸' : '▶'}</Icon>}
        onPress={handleToggle}
        accessibilityLabel={isPlaying ? 'Pause reading' : 'Start reading'}
      />

      {isPlaying && (
        <ControlsPanel>
          <Slider
            $value={rate}
            onValueChange={(value) => dispatch(setTTSRate(value))}
            $min={0.5}
            $max={2.0}
            $step={0.1}
            label="Speed"
          />
          <Slider
            $value={pitch}
            onValueChange={(value) => dispatch(setTTSPitch(value))}
            $min={0.5}
            $max={2.0}
            $step={0.1}
            label="Pitch"
          />
        </ControlsPanel>
      )}
    </>
  );
};

const Icon = styled.Text`
  font-size: 24px;
`;

const ControlsPanel = styled.View`
  position: absolute;
  bottom: 100px;
  left: 16px;
  right: 16px;
  background-color: ${props => props.theme.surface};
  border-radius: 12px;
  padding: 16px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.2;
  shadow-radius: 4px;
  elevation: 4;
`;

export default ReadAloud;
```

## Verification Checklist

### Drawing
- [ ] Canvas renders correctly
- [ ] Can draw with pencil
- [ ] Can erase strokes
- [ ] Brush size changes work
- [ ] Color changes work
- [ ] Performance at 60 FPS
- [ ] Strokes save correctly

### Voice
- [ ] Microphone permission requested
- [ ] Voice input modal shows
- [ ] Text recognized correctly
- [ ] TTS plays correctly
- [ ] Speed/pitch controls work
- [ ] Voice settings persist

## Next Step

Your app foundation is now complete! Final steps:
- Test all features end-to-end
- Add export functionality
- Polish animations
- Run on physical devices
