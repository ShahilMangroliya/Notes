import React from 'react';
import {ScrollView} from 'react-native';
import styled from 'styled-components/native';
import type {BlockType} from '@/types/note';

/**
 * Props for BlockTypeSelector component
 */
export interface BlockTypeSelectorProps {
  /** Current block type */
  currentType: BlockType;
  /** Block type change handler */
  onTypeChange: (type: BlockType) => void;
}

const Container = styled.View`
  background-color: ${props => props.theme.surface};
  border-bottom-width: 1px;
  border-color: ${props => props.theme.border};
  padding: 8px;
`;

const ButtonRow = styled.View`
  flex-direction: row;
  gap: 8px;
`;

const TypeButton = styled.TouchableOpacity<{$active: boolean}>`
  background-color: ${props =>
    props.$active ? props.theme.text : props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 6px;
  padding: 8px 16px;
  flex-direction: row;
  align-items: center;
  gap: 6px;
`;

const TypeIcon = styled.Text<{$active: boolean}>`
  font-size: 16px;
`;

const TypeLabel = styled.Text<{$active: boolean}>`
  color: ${props => (props.$active ? props.theme.surface : props.theme.text)};
  font-size: 14px;
  font-weight: ${props => (props.$active ? '600' : '400')};
`;

interface BlockTypeOption {
  type: BlockType;
  label: string;
  icon: string;
}

const BLOCK_TYPE_OPTIONS: BlockTypeOption[] = [
  {type: 'paragraph', label: 'Paragraph', icon: '¶'},
  {type: 'heading1', label: 'H1', icon: 'H1'},
  {type: 'heading2', label: 'H2', icon: 'H2'},
  {type: 'bullet', label: 'Bullet', icon: '•'},
  {type: 'numbered', label: 'Number', icon: '1.'},
];

/**
 * BlockTypeSelector component for changing text block types
 *
 * @example
 * ```tsx
 * <BlockTypeSelector
 *   currentType={blockType}
 *   onTypeChange={handleTypeChange}
 * />
 * ```
 */
export const BlockTypeSelector: React.FC<BlockTypeSelectorProps> = ({
  currentType,
  onTypeChange,
}) => {
  return (
    <Container>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{paddingHorizontal: 4}}
      >
        <ButtonRow>
          {BLOCK_TYPE_OPTIONS.map(option => (
            <TypeButton
              key={option.type}
              $active={currentType === option.type}
              onPress={() => onTypeChange(option.type)}
              accessibilityRole="button"
              accessibilityLabel={`Set block type to ${option.label}`}
              accessibilityState={{selected: currentType === option.type}}
            >
              <TypeIcon $active={currentType === option.type}>
                {option.icon}
              </TypeIcon>
              <TypeLabel $active={currentType === option.type}>
                {option.label}
              </TypeLabel>
            </TypeButton>
          ))}
        </ButtonRow>
      </ScrollView>
    </Container>
  );
};

export default BlockTypeSelector;
