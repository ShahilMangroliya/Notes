import React, {useMemo} from 'react';
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
  /** Index of block in list (for numbered lists) */
  blockIndex?: number;
  /** Total blocks of same type before this (for numbered lists) */
  listNumber?: number;
}

const BlockContainer = styled.View<{$isSelected: boolean; $isList: boolean}>`
  flex-direction: row;
  padding: ${props => (props.$isList ? '6px 0 6px 0' : '6px 20px')};
  background-color: ${props =>
    props.$isSelected ? props.theme.surface : 'transparent'};
  min-height: 36px;
  align-items: flex-start;
`;

const ListPrefix = styled.View<{$blockType: TextBlock['blockType']}>`
  width: ${props => (props.$blockType === 'numbered' ? '36px' : '24px')};
  padding-top: 4px;
  padding-left: 20px;
  align-items: ${props => (props.$blockType === 'numbered' ? 'flex-end' : 'flex-start')};
  justify-content: flex-start;
`;

const ListPrefixText = styled.Text<{
  $blockType: TextBlock['blockType'];
  $fontSize: number;
  $bold: boolean;
}>`
  color: ${props => props.theme.textSecondary};
  font-size: ${props => props.$fontSize}px;
  font-weight: ${props => (props.$bold ? '600' : '400')};
  min-width: ${props => (props.$blockType === 'numbered' ? '24px' : 'auto')};
  text-align: ${props => (props.$blockType === 'numbered' ? 'right' : 'left')};
`;

const InputContainer = styled.View`
  flex: 1;
  padding-right: 20px;
`;

const Input = styled.TextInput.attrs(props => ({
  placeholderTextColor: props.theme.textSecondary,
}))<{$block: TextBlock}>`
  color: ${props =>
    props.$block.formatting.color && props.$block.formatting.color.trim() !== ''
      ? props.$block.formatting.color
      : props.theme.text};
  font-size: ${props => {
    switch (props.$block.blockType) {
      case 'heading1':
        return '28px';
      case 'heading2':
        return '22px';
      default:
        return `${props.$block.formatting.fontSize}px`;
    }
  }};
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
  font-weight: ${props => {
    if (props.$block.blockType === 'heading1' || props.$block.blockType === 'heading2') {
      return 'bold';
    }
    return props.$block.formatting.bold ? 'bold' : 'normal';
  }};
  font-style: ${props =>
    props.$block.formatting.italic ? 'italic' : 'normal'};
  text-decoration-line: ${props => {
    const decorations = [];
    if (props.$block.formatting.underline) decorations.push('underline');
    if (props.$block.formatting.strikethrough)
      decorations.push('line-through');
    return decorations.length > 0 ? decorations.join(' ') : 'none';
  }};
  ${props =>
    props.$block.formatting.backgroundColor
      ? `background-color: ${props.$block.formatting.backgroundColor};`
      : ''}
  padding: 2px 0;
  min-height: 28px;
  line-height: ${props => {
    switch (props.$block.blockType) {
      case 'heading1':
        return '36px';
      case 'heading2':
        return '30px';
      default:
        return `${props.$block.formatting.fontSize * 1.4}px`;
    }
  }};
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
 *   blockIndex={index}
 *   listNumber={listNumber}
 * />
 * ```
 */
export const TextBlockEditor: React.FC<TextBlockEditorProps> = ({
  block,
  onTextChange,
  onSelect,
  $isSelected,
  blockIndex,
  listNumber,
}) => {
  const isList = block.blockType === 'bullet' || block.blockType === 'numbered';
  
  const prefixText = useMemo(() => {
    if (block.blockType === 'bullet') {
      return '•';
    }
    if (block.blockType === 'numbered' && listNumber !== undefined) {
      return `${listNumber}.`;
    }
    return '';
  }, [block.blockType, listNumber]);

  const placeholder = useMemo(() => {
    switch (block.blockType) {
      case 'heading1':
        return 'Heading 1';
      case 'heading2':
        return 'Heading 2';
      case 'bullet':
      case 'numbered':
        return 'List item';
      default:
        return 'Type here...';
    }
  }, [block.blockType]);

  return (
    <BlockContainer $isSelected={$isSelected} $isList={isList}>
      {isList && (
        <ListPrefix $blockType={block.blockType}>
          <ListPrefixText
            $blockType={block.blockType}
            $fontSize={block.formatting.fontSize}
            $bold={block.formatting.bold}
          >
            {prefixText}
          </ListPrefixText>
        </ListPrefix>
      )}
      <InputContainer>
        <Input
          $block={block}
          value={block.text}
          onChangeText={text => onTextChange(block.id, text)}
          onFocus={() => onSelect(block.id)}
          placeholder={placeholder}
          multiline
          textAlignVertical="top"
          accessibilityLabel={`${block.blockType} block`}
          accessibilityHint="Tap to edit text"
        />
      </InputContainer>
    </BlockContainer>
  );
};

export default TextBlockEditor;
