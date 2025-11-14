import React from 'react';
import {ScrollView} from 'react-native';
import styled from 'styled-components/native';
import {useTheme} from 'styled-components/native';
import IconButton from '@/components/IconButton';
import Icon from '@/components/Icon';
import Slider from '@/components/Slider';
import ColorPicker from '@/components/ColorPicker';

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
  border-bottom-width: 1px;
  border-color: ${props => props.theme.border};
  padding: 12px;
`;

const Section = styled.View`
  margin-bottom: 12px;
`;

const SectionTitle = styled.Text`
  color: ${props => props.theme.textSecondary};
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 8px;
  text-transform: uppercase;
`;

const ToolRow = styled.View`
  flex-direction: row;
  gap: 8px;
  align-items: center;
`;

const ToolButton = styled.TouchableOpacity<{$active: boolean}>`
  background-color: ${props =>
    props.$active ? props.theme.background : props.theme.surface};
  border: 2px solid
    ${props => (props.$active ? props.theme.text : props.theme.border)};
  border-radius: 8px;
  padding: 12px 16px;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  flex: 1;
`;

const IconContainer = styled.View``;

const ToolLabel = styled.Text<{$active: boolean}>`
  color: ${props => props.theme.text};
  font-size: 14px;
  font-weight: ${props => (props.$active ? '600' : '400')};
`;

const Divider = styled.View`
  height: 1px;
  background-color: ${props => props.theme.border};
  margin: 12px 0;
`;

const SliderContainer = styled.View`
  padding: 0 4px;
`;

const SliderLabel = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
`;

const SliderValue = styled.Text`
  color: ${props => props.theme.text};
  font-size: 14px;
  font-weight: 600;
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
  selectedTool,
  brushSize,
  brushColor,
  colors,
  onToolChange,
  onBrushSizeChange,
  onColorChange,
  onUndo,
  onRedo,
  onClear,
  canUndo = false,
  canRedo = false,
}) => {
  const theme = useTheme();

  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Tools */}
        <Section>
          <SectionTitle>Tools</SectionTitle>
          <ToolRow>
            <ToolButton
              $active={selectedTool === 'pencil'}
              onPress={() => onToolChange('pencil')}
              accessibilityRole="button"
              accessibilityLabel="Pencil tool"
              accessibilityState={{selected: selectedTool === 'pencil'}}
            >
              <IconContainer>
                <Icon
                  name="edit"
                  size={20}
                  color={selectedTool === 'pencil' ? theme.text : theme.text}
                />
              </IconContainer>
              <ToolLabel $active={selectedTool === 'pencil'}>Pencil</ToolLabel>
            </ToolButton>

            <ToolButton
              $active={selectedTool === 'eraser'}
              onPress={() => onToolChange('eraser')}
              accessibilityRole="button"
              accessibilityLabel="Eraser tool"
              accessibilityState={{selected: selectedTool === 'eraser'}}
            >
              <IconContainer>
                <Icon
                  name="delete"
                  size={20}
                  color={selectedTool === 'eraser' ? theme.text : theme.text}
                />
              </IconContainer>
              <ToolLabel $active={selectedTool === 'eraser'}>Eraser</ToolLabel>
            </ToolButton>
          </ToolRow>
        </Section>

        {/* Brush Size */}
        <Section>
          <SliderLabel>
            <SectionTitle>Brush Size</SectionTitle>
            <SliderValue>{brushSize}px</SliderValue>
          </SliderLabel>
          <SliderContainer>
            <Slider
              value={brushSize}
              min={1}
              max={50}
              step={1}
              onValueChange={onBrushSizeChange}
              accessibilityLabel="Brush size"
            />
          </SliderContainer>
        </Section>

        {/* Color Picker */}
        {selectedTool === 'pencil' && (
          <Section>
            <SectionTitle>Color</SectionTitle>
            <ColorPicker
              selectedColor={brushColor}
              onColorSelect={onColorChange}
              colors={colors}
            />
          </Section>
        )}

        <Divider />

        {/* Actions */}
        <Section>
          <SectionTitle>Actions</SectionTitle>
          <ToolRow>
            {onUndo && (
              <IconButton
                onPress={onUndo}
                $disabled={!canUndo}
                accessibilityLabel="Undo"
                $size="small"
              >
                <Icon
                  name="undo"
                  size={20}
                  color={canUndo ? theme.text : theme.textSecondary}
                />
              </IconButton>
            )}

            {onRedo && (
              <IconButton
                onPress={onRedo}
                $disabled={!canRedo}
                accessibilityLabel="Redo"
                $size="small"
              >
                <Icon
                  name="redo"
                  size={20}
                  color={canRedo ? theme.text : theme.textSecondary}
                />
              </IconButton>
            )}

            {onClear && (
              <IconButton
                onPress={onClear}
                accessibilityLabel="Clear canvas"
                $size="small"
              >
                <Icon name="delete" size={20} color={theme.text} />
              </IconButton>
            )}
          </ToolRow>
        </Section>
      </ScrollView>
    </Container>
  );
};

export default DrawingToolbar;
