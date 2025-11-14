import React from 'react';
import styled from 'styled-components/native';
import {useTheme} from 'styled-components/native';
import Icon from '@/components/Icon';

/**
 * Props for VoiceRecorder component
 */
export interface VoiceRecorderProps {
  /** Is currently listening */
  isListening: boolean;
  /** Recognized text */
  recognizedText: string;
  /** Start listening handler */
  onStartListening: () => void;
  /** Stop listening handler */
  onStopListening: () => void;
  /** Clear text handler */
  onClearText: () => void;
  /** Insert text handler */
  onInsertText: (text: string) => void;
  /** Error message */
  error?: string | null;
}

const Container = styled.View`
  background-color: ${props => props.theme.surface};
  border-radius: 12px;
  padding: 16px;
  gap: 12px;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.text};
`;

const StatusContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const StatusDot = styled.View<{$active: boolean}>`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${props =>
    props.$active ? props.theme.error : props.theme.success};
`;

const StatusText = styled.Text`
  font-size: 12px;
  color: ${props => props.theme.textSecondary};
`;

const TextContainer = styled.View`
  min-height: 80px;
  max-height: 200px;
  background-color: ${props => props.theme.background};
  border-radius: 8px;
  padding: 12px;
  border: 1px solid ${props => props.theme.border};
`;

const RecognizedText = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.text};
  line-height: 20px;
`;

const PlaceholderText = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.textSecondary};
  font-style: italic;
`;

const ErrorText = styled.Text`
  font-size: 12px;
  color: ${props => props.theme.error};
`;

const ButtonRow = styled.View`
  flex-direction: row;
  gap: 8px;
  justify-content: space-between;
`;

const RecordButton = styled.TouchableOpacity<{$active: boolean}>`
  flex: 1;
  background-color: ${props =>
    props.$active ? props.theme.error : props.theme.background};
  border: 2px solid
    ${props => (props.$active ? props.theme.error : props.theme.border)};
  border-radius: 8px;
  padding: 12px;
  align-items: center;
  flex-direction: row;
  justify-content: center;
  gap: 8px;
`;

const IconContainer = styled.View``;

const RecordLabel = styled.Text<{$active: boolean}>`
  font-size: 14px;
  font-weight: 600;
  color: ${props => (props.$active ? props.theme.surface : props.theme.text)};
`;

const ActionButton = styled.TouchableOpacity<{
  $variant?: 'primary' | 'default';
}>`
  flex: 1;
  background-color: ${props =>
    props.$variant === 'primary'
      ? props.theme.background
      : props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  padding: 12px;
  align-items: center;
`;

const ActionLabel = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.text};
`;

/**
 * VoiceRecorder component for speech-to-text
 *
 * @example
 * ```tsx
 * <VoiceRecorder
 *   isListening={isListening}
 *   recognizedText={recognizedText}
 *   onStartListening={handleStart}
 *   onStopListening={handleStop}
 *   onClearText={handleClear}
 *   onInsertText={handleInsert}
 *   error={error}
 * />
 * ```
 */
export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  isListening,
  recognizedText,
  onStartListening,
  onStopListening,
  onClearText,
  onInsertText,
  error,
}) => {
  const theme = useTheme();

  return (
    <Container>
      <Header>
        <Title>Voice Input</Title>
        <StatusContainer>
          <StatusDot $active={isListening} />
          <StatusText>{isListening ? 'Listening...' : 'Ready'}</StatusText>
        </StatusContainer>
      </Header>

      <TextContainer>
        {recognizedText ? (
          <RecognizedText>{recognizedText}</RecognizedText>
        ) : (
          <PlaceholderText>
            Tap the microphone to start voice input
          </PlaceholderText>
        )}
      </TextContainer>

      {error && <ErrorText>{error}</ErrorText>}

      <RecordButton
        $active={isListening}
        onPress={isListening ? onStopListening : onStartListening}
        accessibilityRole="button"
        accessibilityLabel={isListening ? 'Stop recording' : 'Start recording'}
      >
        <IconContainer>
          <Icon
            name={isListening ? 'pause-circle' : 'audio'}
            size={20}
            color={isListening ? theme.surface : theme.text}
          />
        </IconContainer>
        <RecordLabel $active={isListening}>
          {isListening ? 'Stop' : 'Record'}
        </RecordLabel>
      </RecordButton>

      {recognizedText && !isListening && (
        <ButtonRow>
          <ActionButton onPress={onClearText} accessibilityLabel="Clear text">
            <ActionLabel>Clear</ActionLabel>
          </ActionButton>

          <ActionButton
            $variant="primary"
            onPress={() => onInsertText(recognizedText)}
            accessibilityLabel="Insert text"
          >
            <ActionLabel>Insert</ActionLabel>
          </ActionButton>
        </ButtonRow>
      )}
    </Container>
  );
};

export default VoiceRecorder;
