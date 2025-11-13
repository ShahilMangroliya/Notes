# Vibe Code Guide - Part 5: Home Screen & Note List

## Task: Implement Home Screen with Note List

Create the main home screen with note display, search, filter, and CRUD operations.

## File 1: Custom Hook - `src/hooks/useNotes.ts`

### Instructions

Create a custom hook to wrap note operations:

```typescript
import {useCallback} from 'react';
import {useAppDispatch, useAppSelector} from './hooks';
import {
  loadNotes,
  saveNote,
  deleteNote,
  setCurrentNote,
  togglePinNote,
  updateNoteColor,
} from '@/redux/notesSlice';
import type {Note} from '@/types/note';
import {createTextNote, createDrawingNote} from '@/util/NoteHelper';

export const useNotes = () => {
  const dispatch = useAppDispatch();
  const {notes, isLoading, error} = useAppSelector(state => state.notes);

  const load = useCallback(() => {
    dispatch(loadNotes());
  }, [dispatch]);

  const save = useCallback((note: Note) => {
    return dispatch(saveNote(note));
  }, [dispatch]);

  const remove = useCallback((noteId: string) => {
    return dispatch(deleteNote(noteId));
  }, [dispatch]);

  const createText = useCallback((title: string) => {
    const note = createTextNote(title);
    dispatch(setCurrentNote(note));
    return note;
  }, [dispatch]);

  const createDrawing = useCallback((title: string) => {
    const note = createDrawingNote(title);
    dispatch(setCurrentNote(note));
    return note;
  }, [dispatch]);

  const togglePin = useCallback((noteId: string) => {
    dispatch(togglePinNote(noteId));
  }, [dispatch]);

  const changeColor = useCallback((noteId: string, color: string) => {
    dispatch(updateNoteColor({id: noteId, color}));
  }, [dispatch]);

  return {
    notes,
    isLoading,
    error,
    load,
    save,
    remove,
    createText,
    createDrawing,
    togglePin,
    changeColor,
  };
};

export default useNotes;
```

## File 2: Home Screen - `src/screens/Home/Home.tsx`

### Instructions

Create the main home screen component:

```typescript
import React, {useEffect, useState} from 'react';
import {FlatList, RefreshControl} from 'react-native';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import SafeAreaContainer from '@/components/SafeAreaContainer';
import SearchBar from './components/SearchBar';
import FilterBar from './components/FilterBar';
import NoteCard from './components/NoteCard';
import FAB from '@/components/FAB';
import EmptyState from './components/EmptyState';

import useNotes from '@/hooks/useNotes';
import {useAppSelector} from '@/hooks/hooks';
import {selectSortedNotes} from '@/redux/selectors';
import type {RootStackParamList} from '@/types/navigation';
import type {Note} from '@/types/note';

type HomeNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export const Home: React.FC = () => {
  const navigation = useNavigation<HomeNavigationProp>();
  const {load, isLoading, remove, togglePin, changeColor} = useNotes();
  const filteredNotes = useAppSelector(selectSortedNotes);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    load();
  }, [load]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const handleNotePress = (note: Note) => {
    navigation.navigate('NoteView', {noteId: note.id});
  };

  const handleCreateNote = () => {
    // Show action sheet with options
    // For now, navigate to text note editor
    navigation.navigate('NoteEditor', {noteType: 'text'});
  };

  const handleDeleteNote = async (noteId: string) => {
    await remove(noteId);
  };

  const renderNote = ({item}: {item: Note}) => (
    <NoteCard
      note={item}
      onPress={() => handleNotePress(item)}
      onDelete={() => handleDeleteNote(item.id)}
      onTogglePin={() => togglePin(item.id)}
      onChangeColor={(color) => changeColor(item.id, color)}
    />
  );

  return (
    <SafeAreaContainer>
      <Header>
        <Title>Notes</Title>
      </Header>

      <SearchBar />
      <FilterBar />

      {filteredNotes.length === 0 ? (
        <EmptyState onCreateNote={handleCreateNote} />
      ) : (
        <FlatList
          data={filteredNotes}
          renderItem={renderNote}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{padding: 16}}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          removeClippedSubviews
          maxToRenderPerBatch={10}
          windowSize={21}
        />
      )}

      <FAB
        icon={<PlusIcon>+</PlusIcon>}
        onPress={handleCreateNote}
        accessibilityLabel="Create new note"
      />
    </SafeAreaContainer>
  );
};

const Header = styled.View`
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.border};
`;

const Title = styled.Text`
  font-size: 32px;
  font-weight: bold;
  color: ${props => props.theme.text};
`;

const PlusIcon = styled.Text`
  font-size: 32px;
  color: ${props => props.theme.text};
`;

export default Home;
```

## File 3: NoteCard Component - `src/screens/Home/components/NoteCard.tsx`

### Instructions

Create the note card component with swipe-to-delete:

```typescript
import React, {memo} from 'react';
import styled from 'styled-components/native';
import {format} from 'date-fns';
import type {Note} from '@/types/note';

export interface NoteCardProps {
  note: Note;
  onPress: () => void;
  onDelete: () => void;
  onTogglePin: () => void;
  onChangeColor: (color: string) => void;
}

export const NoteCard: React.FC<NoteCardProps> = memo(({
  note,
  onPress,
  onDelete,
  onTogglePin,
  onChangeColor,
}) => {
  const getPreviewText = (): string => {
    if (note.type === 'text') {
      const firstBlock = note.content.blocks[0];
      return firstBlock?.text || 'Empty note';
    }
    return `${note.content.strokes.length} strokes`;
  };

  const formattedDate = format(note.updatedAt, 'MMM d, yyyy');

  return (
    <Card
      onPress={onPress}
      onLongPress={onTogglePin}
      $color={note.color}
      accessibilityRole="button"
      accessibilityLabel={`Note: ${note.title}`}
      accessibilityHint="Tap to view, long press to pin"
    >
      <TopRow>
        <TypeIcon>{note.type === 'text' ? '📝' : '🎨'}</TypeIcon>
        {note.isPinned && <PinIcon>📌</PinIcon>}
      </TopRow>

      <Title numberOfLines={2}>{note.title}</Title>
      <Preview numberOfLines={3}>{getPreviewText()}</Preview>

      <Footer>
        <Date>{formattedDate}</Date>
      </Footer>
    </Card>
  );
});

const Card = styled.TouchableOpacity<{$color: string}>`
  background-color: ${props => props.$color};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  border-width: 1px;
  border-color: ${props => props.theme.border};
`;

const TopRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const TypeIcon = styled.Text`
  font-size: 20px;
`;

const PinIcon = styled.Text`
  font-size: 16px;
`;

const Title = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin-bottom: 8px;
`;

const Preview = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.textSecondary};
  margin-bottom: 12px;
`;

const Footer = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const Date = styled.Text`
  font-size: 12px;
  color: ${props => props.theme.textSecondary};
`;

export default NoteCard;
```

## File 4: SearchBar - `src/screens/Home/components/SearchBar.tsx`

### Instructions

Create search bar with debounced input:

```typescript
import React, {useState, useEffect, useRef} from 'react';
import styled from 'styled-components/native';
import {useAppDispatch, useAppSelector} from '@/hooks/hooks';
import {setSearchQuery} from '@/redux/notesSlice';

export const SearchBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector(state => state.notes.searchQuery);
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      dispatch(setSearchQuery(localQuery));
    }, 300);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [localQuery, dispatch]);

  const handleClear = () => {
    setLocalQuery('');
  };

  return (
    <Container>
      <SearchIcon>🔍</SearchIcon>
      <Input
        value={localQuery}
        onChangeText={setLocalQuery}
        placeholder="Search notes..."
        placeholderTextColor={(theme: any) => theme.textSecondary}
        accessibilityLabel="Search notes"
        accessibilityRole="search"
      />
      {localQuery.length > 0 && (
        <ClearButton
          onPress={handleClear}
          accessibilityLabel="Clear search"
          accessibilityRole="button"
        >
          <ClearIcon>✕</ClearIcon>
        </ClearButton>
      )}
    </Container>
  );
};

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${props => props.theme.surface};
  border-radius: 12px;
  margin: 16px;
  padding: 12px 16px;
  border-width: 1px;
  border-color: ${props => props.theme.border};
`;

const SearchIcon = styled.Text`
  font-size: 20px;
  margin-right: 8px;
`;

const Input = styled.TextInput`
  flex: 1;
  font-size: 16px;
  color: ${props => props.theme.text};
`;

const ClearButton = styled.TouchableOpacity`
  padding: 4px;
`;

const ClearIcon = styled.Text`
  font-size: 18px;
  color: ${props => props.theme.textSecondary};
`;

export default SearchBar;
```

## File 5: FilterBar - `src/screens/Home/components/FilterBar.tsx`

### Instructions

Create filter chips:

```typescript
import React from 'react';
import {ScrollView} from 'react-native';
import styled from 'styled-components/native';
import {useAppDispatch, useAppSelector} from '@/hooks/hooks';
import {setFilter} from '@/redux/notesSlice';
import type {NoteFilter} from '@/types/note';

const FILTERS: Array<{label: string; value: NoteFilter}> = [
  {label: 'All', value: 'all'},
  {label: 'Text', value: 'text'},
  {label: 'Drawing', value: 'drawing'},
  {label: 'Pinned', value: 'pinned'},
];

export const FilterBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const activeFilter = useAppSelector(state => state.notes.filter);
  const notes = useAppSelector(state => state.notes.notes);

  const getFilterCount = (filter: NoteFilter): number => {
    if (filter === 'all') return notes.length;
    if (filter === 'pinned') return notes.filter(n => n.isPinned).length;
    return notes.filter(n => n.type === filter).length;
  };

  return (
    <Container>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{paddingHorizontal: 16, gap: 8}}
      >
        {FILTERS.map(filter => (
          <FilterChip
            key={filter.value}
            onPress={() => dispatch(setFilter(filter.value))}
            $active={activeFilter === filter.value}
            accessibilityRole="button"
            accessibilityLabel={`Filter: ${filter.label}`}
            accessibilityState={{selected: activeFilter === filter.value}}
          >
            <ChipText $active={activeFilter === filter.value}>
              {filter.label} ({getFilterCount(filter.value)})
            </ChipText>
          </FilterChip>
        ))}
      </ScrollView>
    </Container>
  );
};

const Container = styled.View`
  margin-bottom: 8px;
`;

const FilterChip = styled.TouchableOpacity<{$active: boolean}>`
  background-color: ${props => props.$active ? props.theme.background : props.theme.surface};
  border-radius: 20px;
  padding: 8px 16px;
  border-width: 1px;
  border-color: ${props => props.theme.border};
`;

const ChipText = styled.Text<{$active: boolean}>`
  font-size: 14px;
  color: ${props => props.theme.text};
  font-weight: ${props => props.$active ? '600' : '400'};
`;

export default FilterBar;
```

## File 6: EmptyState - `src/screens/Home/components/EmptyState.tsx`

### Instructions

Create empty state component:

```typescript
import React from 'react';
import styled from 'styled-components/native';
import Button from '@/components/Button';
import ButtonText from '@/components/Button/ButtonText';

export interface EmptyStateProps {
  onCreateNote: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({onCreateNote}) => {
  return (
    <Container>
      <Icon>📝</Icon>
      <Title>No Notes Yet</Title>
      <Message>Create your first note to get started</Message>
      <Button onPress={onCreateNote}>
        <ButtonText>Create Note</ButtonText>
      </Button>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 32px;
`;

const Icon = styled.Text`
  font-size: 64px;
  margin-bottom: 16px;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${props => props.theme.text};
  margin-bottom: 8px;
`;

const Message = styled.Text`
  font-size: 16px;
  color: ${props => props.theme.textSecondary};
  text-align: center;
  margin-bottom: 24px;
`;

export default EmptyState;
```

## Verification Checklist

- [ ] Home screen loads notes on mount
- [ ] Search functionality works
- [ ] Filter chips work
- [ ] Note cards display correctly
- [ ] Empty state shows when no notes
- [ ] FAB navigates to editor
- [ ] Pull-to-refresh works
- [ ] All imports use `@/` alias
- [ ] All styled props use `$` prefix
- [ ] Accessibility labels added
- [ ] TypeScript compiles without errors

## Next Step

Proceed to **Part 6: Text Editor Implementation**.
