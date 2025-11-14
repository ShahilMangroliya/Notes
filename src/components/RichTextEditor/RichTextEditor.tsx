import React, {useCallback, useRef, useState} from 'react';
import {
  TextInput,
  TextInputSelectionChangeEvent,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import styled from 'styled-components/native';
import {useTheme} from 'styled-components/native';
import FormattedText from '@/components/FormattedText';
import type {TextFormatting, FormattingRange} from '@/types/note';
import logger from '@/util/DebugLogger';

/**
 * Props for RichTextEditor component
 */
export interface RichTextEditorProps {
  /** Plain text content */
  text: string;
  /** Formatting ranges applied to text */
  formattingRanges?: FormattingRange[];
  /** Text change handler */
  onTextChange: (text: string) => void;
  /** Selection change handler */
  onSelectionChange?: (start: number, end: number) => void;
  /** Current formatting for selection */
  currentFormatting?: Partial<TextFormatting>;
  /** Placeholder text */
  placeholder?: string;
  /** Initial mode (default: 'edit') */
  initialMode?: 'edit' | 'preview';
}

/**
 * Editor mode: 'edit' shows TextInput, 'preview' shows formatted text
 */
type EditorMode = 'edit' | 'preview';

const EditorContainer = styled.View`
  flex: 1;
  background-color: ${props => props.theme.background};
`;

const ModeToggleContainer = styled.View`
  padding: 8px 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.border};
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
`;

const ModeLabel = styled.Text`
  color: ${props => props.theme.textSecondary};
  font-size: 13px;
`;

const ModeButtons = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const HelpText = styled.Text`
  color: ${props => props.theme.textSecondary};
  font-size: 11px;
  font-style: italic;
  flex: 1;
`;

const ModeButton = styled(TouchableOpacity)<{$active?: boolean}>`
  padding: 6px 12px;
  border-radius: 6px;
  background-color: ${props =>
    props.$active ? props.theme.border : 'transparent'};
`;

const ModeButtonText = styled.Text<{$active?: boolean}>`
  color: ${props => (props.$active ? props.theme.text : props.theme.textSecondary)};
  font-size: 13px;
  font-weight: ${props => (props.$active ? '600' : '400')};
`;

const EditorInput = styled.TextInput.attrs(props => ({
  placeholderTextColor: props.theme.textSecondary,
}))`
  flex: 1;
  color: ${props => props.theme.text};
  font-size: 16px;
  line-height: 24px;
  padding: 20px;
  text-align-vertical: top;
`;

const PreviewContainer = styled.View`
  flex: 1;
`;

const EmptyPlaceholder = styled.Text`
  color: ${props => props.theme.textSecondary};
  font-size: 16px;
  padding: 20px;
  font-style: italic;
`;

const SelectionInfo = styled.Text`
  color: ${props => props.theme.textSecondary};
  font-size: 12px;
  padding: 4px 16px;
  background-color: ${props => props.theme.surface};
`;

/**
 * RichTextEditor component - A hybrid editor for text with formatting
 *
 * Features:
 * - Edit mode: Plain TextInput for editing with cursor and selection support
 * - Preview mode: Formatted text display with visual styling
 * - Toggle between modes to see formatting applied
 * - Selection-based formatting application
 *
 * Architecture:
 * - Uses React Native TextInput for editing (no native rich text support)
 * - Uses custom FormattedText component for preview
 * - Formatting is stored as ranges and applied visually in preview mode
 *
 * Usage:
 * 1. Type text in edit mode
 * 2. Select text you want to format
 * 3. Apply formatting using toolbar
 * 4. Switch to preview mode to see formatted text
 *
 * @example
 * ```tsx
 * <RichTextEditor
 *   text={noteText}
 *   formattingRanges={formattingRanges}
 *   onTextChange={handleTextChange}
 *   onSelectionChange={handleSelectionChange}
 *   currentFormatting={currentFormatting}
 *   placeholder="Start typing..."
 * />
 * ```
 */
export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  text,
  formattingRanges = [],
  onTextChange,
  onSelectionChange,
  placeholder = 'Start typing...',
  initialMode = 'edit',
}) => {
  const theme = useTheme();
  const inputRef = useRef<TextInput>(null);
  const [mode, setMode] = useState<EditorMode>(initialMode);
  const [selection, setSelection] = useState({start: 0, end: 0});

  /**
   * Handles text input changes
   */
  const handleTextChange = useCallback(
    (newText: string) => {
      logger.callback('RichTextEditor', 'handleTextChange', {
        length: newText.length,
        oldLength: text.length,
      });
      onTextChange(newText);
    },
    [onTextChange, text.length],
  );

  /**
   * Handles selection changes in the TextInput
   */
  const handleSelectionChange = useCallback(
    (event: TextInputSelectionChangeEvent) => {
      const {start, end} = event.nativeEvent.selection;
      logger.callback('RichTextEditor', 'handleSelectionChange', {
        start,
        end,
        hasSelection: start !== end,
      });

      setSelection({start, end});

      if (onSelectionChange) {
        onSelectionChange(start, end);
      }
    },
    [onSelectionChange],
  );

  /**
   * Switches to edit mode and focuses the input
   */
  const switchToEditMode = useCallback(() => {
    logger.callback('RichTextEditor', 'switchToEditMode');
    setMode('edit');
    // Focus the input after a short delay to ensure render completes
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);

  /**
   * Switches to preview mode
   */
  const switchToPreviewMode = useCallback(() => {
    logger.callback('RichTextEditor', 'switchToPreviewMode');
    setMode('preview');
  }, []);

  /**
   * Renders the mode toggle buttons
   */
  const renderModeToggle = () => (
    <ModeToggleContainer>
      {mode === 'edit' && formattingRanges.length > 0 && (
        <HelpText>
          💡 {formattingRanges.length} format{formattingRanges.length !== 1 ? 's' : ''} applied - Tap Preview to see
        </HelpText>
      )}
      {mode === 'edit' && formattingRanges.length === 0 && (
        <HelpText>Tap format buttons, then type to apply formatting</HelpText>
      )}
      {mode === 'preview' && formattingRanges.length > 0 && (
        <HelpText>Showing {formattingRanges.length} formatted range{formattingRanges.length !== 1 ? 's' : ''}</HelpText>
      )}
      {mode === 'preview' && formattingRanges.length === 0 && (
        <HelpText>No formatting applied yet</HelpText>
      )}
      <ModeButtons>
        <ModeLabel>View:</ModeLabel>
        <ModeButton
          $active={mode === 'edit'}
          onPress={switchToEditMode}
          accessibilityRole="button"
          accessibilityLabel="Edit mode"
          accessibilityState={{selected: mode === 'edit'}}
        >
          <ModeButtonText $active={mode === 'edit'}>Edit</ModeButtonText>
        </ModeButton>
        <ModeButton
          $active={mode === 'preview'}
          onPress={switchToPreviewMode}
          accessibilityRole="button"
          accessibilityLabel="Preview mode"
          accessibilityState={{selected: mode === 'preview'}}
        >
          <ModeButtonText $active={mode === 'preview'}>Preview</ModeButtonText>
        </ModeButton>
      </ModeButtons>
    </ModeToggleContainer>
  );

  /**
   * Renders selection info for debugging/feedback
   */
  const renderSelectionInfo = () => {
    if (mode !== 'edit' || selection.start === selection.end) {
      return null;
    }

    const selectedText = text.slice(selection.start, selection.end);
    const length = selection.end - selection.start;

    return (
      <SelectionInfo>
        Selected: {length} character{length !== 1 ? 's' : ''} "{selectedText.slice(0, 20)}
        {selectedText.length > 20 ? '...' : ''}"
      </SelectionInfo>
    );
  };

  return (
    <EditorContainer>
      {renderModeToggle()}
      {renderSelectionInfo()}

      {mode === 'edit' ? (
        // Edit Mode: Show TextInput for editing
        <EditorInput
          ref={inputRef}
          value={text}
          onChangeText={handleTextChange}
          onSelectionChange={handleSelectionChange}
          placeholder={placeholder}
          multiline
          textAlignVertical="top"
          accessibilityLabel="Text editor"
          accessibilityHint="Type to edit text. Select text to apply formatting."
        />
      ) : (
        // Preview Mode: Show formatted text
        <PreviewContainer>
          <ScrollView>
            {text.length === 0 ? (
              <EmptyPlaceholder>{placeholder}</EmptyPlaceholder>
            ) : (
              <FormattedText
                text={text}
                formattingRanges={formattingRanges}
                baseColor={theme.text}
              />
            )}
          </ScrollView>
        </PreviewContainer>
      )}
    </EditorContainer>
  );
};

export default RichTextEditor;

