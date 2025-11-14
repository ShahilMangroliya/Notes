import React, {useMemo} from 'react';
import styled from 'styled-components/native';
import type {Note, TextContent} from '@/types/note';

/**
 * Props for NoteCard component
 */
export interface NoteCardProps {
  /** Note data */
  note: Note;
  /** Press handler to open note */
  onPress: (noteId: string) => void;
  /** Long press handler for context menu */
  onLongPress?: (noteId: string) => void;
}

const Card = styled.TouchableOpacity<{$color: string}>`
  background-color: ${props => props.$color};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 3px;
  elevation: 3;
  border: 1px solid ${props => props.theme.border};
`;

const Header = styled.View`
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const Title = styled.Text`
  color: ${props => props.theme.text};
  font-size: 18px;
  font-weight: 600;
  flex: 1;
  margin-right: 8px;
`;

const HeaderRight = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 6px;
`;

const PinIndicator = styled.Text`
  font-size: 16px;
  line-height: 16px;
`;

const TypeBadge = styled.View`
  background-color: ${props => props.theme.surface};
  padding: 4px 8px;
  border-radius: 4px;
`;

const TypeText = styled.Text`
  color: ${props => props.theme.textSecondary};
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
`;

const Preview = styled.Text.attrs({
  numberOfLines: 3,
})`
  color: ${props => props.theme.textSecondary};
  font-size: 14px;
  line-height: 20px;
  margin-bottom: 12px;
`;

const Footer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Timestamp = styled.Text`
  color: ${props => props.theme.textSecondary};
  font-size: 12px;
`;

const TagsContainer = styled.View`
  flex-direction: row;
  gap: 4px;
`;

const Tag = styled.View`
  background-color: ${props => props.theme.surface};
  padding: 2px 6px;
  border-radius: 3px;
`;

const TagText = styled.Text`
  color: ${props => props.theme.textSecondary};
  font-size: 10px;
`;

/**
 * Format timestamp to relative time
 */
const formatRelativeTime = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
};

/**
 * Extract preview text from note content
 */
const getPreviewText = (note: Note): string => {
  if (note.type === 'text') {
    const textContent = note.content as TextContent;
    const text = textContent.blocks
      .map(block => block.text)
      .join(' ')
      .trim();
    return text || 'Empty note';
  }
  return 'Drawing note';
};

/**
 * NoteCard component for displaying note preview in list
 *
 * @example
 * ```tsx
 * <NoteCard
 *   note={note}
 *   onPress={handleOpenNote}
 *   onLongPress={handleShowMenu}
 * />
 * ```
 */
export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onPress,
  onLongPress,
}) => {
  const preview = useMemo(() => getPreviewText(note), [note]);
  const timestamp = useMemo(
    () => formatRelativeTime(note.updatedAt),
    [note.updatedAt],
  );

  return (
    <Card
      $color={note.color}
      onPress={() => onPress(note.id)}
      onLongPress={onLongPress ? () => onLongPress(note.id) : undefined}
      accessibilityRole="button"
      accessibilityLabel={`${note.title}, ${note.type} note, ${timestamp}`}
      accessibilityHint="Tap to open note"
    >
      <Header>
        <Title>{note.title || 'Untitled'}</Title>
        <HeaderRight>
          {note.isPinned && <PinIndicator>📌</PinIndicator>}
          <TypeBadge>
            <TypeText>{note.type}</TypeText>
          </TypeBadge>
        </HeaderRight>
      </Header>

      <Preview>{preview}</Preview>

      <Footer>
        <Timestamp>{timestamp}</Timestamp>
        {note.tags.length > 0 && (
          <TagsContainer>
            {note.tags.slice(0, 2).map((tag, index) => (
              <Tag key={index}>
                <TagText>#{tag}</TagText>
              </Tag>
            ))}
            {note.tags.length > 2 && (
              <Tag>
                <TagText>+{note.tags.length - 2}</TagText>
              </Tag>
            )}
          </TagsContainer>
        )}
      </Footer>
    </Card>
  );
};

export default NoteCard;
