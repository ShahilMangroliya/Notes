import React from 'react';
import {ScrollView} from 'react-native';
import styled from 'styled-components/native';
import {useTheme} from 'styled-components/native';
import FormatButton from '@/components/FormatButton';
import Icon from '@/components/Icon';
import type {TextFormatting} from '@/types/note';

/**
 * Props for FormattingToolbar component
 */
export interface FormattingToolbarProps {
  /** Current text formatting */
  formatting: Partial<TextFormatting>;
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
  background-color: ${props => props.theme.background};
  padding: 8px 12px;
  border-top-width: 0.5px;
  border-top-color: ${props => props.theme.border};
`;

const ScrollViewContent = styled.View`
  padding-horizontal: 4px;
`;

const ButtonRow = styled.View`
  flex-direction: row;
  gap: 6px;
  align-items: center;
`;

const Divider = styled.View`
  width: 1px;
  height: 20px;
  background-color: ${props => props.theme.border};
  margin: 0 4px;
  opacity: 0.2;
`;

const FontSizeDisplay = styled.Text`
  color: ${props => props.theme.text};
  font-size: 13px;
  font-weight: 500;
  min-width: 28px;
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
  const theme = useTheme();

  return (
    <Container>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <ScrollViewContent>
          <ButtonRow>
            <FormatButton
              $active={!!formatting.bold}
              onPress={onToggleBold}
              accessibilityLabel="Bold"
            >
              <Icon
                name="bold"
                size={16}
                color={formatting.bold ? theme.surface : theme.text}
              />
            </FormatButton>

            <FormatButton
              $active={!!formatting.italic}
              onPress={onToggleItalic}
              accessibilityLabel="Italic"
            >
              <Icon
                name="italic"
                size={16}
                color={formatting.italic ? theme.surface : theme.text}
              />
            </FormatButton>

            <FormatButton
              $active={!!formatting.underline}
              onPress={onToggleUnderline}
              accessibilityLabel="Underline"
            >
              <Icon
                name="underline"
                size={16}
                color={formatting.underline ? theme.surface : theme.text}
              />
            </FormatButton>

            <FormatButton
              $active={!!formatting.strikethrough}
              onPress={onToggleStrikethrough}
              accessibilityLabel="Strikethrough"
            >
              <Icon
                name="strikethrough"
                size={16}
                color={formatting.strikethrough ? theme.surface : theme.text}
              />
            </FormatButton>

            <Divider />

            <FormatButton
              onPress={onDecreaseFontSize}
              $disabled={(formatting.fontSize || 16) <= 12}
              accessibilityLabel="Decrease font size"
            >
              <Icon
                name="minus"
                size={14}
                color={
                  (formatting.fontSize || 16) <= 12
                    ? theme.textSecondary
                    : theme.text
                }
              />
            </FormatButton>

            <FontSizeDisplay>{formatting.fontSize || 16}</FontSizeDisplay>

            <FormatButton
              onPress={onIncreaseFontSize}
              $disabled={(formatting.fontSize || 16) >= 32}
              accessibilityLabel="Increase font size"
            >
              <Icon
                name="plus"
                size={14}
                color={
                  (formatting.fontSize || 16) >= 32
                    ? theme.textSecondary
                    : theme.text
                }
              />
            </FormatButton>
          </ButtonRow>
        </ScrollViewContent>
      </ScrollView>
    </Container>
  );
};

export default FormattingToolbar;
