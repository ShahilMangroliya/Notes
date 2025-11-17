import React from 'react';
import {ScrollView} from 'react-native';
import styled from 'styled-components/native';
import {useTheme} from 'styled-components/native';
import Icon from '@/components/Icon';

/**
 * Props for DrawingToolbar component
 */
export interface DrawingToolbarProps {
  /** Current drawing tool */
  selectedTool: 'pencil' | 'eraser';
  /** Brush size (1-50) */
  brushSize: number;
  /** Brush color */
  brushColor: string;
  /** Available colors */
  colors?: readonly string[];
  /** Tool selection handler */
  onToolChange: (tool: 'pencil' | 'eraser') => void;
  /** Brush size change handler */
  onBrushSizeChange: (size: number) => void;
  /** Color change handler */
  onColorChange: (color: string) => void;
  /** Undo handler */
  onUndo?: () => void;
  /** Redo handler */
  onRedo?: () => void;
  /** Clear canvas handler */
  onClear?: () => void;
  /** Can undo */
  canUndo?: boolean;
  /** Can redo */
  canRedo?: boolean;
}

const Container = styled.View`
  background-color: ${props => props.theme.surface};
  border-top-width: 1px;
  border-color: ${props => props.theme.border};
  padding: 8px 12px;
`;

const ToolRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Section = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;

const ColorSection = styled.View`
  flex: 1;
  /* max-width: 60%; */
`;

const ColorButton = styled.TouchableOpacity<{
  $color: string;
  $active?: boolean;
}>`
  width: 28px;
  height: 28px;
  border-radius: 14px;
  background-color: ${props => props.$color};
  border: 3px solid ${props => (props.$active ? '#007AFF' : props.theme.border)};
`;

const ActionButton = styled.TouchableOpacity<{$disabled?: boolean}>`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  align-items: center;
  justify-content: center;
  opacity: ${props => (props.$disabled ? 0.4 : 1)};
`;

/**
 * DrawingToolbar component for drawing tools and controls
 *
 * @example
 * ```tsx
 * <DrawingToolbar
 *   selectedTool={tool}
 *   brushSize={brushSize}
 *   brushColor={brushColor}
 *   onToolChange={handleToolChange}
 *   onBrushSizeChange={handleBrushSizeChange}
 *   onColorChange={handleColorChange}
 *   onUndo={handleUndo}
 *   onRedo={handleRedo}
 *   onClear={handleClear}
 *   canUndo={canUndo}
 *   canRedo={canRedo}
 * />
 * ```
 */
export const DrawingToolbar: React.FC<DrawingToolbarProps> = ({
  selectedTool: _selectedTool,
  brushSize: _brushSize,
  brushColor,
  colors,
  onToolChange: _onToolChange,
  onBrushSizeChange: _onBrushSizeChange,
  onColorChange,
  onUndo,
  onRedo: _onRedo,
  onClear,
  canUndo = false,
  canRedo: _canRedo = false,
}) => {
  const theme = useTheme();

  return (
    <Container>
      <ToolRow>
        {/* Left: Color Picker */}
        <ColorSection>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              paddingHorizontal: 4,
            }}
          >
            {colors?.map(color => (
              <ColorButton
                key={color}
                $color={color}
                $active={brushColor === color}
                onPress={() => onColorChange(color)}
                accessibilityRole="button"
                accessibilityLabel={`Select color ${color}`}
                accessibilityState={{selected: brushColor === color}}
              />
            ))}
          </ScrollView>
        </ColorSection>

        {/* Right: Actions */}
        <Section>
          {onUndo && (
            <ActionButton
              $disabled={!canUndo}
              onPress={onUndo}
              accessibilityLabel="Undo"
              disabled={!canUndo}
            >
              <Icon
                name="undo"
                size={20}
                color={canUndo ? theme.text : theme.textSecondary}
              />
            </ActionButton>
          )}

          {onClear && (
            <ActionButton onPress={onClear} accessibilityLabel="Clear canvas">
              <Icon name="rest" size={20} color={theme.text} />
            </ActionButton>
          )}
        </Section>
      </ToolRow>
    </Container>
  );
};

export default DrawingToolbar;
