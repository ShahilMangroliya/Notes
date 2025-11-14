import React from 'react';
import styled from 'styled-components/native';
import {useTheme} from 'styled-components/native';
import Icon from '@/components/Icon';

/**
 * Props for SearchBar component
 */
export interface SearchBarProps {
  /** Current search query */
  value: string;
  /** Search query change handler */
  onChangeText: (text: string) => void;
  /** Placeholder text */
  placeholder?: string;
}

const Container = styled.View`
  background-color: ${props => props.theme.surface};
  border-radius: 14px;
  flex-direction: row;
  align-items: center;
  padding: 14px 18px;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.02;
  shadow-radius: 4px;
  elevation: 1;
`;

const IconContainer = styled.View`
  margin-right: 8px;
`;

const Input = styled.TextInput.attrs(props => ({
  placeholderTextColor: props.theme.textSecondary,
}))`
  flex: 1;
  color: ${props => props.theme.text};
  font-size: 16px;
  padding: 0;
`;

const ClearButton = styled.TouchableOpacity`
  padding: 4px;
  margin-left: 8px;
`;

/**
 * SearchBar component for filtering notes
 *
 * @example
 * ```tsx
 * <SearchBar
 *   value={searchQuery}
 *   onChangeText={setSearchQuery}
 *   placeholder="Search notes..."
 * />
 * ```
 */
export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search notes...',
}) => {
  const theme = useTheme();

  return (
    <Container>
      <IconContainer>
        <Icon name="search" size={18} color={theme.textSecondary} />
      </IconContainer>
      <Input
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        returnKeyType="search"
        autoCorrect={false}
        accessibilityLabel="Search notes"
        accessibilityRole="search"
      />
      {value.length > 0 && (
        <ClearButton
          onPress={() => onChangeText('')}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
        >
          <Icon name="close" size={16} color={theme.textSecondary} />
        </ClearButton>
      )}
    </Container>
  );
};

export default SearchBar;
