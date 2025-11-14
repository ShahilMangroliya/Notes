import React from 'react';
import styled from 'styled-components/native';
import {useTheme} from 'styled-components/native';
import Icon from '@/components/Icon';
import type {AntDesignIconName} from '@/components/Icon';
import type {NoteFilter} from '@/types/note';

/**
 * Props for FilterBar component
 */
export interface FilterBarProps {
  /** Current filter */
  activeFilter: NoteFilter;
  /** Filter change handler */
  onFilterChange: (filter: NoteFilter) => void;
  /** Note counts for each filter */
  counts?: {
    all: number;
    text: number;
    drawing: number;
    pinned: number;
  };
}

const Container = styled.View`
  flex-direction: row;
  gap: 8px;
`;

const FilterButton = styled.TouchableOpacity<{$active: boolean}>`
  background-color: ${props =>
    props.$active ? props.theme.text : props.theme.surface};
  border-radius: 20px;
  padding: 10px 18px;
  flex-direction: row;
  align-items: center;
  gap: 6px;
`;

const FilterContent = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 6px;
`;

const FilterText = styled.Text<{$active: boolean}>`
  color: ${props => (props.$active ? props.theme.surface : props.theme.text)};
  font-size: 14px;
  font-weight: ${props => (props.$active ? '600' : '500')};
`;

const Count = styled.Text<{$active: boolean}>`
  color: ${props =>
    props.$active ? props.theme.surface : props.theme.textSecondary};
  font-size: 12px;
  font-weight: ${props => (props.$active ? '600' : '400')};
  opacity: ${props => (props.$active ? 0.9 : 0.7)};
`;

interface FilterOption {
  key: NoteFilter;
  label: string;
  icon: AntDesignIconName;
}

const FILTER_OPTIONS: FilterOption[] = [
  {key: 'all', label: 'All', icon: 'file-text'},
  {key: 'text', label: 'Text', icon: 'file-text'},
  {key: 'drawing', label: 'Drawing', icon: 'picture'},
  {key: 'pinned', label: 'Pinned', icon: 'pushpin'},
];

/**
 * FilterBar component for filtering notes by type
 *
 * @example
 * ```tsx
 * <FilterBar
 *   activeFilter={filter}
 *   onFilterChange={setFilter}
 *   counts={{all: 10, text: 6, drawing: 3, pinned: 2}}
 * />
 * ```
 */
export const FilterBar: React.FC<FilterBarProps> = ({
  activeFilter,
  onFilterChange,
  counts,
}) => {
  const theme = useTheme();

  return (
    <Container>
      {FILTER_OPTIONS.map(option => {
        const isActive = activeFilter === option.key;
        return (
          <FilterButton
            key={option.key}
            $active={isActive}
            onPress={() => onFilterChange(option.key)}
            accessibilityRole="button"
            accessibilityLabel={`Filter by ${option.label}`}
            accessibilityState={{selected: isActive}}
          >
            <FilterContent>
              <Icon
                name={option.icon}
                size={14}
                color={isActive ? theme.surface : theme.text}
              />
              <FilterText $active={isActive}>{option.label}</FilterText>
              {counts && counts[option.key] > 0 && (
                <Count $active={isActive}>({counts[option.key]})</Count>
              )}
            </FilterContent>
          </FilterButton>
        );
      })}
    </Container>
  );
};

export default FilterBar;
