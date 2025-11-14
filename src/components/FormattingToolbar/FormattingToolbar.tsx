import React from 'react';
import {ScrollView} from 'react-native';
import styled from 'styled-components/native';
import FormatButton from '@/components/FormatButton';
import type {TextFormatting} from '@/types/note';

/**
 * Props for FormattingToolbar component
 */
export interface FormattingToolbarProps {
  /** Current text formatting */
  formatting: TextFormatting;
  /** Toggle bold */
  onToggleBold: () => void;
  /** Toggle italic */
  onToggleItalic: () => void;
  /** Toggle underline */
  onToggleUnderline: () => void;
  /** Toggle strikethrough */
  onToggleStrikethrough: () => void;
  /** Increase font size */
  onIncreaseFontSize: () => void;
  /** Decrease font size */
  onDecreaseFontSize: () => void;
}

const Container = styled.View`
  background-color: ${props => props.theme.surface};
  border-top-width: 1px;
  border-bottom-width: 1px;
  border-color: ${props => props.theme.border};
  padding: 8px;
`;

const ButtonRow = styled.View`
  flex-direction: row;
  gap: 8px;
  align-items: center;
`;

const Divider = styled.View`
  width: 1px;
  height: 24px;
  background-color: ${props => props.theme.border};
  margin: 0 4px;
`;

const FontSizeDisplay = styled.Text`
  color: ${props => props.theme.textSecondary};
  font-size: 12px;
  min-width: 30px;
  text-align: center;
`;

/**
 * FormattingToolbar component for text formatting controls
 *
 * @example
 * ```tsx
 * <FormattingToolbar
 *   formatting={currentFormatting}
 *   onToggleBold={handleToggleBold}
 *   onToggleItalic={handleToggleItalic}
 *   onToggleUnderline={handleToggleUnderline}
 *   onToggleStrikethrough={handleToggleStrikethrough}
 *   onIncreaseFontSize={handleIncreaseFontSize}
 *   onDecreaseFontSize={handleDecreaseFontSize}
 * />
 * ```
 */
export const FormattingToolbar: React.FC<FormattingToolbarProps> = ({
  formatting,
  onToggleBold,
  onToggleItalic,
  onToggleUnderline,
  onToggleStrikethrough,
  onIncreaseFontSize,
  onDecreaseFontSize,
}) => {
  return (
    <Container>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{paddingHorizontal: 4}}
      >
        <ButtonRow>
          <FormatButton
            $active={formatting.bold}
            onPress={onToggleBold}
            accessibilityLabel="Bold"
          >
            B
          </FormatButton>

          <FormatButton
            $active={formatting.italic}
            onPress={onToggleItalic}
            accessibilityLabel="Italic"
          >
            I
          </FormatButton>

          <FormatButton
            $active={formatting.underline}
            onPress={onToggleUnderline}
            accessibilityLabel="Underline"
          >
            U
          </FormatButton>

          <FormatButton
            $active={formatting.strikethrough}
            onPress={onToggleStrikethrough}
            accessibilityLabel="Strikethrough"
          >
            S
          </FormatButton>

          <Divider />

          <FormatButton
            onPress={onDecreaseFontSize}
            $disabled={formatting.fontSize <= 12}
            accessibilityLabel="Decrease font size"
          >
            A-
          </FormatButton>

          <FontSizeDisplay>{formatting.fontSize}</FontSizeDisplay>

          <FormatButton
            onPress={onIncreaseFontSize}
            $disabled={formatting.fontSize >= 32}
            accessibilityLabel="Increase font size"
          >
            A+
          </FormatButton>
        </ButtonRow>
      </ScrollView>
    </Container>
  );
};

export default FormattingToolbar;
