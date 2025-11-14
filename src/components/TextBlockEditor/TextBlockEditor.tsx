import React from 'react';
import styled from 'styled-components/native';
import type {TextBlock} from '@/types/note';

/**
 * Props for TextBlockEditor component
 */
export interface TextBlockEditorProps {
  /** Text block data */
  block: TextBlock;
  /** Text change handler */
  onTextChange: (blockId: string, text: string) => void;
  /** Block selection handler */
  onSelect: (blockId: string) => void;
  /** Is this block selected */
  $isSelected: boolean;
}

const BlockContainer = styled.View<{$isSelected: boolean}>`
  padding: 8px 16px;
  background-color: ${props =>
    props.$isSelected ? props.theme.surface : 'transparent'};
  border-left-width: 3px;
  border-left-color: ${props =>
    props.$isSelected ? props.theme.text : 'transparent'};
`;

const getBlockPrefix = (blockType: TextBlock['blockType']): string => {
  switch (blockType) {
    case 'bullet':
      return '• ';
    case 'numbered':
      return '1. ';
    default:
      return '';
  }
};

const Input = styled.TextInput.attrs(props => ({
  placeholderTextColor: props.theme.textSecondary,
}))<{$block: TextBlock}>`
  color: ${props => props.$block.formatting.color || props.theme.text};
  font-size: ${props => props.$block.formatting.fontSize}px;
  font-family: ${props => {
    switch (props.$block.formatting.fontFamily) {
      case 'serif':
        return 'Georgia';
      case 'monospace':
        return 'Courier';
      default:
        return 'System';
    }
  }};
  font-weight: ${props => (props.$block.formatting.bold ? 'bold' : 'normal')};
  font-style: ${props =>
    props.$block.formatting.italic ? 'italic' : 'normal'};
  text-decoration-line: ${props => {
    const decorations = [];
    if (props.$block.formatting.underline) decorations.push('underline');
    if (props.$block.formatting.strikethrough)
      decorations.push('line-through');
    return decorations.length > 0 ? decorations.join(' ') : 'none';
  }};
  ${props => {
    switch (props.$block.blockType) {
      case 'heading1':
        return 'font-size: 28px; font-weight: bold; margin-bottom: 8px;';
      case 'heading2':
        return 'font-size: 22px; font-weight: bold; margin-bottom: 6px;';
      default:
        return '';
    }
  }}
  ${props =>
    props.$block.formatting.backgroundColor
      ? `background-color: ${props.$block.formatting.backgroundColor};`
      : ''}
  padding: 4px 0;
  min-height: 30px;
`;

/**
 * TextBlockEditor component for editing individual text blocks
 *
 * @example
 * ```tsx
 * <TextBlockEditor
 *   block={textBlock}
 *   onTextChange={handleTextChange}
 *   onSelect={handleBlockSelect}
 *   $isSelected={selectedBlockId === textBlock.id}
 * />
 * ```
 */
export const TextBlockEditor: React.FC<TextBlockEditorProps> = ({
  block,
  onTextChange,
  onSelect,
  $isSelected,
}) => {
  const prefix = getBlockPrefix(block.blockType);
  const placeholder =
    block.blockType === 'heading1'
      ? 'Heading 1'
      : block.blockType === 'heading2'
        ? 'Heading 2'
        : 'Type here...';

  return (
    <BlockContainer $isSelected={$isSelected}>
      <Input
        $block={block}
        value={block.text}
        onChangeText={text => onTextChange(block.id, text)}
        onFocus={() => onSelect(block.id)}
        placeholder={prefix + placeholder}
        multiline
        textAlignVertical="top"
        accessibilityLabel={`${block.blockType} block`}
        accessibilityHint="Tap to edit text"
      />
    </BlockContainer>
  );
};

export default TextBlockEditor;
