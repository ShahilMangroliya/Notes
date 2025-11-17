// @refresh reset
import type {DrawingStroke, Point} from '@/types/note';
import React, {useMemo} from 'react';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import Svg, {Path} from 'react-native-svg';
import styled from 'styled-components/native';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedSvg = Animated.createAnimatedComponent(Svg);
/**
 * Props for DrawingCanvas component
 */
export interface DrawingCanvasProps {
  /** Existing strokes to display */
  strokes: DrawingStroke[];
  /** Current stroke being drawn */
  currentStroke: DrawingStroke | null;
  /** Canvas width */
  width: number;
  /** Canvas height */
  height: number;
  /** Background color */
  backgroundColor?: string;
  /** Touch start handler */
  onTouchStart: (point: Point) => void;
  /** Touch move handler */
  onTouchMove: (point: Point) => void;
  /** Touch end handler */
  onTouchEnd: () => void;
}

const CanvasContainer = styled.View<{$width: number; $height: number}>`
  width: ${props => props.$width}px;
  height: ${props => props.$height}px;
  background-color: #ffffff;
  border: 2px solid ${props => props.theme.border};
`;

/**
 * Convert points array to SVG Path data
 */
const pointsToPath = (points: Point[]): string => {
  if (points.length === 0) return '';

  let pathData = `M ${points[0].x},${points[0].y}`;

  for (let i = 1; i < points.length; i++) {
    pathData += ` L ${points[i].x},${points[i].y}`;
  }

  return pathData;
};

/**
 * DrawingCanvas component for drawing with touch
 *
 * @example
 * ```tsx
 * <DrawingCanvas
 *   strokes={drawingStrokes}
 *   currentStroke={currentStroke}
 *   width={canvasSize.width}
 *   height={canvasSize.height}
 *   onTouchStart={handleTouchStart}
 *   onTouchMove={handleTouchMove}
 *   onTouchEnd={handleTouchEnd}
 * />
 * ```
 */
export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  strokes,
  currentStroke,
  width,
  height,
  backgroundColor = '#FFFFFF',
  onTouchStart,
  onTouchMove,
  onTouchEnd,
}) => {
  // Create pan gesture - use runOnJS() to run callbacks on JS thread
  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .runOnJS(true)
        .onStart((event: any) => {
          const point: Point = {x: event.x, y: event.y};
          onTouchStart(point);
        })
        .onChange((event: any) => {
          const point: Point = {x: event.x, y: event.y};
          onTouchMove(point);
        })
        .onEnd(() => {
          onTouchEnd();
        })
        .minDistance(0),
    [onTouchStart, onTouchMove, onTouchEnd],
  );

  // Render all completed strokes
  const renderedStrokes = useMemo(() => {
    return strokes.map(stroke => {
      const pathData = pointsToPath(stroke.points);
      if (!pathData) return null;

      return (
        <AnimatedPath
          key={stroke.id}
          d={pathData}
          stroke={stroke.color}
          strokeWidth={stroke.width}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      );
    });
  }, [strokes]);

  // Render current stroke being drawn
  const renderCurrentStroke = () => {
    if (!currentStroke || currentStroke.points.length === 0) {
      return null;
    }

    const pathData = pointsToPath(currentStroke.points);
    if (!pathData) {
      return null;
    }

    return (
      <AnimatedPath
        key={`current-${currentStroke.id}-${currentStroke.points.length}`}
        d={pathData}
        stroke={currentStroke.color}
        strokeWidth={currentStroke.width}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    );
  };

  return (
    <GestureDetector gesture={panGesture}>
      <CanvasContainer $width={width} $height={height}>
        <AnimatedSvg width={width} height={height} style={{backgroundColor}}>
          {/* Completed strokes */}
          {renderedStrokes}

          {/* Current stroke */}
          {renderCurrentStroke()}
        </AnimatedSvg>
      </CanvasContainer>
    </GestureDetector>
  );
};

export default DrawingCanvas;
