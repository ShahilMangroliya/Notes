import React, {useRef} from 'react';
import {Pressable} from 'react-native';
import Swipeable, {
  type SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, {
  type SharedValue,
  useAnimatedStyle,
  interpolate,
} from 'react-native-reanimated';
import styled from 'styled-components/native';
import NoteCard from '@/components/NoteCard';
import Icon from '@/components/Icon';
import type {Note} from '@/types/note';

/**
 * Props for SwipeableNoteCard component
 */
export interface SwipeableNoteCardProps {
  /** Note data */
  note: Note;
  /** Press handler to open note */
  onPress: (noteId: string) => void;
  /** Long press handler for context menu */
  onLongPress?: (noteId: string) => void;
  /** Delete handler */
  onDelete: (noteId: string) => void;
}

const DeleteActionContainer = styled.View`
  justify-content: center;
  margin-bottom: 12px;
`;

const DeleteButton = styled(Pressable)`
  background-color: #ff3b30;
  justify-content: center;
  align-items: center;
  height: 100%;
  min-height: 80px;
  padding: 0 24px;
  border-radius: 16px;
  flex-direction: column;
  gap: 4px;
`;

const DeleteText = styled.Text`
  color: #ffffff;
  font-size: 13px;
  font-weight: 600;
  text-align: center;
`;

const AnimatedView = Reanimated.createAnimatedComponent(DeleteActionContainer);

/**
 * Delete action component for swipeable (must be separate to use hooks)
 */
const DeleteAction: React.FC<{
  dragX: SharedValue<number>;
  onDelete: () => void;
}> = ({dragX, onDelete}) => {
  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(dragX.value, [-100, 100], [0, 10], 'clamp');
    const opacity = interpolate(
      dragX.value,
      [-100, -50, 0],
      [1, 0.8, 0],
      'clamp',
    );

    return {
      transform: [{translateX}],
      opacity,
    };
  });

  return (
    <AnimatedView style={animatedStyle}>
      <DeleteButton
        onPress={onDelete}
        accessibilityRole="button"
        accessibilityLabel="Delete note"
        accessibilityHint="Permanently delete this note"
      >
        <Icon name="delete" size={28} color="#FFFFFF" />
        <DeleteText>Delete</DeleteText>
      </DeleteButton>
    </AnimatedView>
  );
};

/**
 * SwipeableNoteCard component with left swipe to delete
 *
 * Features:
 * - Swipe left to reveal delete action
 * - Long press for context menu
 * - Tap to open note
 *
 * @example
 * ```tsx
 * <SwipeableNoteCard
 *   note={note}
 *   onPress={handleOpenNote}
 *   onLongPress={handleShowMenu}
 *   onDelete={handleDeleteNote}
 * />
 * ```
 */
export const SwipeableNoteCard: React.FC<SwipeableNoteCardProps> = ({
  note,
  onPress,
  onLongPress,
  onDelete,
}) => {
  const swipeableRef = useRef<SwipeableMethods>(null);

  const renderRightActions = (
    _progress: SharedValue<number>,
    dragX: SharedValue<number>,
  ) => {
    return (
      <DeleteAction
        dragX={dragX}
        onDelete={() => {
          swipeableRef.current?.close();
          onDelete(note.id);
        }}
      />
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      overshootRight={false}
      friction={2}
      rightThreshold={50}
      enableTrackpadTwoFingerGesture
    >
      <NoteCard note={note} onPress={onPress} onLongPress={onLongPress} />
    </Swipeable>
  );
};

export default SwipeableNoteCard;
