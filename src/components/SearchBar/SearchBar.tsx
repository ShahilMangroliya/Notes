import React from 'react';
import styled from 'styled-components/native';

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
  border-radius: 12px;
  flex-direction: row;
  align-items: center;
  padding: 12px 16px;
  border: 1px solid ${props => props.theme.border};
`;

const SearchIcon = styled.Text`
  font-size: 18px;
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

const ClearIcon = styled.Text`
  font-size: 16px;
  color: ${props => props.theme.textSecondary};
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
  return (
    <Container>
      <SearchIcon>🔍</SearchIcon>
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
          <ClearIcon>✕</ClearIcon>
        </ClearButton>
      )}
    </Container>
  );
};

export default SearchBar;
