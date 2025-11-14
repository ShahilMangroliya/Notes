import React from 'react';
import styled from 'styled-components/native';
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
    props.$active ? props.theme.background : props.theme.surface};
  border: 1px solid
    ${props => (props.$active ? props.theme.text : props.theme.border)};
  border-radius: 20px;
  padding: 8px 16px;
  flex-direction: row;
  align-items: center;
  gap: 6px;
`;

const FilterText = styled.Text<{$active: boolean}>`
  color: ${props => props.theme.text};
  font-size: 14px;
  font-weight: ${props => (props.$active ? '600' : '400')};
`;

const Count = styled.Text<{$active: boolean}>`
  color: ${props => props.theme.textSecondary};
  font-size: 12px;
  font-weight: ${props => (props.$active ? '600' : '400')};
`;

interface FilterOption {
  key: NoteFilter;
  label: string;
  icon: string;
}

const FILTER_OPTIONS: FilterOption[] = [
  {key: 'all', label: 'All', icon: '📝'},
  {key: 'text', label: 'Text', icon: '📄'},
  {key: 'drawing', label: 'Drawing', icon: '🎨'},
  {key: 'pinned', label: 'Pinned', icon: '📌'},
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
  return (
    <Container>
      {FILTER_OPTIONS.map(option => (
        <FilterButton
          key={option.key}
          $active={activeFilter === option.key}
          onPress={() => onFilterChange(option.key)}
          accessibilityRole="button"
          accessibilityLabel={`Filter by ${option.label}`}
          accessibilityState={{selected: activeFilter === option.key}}
        >
          <FilterText $active={activeFilter === option.key}>
            {option.icon} {option.label}
          </FilterText>
          {counts && counts[option.key] > 0 && (
            <Count $active={activeFilter === option.key}>
              ({counts[option.key]})
            </Count>
          )}
        </FilterButton>
      ))}
    </Container>
  );
};

export default FilterBar;
