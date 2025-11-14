import React from 'react';
import styled from 'styled-components/native';
import {NOTE_COLORS} from '@/types/note';

/**
 * Props for ColorPicker component
 */
export interface ColorPickerProps {
  /** Currently selected color */
  selectedColor: string;
  /** Color selection callback */
  onColorSelect: (color: string) => void;
  /** Available colors (defaults to NOTE_COLORS) */
  colors?: readonly string[];
  /** Number of columns in the grid */
  columns?: number;
}

const Container = styled.View`
  width: 100%;
`;

const ColorGrid = styled.View<{$columns: number}>`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 12px;
`;

const ColorSwatch = styled.TouchableOpacity<{
  $color: string;
  $selected: boolean;
  $columns: number;
}>`
  width: ${props => `${100 / props.$columns - 10}%`};
  aspect-ratio: 1;
  background-color: ${props => props.$color};
  border-radius: 8px;
  border: 3px solid
    ${props => (props.$selected ? props.theme.text : props.theme.border)};
  align-items: center;
  justify-content: center;
`;

const CheckMark = styled.View`
  width: 16px;
  height: 16px;
  border-radius: 8px;
  background-color: ${props => props.theme.text};
`;

/**
 * ColorPicker component for selecting note colors
 *
 * @example
 * ```tsx
 * <ColorPicker
 *   selectedColor={noteColor}
 *   onColorSelect={handleColorChange}
 * />
 *
 * <ColorPicker
 *   selectedColor={brushColor}
 *   onColorSelect={setBrushColor}
 *   colors={customColors}
 *   columns={4}
 * />
 * ```
 */
export const ColorPicker: React.FC<ColorPickerProps> = ({
  selectedColor,
  onColorSelect,
  colors = NOTE_COLORS,
  columns = 4,
}) => {
  return (
    <Container>
      <ColorGrid $columns={columns}>
        {colors.map(color => (
          <ColorSwatch
            key={color}
            $color={color}
            $selected={selectedColor === color}
            $columns={columns}
            onPress={() => onColorSelect(color)}
            accessibilityRole="button"
            accessibilityLabel={`Select color ${color}`}
            accessibilityState={{selected: selectedColor === color}}
          >
            {selectedColor === color && <CheckMark />}
          </ColorSwatch>
        ))}
      </ColorGrid>
    </Container>
  );
};

export default ColorPicker;
