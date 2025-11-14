import React, {useCallback, useMemo, useRef} from 'react';
import {PanResponder, LayoutChangeEvent} from 'react-native';
import styled from 'styled-components/native';

/**
 * Props for Slider component
 */
export interface SliderProps {
  /** Current value */
  value: number;
  /** Minimum value */
  min: number;
  /** Maximum value */
  max: number;
  /** Step increment */
  step?: number;
  /** Value change callback */
  onValueChange: (value: number) => void;
  /** Disabled state */
  $disabled?: boolean;
  /** Accessibility label */
  accessibilityLabel?: string;
}

const Container = styled.View`
  width: 100%;
  padding: 12px 0;
`;

const Track = styled.View<{$disabled?: boolean}>`
  height: 4px;
  background-color: ${props =>
    props.$disabled ? props.theme.border : props.theme.surface};
  border-radius: 2px;
  position: relative;
`;

const FilledTrack = styled.View<{$width: number; $disabled?: boolean}>`
  height: 4px;
  width: ${props => props.$width}%;
  background-color: ${props =>
    props.$disabled ? props.theme.textSecondary : props.theme.text};
  border-radius: 2px;
  position: absolute;
  left: 0;
  top: 0;
`;

const Thumb = styled.View<{$left: number; $disabled?: boolean}>`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  background-color: ${props =>
    props.$disabled ? props.theme.textSecondary : props.theme.text};
  position: absolute;
  top: -10px;
  left: ${props => props.$left}%;
  margin-left: -12px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  elevation: 5;
`;

/**
 * Custom Slider component for numeric value input
 *
 * @example
 * ```tsx
 * <Slider
 *   value={brushSize}
 *   min={1}
 *   max={50}
 *   step={1}
 *   onValueChange={setBrushSize}
 *   accessibilityLabel="Brush size"
 * />
 *
 * <Slider
 *   value={ttsRate}
 *   min={0.5}
 *   max={2.0}
 *   step={0.1}
 *   onValueChange={setTTSRate}
 * />
 * ```
 */
export const Slider: React.FC<SliderProps> = ({
  value,
  min,
  max,
  step = 1,
  onValueChange,
  $disabled = false,
  accessibilityLabel,
}) => {
  const trackWidth = useRef(0);

  const percentage = useMemo(() => {
    return ((value - min) / (max - min)) * 100;
  }, [value, min, max]);

  const updateValue = useCallback(
    (x: number) => {
      if ($disabled || trackWidth.current === 0) return;

      const percent = Math.max(0, Math.min(1, x / trackWidth.current));
      const range = max - min;
      let newValue = min + percent * range;

      // Apply step
      if (step > 0) {
        newValue = Math.round(newValue / step) * step;
      }

      // Clamp to min/max
      newValue = Math.max(min, Math.min(max, newValue));

      if (newValue !== value) {
        onValueChange(newValue);
      }
    },
    [$disabled, min, max, step, value, onValueChange],
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !$disabled,
        onMoveShouldSetPanResponder: () => !$disabled,
        onPanResponderGrant: evt => {
          const x = evt.nativeEvent.locationX;
          updateValue(x);
        },
        onPanResponderMove: evt => {
          const x = evt.nativeEvent.locationX;
          updateValue(x);
        },
      }),
    [$disabled, updateValue],
  );

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    trackWidth.current = event.nativeEvent.layout.width;
  }, []);

  return (
    <Container
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{
        min,
        max,
        now: value,
      }}
    >
      <Track onLayout={handleLayout} {...panResponder.panHandlers} $disabled={$disabled}>
        <FilledTrack $width={percentage} $disabled={$disabled} />
        <Thumb $left={percentage} $disabled={$disabled} />
      </Track>
    </Container>
  );
};

export default Slider;
