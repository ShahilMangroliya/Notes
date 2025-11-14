import React, {useCallback, useMemo} from 'react';
import {Canvas, Path, Skia, useCanvasRef} from '@shopify/react-native-skia';
import {StyleSheet} from 'react-native';
import styled from 'styled-components/native';
import type {DrawingStroke, Point} from '@/types/note';

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
  background-color: ${props => props.theme.surface};
`;

/**
 * Convert points array to SKPath
 */
const pointsToPath = (points: Point[]): string => {
  if (points.length === 0) return '';

  let pathData = `M ${points[0].x} ${points[0].y}`;

  for (let i = 1; i < points.length; i++) {
    pathData += ` L ${points[i].x} ${points[i].y}`;
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
  const canvasRef = useCanvasRef();

  const handleTouch = useCallback(
    (event: any) => {
      const {locationX, locationY} = event.nativeEvent;
      const point: Point = {x: locationX, y: locationY};

      switch (event.nativeEvent.type) {
        case 'topTouchStart':
          onTouchStart(point);
          break;
        case 'topTouchMove':
          onTouchMove(point);
          break;
        case 'topTouchEnd':
        case 'topTouchCancel':
          onTouchEnd();
          break;
      }
    },
    [onTouchStart, onTouchMove, onTouchEnd],
  );

  // Render all completed strokes
  const renderedStrokes = useMemo(() => {
    return strokes.map(stroke => {
      const pathData = pointsToPath(stroke.points);
      if (!pathData) return null;

      const path = Skia.Path.MakeFromSVGString(pathData);
      if (!path) return null;

      return (
        <Path
          key={stroke.id}
          path={path}
          color={stroke.color}
          style="stroke"
          strokeWidth={stroke.width}
          strokeCap="round"
          strokeJoin="round"
        />
      );
    });
  }, [strokes]);

  // Render current stroke being drawn
  const renderedCurrentStroke = useMemo(() => {
    if (!currentStroke || currentStroke.points.length === 0) return null;

    const pathData = pointsToPath(currentStroke.points);
    if (!pathData) return null;

    const path = Skia.Path.MakeFromSVGString(pathData);
    if (!path) return null;

    return (
      <Path
        path={path}
        color={currentStroke.color}
        style="stroke"
        strokeWidth={currentStroke.width}
        strokeCap="round"
        strokeJoin="round"
      />
    );
  }, [currentStroke]);

  return (
    <CanvasContainer
      $width={width}
      $height={height}
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      onResponderGrant={handleTouch}
      onResponderMove={handleTouch}
      onResponderRelease={handleTouch}
      onResponderTerminate={handleTouch}
    >
      <Canvas ref={canvasRef} style={{width, height}}>
        {/* Background */}
        <Path
          path={Skia.Path.Make().addRect(Skia.XYWHRect(0, 0, width, height))}
          color={backgroundColor}
        />

        {/* Completed strokes */}
        {renderedStrokes}

        {/* Current stroke */}
        {renderedCurrentStroke}
      </Canvas>
    </CanvasContainer>
  );
};

export default DrawingCanvas;
