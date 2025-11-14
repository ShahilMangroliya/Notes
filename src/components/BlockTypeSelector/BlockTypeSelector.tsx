import React from 'react';
import {ScrollView} from 'react-native';
import styled from 'styled-components/native';
import {useTheme} from 'styled-components/native';
import Icon from '@/components/Icon';
import type {AntDesignIconName} from '@/components/Icon';
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
  background-color: ${props => props.theme.background};
  padding: 8px 12px;
`;

const ButtonRow = styled.View`
  flex-direction: row;
  gap: 6px;
`;

const TypeButton = styled.TouchableOpacity<{$active: boolean}>`
  background-color: ${props =>
    props.$active ? props.theme.text : props.theme.surface};
  border-radius: 8px;
  padding: 8px 14px;
  flex-direction: row;
  align-items: center;
  gap: 6px;
`;

const IconContainer = styled.View``;

const TypeLabel = styled.Text<{$active: boolean}>`
  color: ${props => (props.$active ? props.theme.surface : props.theme.text)};
  font-size: 14px;
  font-weight: ${props => (props.$active ? '600' : '400')};
`;

interface BlockTypeOption {
  type: BlockType;
  label: string;
  icon: AntDesignIconName;
}

const BLOCK_TYPE_OPTIONS: BlockTypeOption[] = [
  {type: 'paragraph', label: 'Paragraph', icon: 'file-text'},
  {type: 'heading1', label: 'H1', icon: 'font-size'},
  {type: 'heading2', label: 'H2', icon: 'font-size'},
  {type: 'bullet', label: 'Bullet', icon: 'unordered-list'},
  {type: 'numbered', label: 'Number', icon: 'ordered-list'},
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
  const theme = useTheme();

  return (
    <Container>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{paddingHorizontal: 4}}
      >
        <ButtonRow>
          {BLOCK_TYPE_OPTIONS.map(option => {
            const isActive = currentType === option.type;
            return (
              <TypeButton
                key={option.type}
                $active={isActive}
                onPress={() => onTypeChange(option.type)}
                accessibilityRole="button"
                accessibilityLabel={`Set block type to ${option.label}`}
                accessibilityState={{selected: isActive}}
              >
                <IconContainer>
                  <Icon
                    name={option.icon}
                    size={16}
                    color={isActive ? theme.surface : theme.text}
                  />
                </IconContainer>
                <TypeLabel $active={isActive}>{option.label}</TypeLabel>
              </TypeButton>
            );
          })}
        </ButtonRow>
      </ScrollView>
    </Container>
  );
};

export default BlockTypeSelector;
