import React, {useState, useCallback} from 'react';
import {FlatList, View} from 'react-native';
import {useTheme} from 'styled-components/native';
import SafeAreaContainer from '@/components/SafeAreaContainer';
import SearchBar from '@/components/SearchBar';
import FilterBar from '@/components/FilterBar';
import NoteCard from '@/components/NoteCard';
import FAB from '@/components/FAB';
import Modal from '@/components/Modal';
import Icon from '@/components/Icon';
import StyledText from '@/components/Text';
import useNotes from '@/hooks/useNotes';
import type {HomeScreenProps} from '@/types/navigation';
import type {Note} from '@/types/note';
import * as S from './styles';

/**
 * Home screen displaying list of notes
 */
const Home: React.FC<HomeScreenProps> = ({navigation}) => {
  const theme = useTheme();
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
        <S.LoadingContainer>
          <StyledText>Loading notes...</StyledText>
        </S.LoadingContainer>
      );
    }

    const hasNoNotes = counts.all === 0;
    const hasSearchQuery = searchQuery.length > 0;
    const hasFilter = filter !== 'all';

    if (hasNoNotes) {
      return (
        <S.EmptyContainer>
          <View>
            <Icon name="file-text" size={64} color={theme.textSecondary} />
          </View>
          <S.EmptyTitle>No notes yet</S.EmptyTitle>
          <S.EmptySubtitle>
            Tap the + button to create your first note
          </S.EmptySubtitle>
        </S.EmptyContainer>
      );
    }

    if (hasSearchQuery || hasFilter) {
      return (
        <S.EmptyContainer>
          <View>
            <Icon name="search" size={64} color={theme.textSecondary} />
          </View>
          <S.EmptyTitle>No notes found</S.EmptyTitle>
          <S.EmptySubtitle>Try adjusting your search or filter</S.EmptySubtitle>
        </S.EmptyContainer>
      );
    }

    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, counts, searchQuery, filter]);

  return (
    <SafeAreaContainer>
      <S.Container>
        <S.Header>
          <S.Title>Notes</S.Title>
          <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
          <FilterBar
            activeFilter={filter}
            onFilterChange={setFilter}
            counts={counts}
          />
        </S.Header>

        {error && (
          <S.ErrorContainer>
            <S.ErrorText>{error}</S.ErrorText>
          </S.ErrorContainer>
        )}

        <S.ListContainer>
          <FlatList
            data={notes}
            renderItem={renderNoteCard}
            keyExtractor={item => item.id}
            contentContainerStyle={{
              padding: 16,
              flexGrow: 1,
              backgroundColor: theme.background,
            }}
            ListEmptyComponent={renderEmptyState}
            showsVerticalScrollIndicator={false}
            style={{backgroundColor: theme.background}}
          />
        </S.ListContainer>

        <FAB
          onPress={() => setShowCreateMenu(true)}
          accessibilityLabel="Create new note"
        >
          <Icon name="plus" size={40} color={theme.text} />
        </FAB>

        <Modal
          visible={showCreateMenu}
          onClose={() => setShowCreateMenu(false)}
          title="Create New Note"
        >
          <S.OptionButton
            onPress={() => handleCreateNote('text')}
            accessibilityLabel="Create text note"
          >
            <View>
              <Icon name="file-text" size={32} color={theme.text} />
            </View>
            <S.OptionContent>
              <S.OptionTitle>Text Note</S.OptionTitle>
              <S.OptionDescription>
                Create a note with formatted text
              </S.OptionDescription>
            </S.OptionContent>
          </S.OptionButton>

          <S.OptionButton
            onPress={() => handleCreateNote('drawing')}
            accessibilityLabel="Create drawing note"
          >
            <View>
              <Icon name="picture" size={32} color={theme.text} />
            </View>
            <S.OptionContent>
              <S.OptionTitle>Drawing</S.OptionTitle>
              <S.OptionDescription>
                Create a note with freehand drawing
              </S.OptionDescription>
            </S.OptionContent>
          </S.OptionButton>
        </Modal>
      </S.Container>
    </SafeAreaContainer>
  );
};

export default Home;
