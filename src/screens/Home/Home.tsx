import React, {useState, useCallback} from 'react';
import {FlatList, View} from 'react-native';
import styled from 'styled-components/native';
import SafeAreaContainer from '@/components/SafeAreaContainer';
import SearchBar from '@/components/SearchBar';
import FilterBar from '@/components/FilterBar';
import NoteCard from '@/components/NoteCard';
import FAB from '@/components/FAB';
import StyledText from '@/components/Text';
import useNotes from '@/hooks/useNotes';
import type {HomeScreenProps} from '@/types/navigation';
import type {Note} from '@/types/note';

const Container = styled.View`
  flex: 1;
`;

const Header = styled.View`
  padding: 16px;
  gap: 12px;
  background-color: ${props => props.theme.background};
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.border};
`;

const Title = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: ${props => props.theme.text};
  margin-bottom: 8px;
`;

const ListContainer = styled.View`
  flex: 1;
  background-color: ${props => props.theme.background};
`;

const EmptyContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 40px;
`;

const EmptyIcon = styled.Text`
  font-size: 64px;
  margin-bottom: 16px;
`;

const EmptyTitle = styled.Text`
  font-size: 20px;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin-bottom: 8px;
  text-align: center;
`;

const EmptySubtitle = styled.Text`
  font-size: 16px;
  color: ${props => props.theme.textSecondary};
  text-align: center;
`;

const CreateButton = styled.Text`
  font-size: 40px;
  color: ${props => props.theme.text};
`;

const LoadingContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const ErrorContainer = styled.View`
  padding: 16px;
  background-color: #ff3b3033;
  margin: 16px;
  border-radius: 8px;
`;

const ErrorText = styled.Text`
  color: #ff3b30;
  font-size: 14px;
  text-align: center;
`;

/**
 * Home screen displaying list of notes
 */
const Home: React.FC<HomeScreenProps> = ({navigation}) => {
  const {
    notes,
    filter,
    searchQuery,
    isLoading,
    error,
    counts,
    setFilter,
    setSearchQuery,
  } = useNotes();

  const [showCreateMenu, setShowCreateMenu] = useState(false);

  const handleNotePress = useCallback(
    (noteId: string) => {
      navigation.navigate('NoteView', {noteId});
    },
    [navigation],
  );

  const handleCreateNote = useCallback(
    (noteType: 'text' | 'drawing') => {
      setShowCreateMenu(false);
      navigation.navigate('NoteEditor', {noteType});
    },
    [navigation],
  );

  const renderNoteCard = useCallback(
    ({item}: {item: Note}) => (
      <NoteCard note={item} onPress={handleNotePress} />
    ),
    [handleNotePress],
  );

  const renderEmptyState = useCallback(() => {
    if (isLoading) {
      return (
        <LoadingContainer>
          <StyledText>Loading notes...</StyledText>
        </LoadingContainer>
      );
    }

    const hasNoNotes = counts.all === 0;
    const hasSearchQuery = searchQuery.length > 0;
    const hasFilter = filter !== 'all';

    if (hasNoNotes) {
      return (
        <EmptyContainer>
          <EmptyIcon>📝</EmptyIcon>
          <EmptyTitle>No notes yet</EmptyTitle>
          <EmptySubtitle>
            Tap the + button to create your first note
          </EmptySubtitle>
        </EmptyContainer>
      );
    }

    if (hasSearchQuery || hasFilter) {
      return (
        <EmptyContainer>
          <EmptyIcon>🔍</EmptyIcon>
          <EmptyTitle>No notes found</EmptyTitle>
          <EmptySubtitle>
            Try adjusting your search or filter
          </EmptySubtitle>
        </EmptyContainer>
      );
    }

    return null;
  }, [isLoading, counts, searchQuery, filter]);

  return (
    <SafeAreaContainer>
      <Container>
        <Header>
          <Title>Notes</Title>
          <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
          <FilterBar
            activeFilter={filter}
            onFilterChange={setFilter}
            counts={counts}
          />
        </Header>

        {error && (
          <ErrorContainer>
            <ErrorText>{error}</ErrorText>
          </ErrorContainer>
        )}

        <ListContainer>
          <FlatList
            data={notes}
            renderItem={renderNoteCard}
            keyExtractor={item => item.id}
            contentContainerStyle={{
              padding: 16,
              flexGrow: 1,
            }}
            ListEmptyComponent={renderEmptyState}
            showsVerticalScrollIndicator={false}
          />
        </ListContainer>

        <FAB
          onPress={() => handleCreateNote('text')}
          accessibilityLabel="Create new note"
        >
          <CreateButton>+</CreateButton>
        </FAB>
      </Container>
    </SafeAreaContainer>
  );
};

export default Home;
