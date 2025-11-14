import {useCallback, useEffect} from 'react';
import {useAppDispatch, useAppSelector} from './hooks';
import {
  setSelectedBlockId,
  setTextFormatting,
  toggleTextFormatting,
  resetTextFormatting,
  markDirty,
  markSaved,
  resetEditor,
} from '@/redux/editorSlice';
import {setCurrentNote, updateCurrentNote} from '@/redux/notesSlice';
import {selectCurrentFormatting, selectIsDirty} from '@/redux/selectors';
import {selectCurrentNote} from '@/redux/selectors';
import {generateId} from '@/util/uuid';
import type {TextBlock, BlockType, TextFormatting} from '@/types/note';

/**
 * Custom hook for managing text editor state
 */
export const useTextEditor = () => {
  const dispatch = useAppDispatch();

  const currentNote = useAppSelector(selectCurrentNote);
  const currentFormatting = useAppSelector(selectCurrentFormatting);
  const isDirty = useAppSelector(selectIsDirty);

  // Get text blocks if current note is a text note
  const textBlocks =
    currentNote?.type === 'text'
      ? (currentNote.content as {blocks: TextBlock[]}).blocks
      : [];

  // Actions
  const handleSelectBlock = useCallback(
    (blockId: string) => {
      dispatch(setSelectedBlockId(blockId));
    },
    [dispatch],
  );

  const handleTextChange = useCallback(
    (blockId: string, text: string) => {
      if (!currentNote || currentNote.type !== 'text') return;

      const content = currentNote.content as {type: 'text'; blocks: TextBlock[]; version: number};
      const updatedBlocks = content.blocks.map(block =>
        block.id === blockId ? {...block, text} : block,
      );

      dispatch(
        updateCurrentNote({
          content: {
            type: 'text',
            blocks: updatedBlocks,
            version: content.version,
          },
        }),
      );
      dispatch(markDirty());
    },
    [currentNote, dispatch],
  );

  const handleAddBlock = useCallback(
    (afterBlockId?: string) => {
      if (!currentNote || currentNote.type !== 'text') return;

      const content = currentNote.content as {type: 'text'; blocks: TextBlock[]; version: number};
      const newBlock: TextBlock = {
        id: generateId(),
        text: '',
        formatting: currentFormatting,
        blockType: 'paragraph',
      };

      let updatedBlocks: TextBlock[];
      if (afterBlockId) {
        const index = content.blocks.findIndex(b => b.id === afterBlockId);
        updatedBlocks = [
          ...content.blocks.slice(0, index + 1),
          newBlock,
          ...content.blocks.slice(index + 1),
        ];
      } else {
        updatedBlocks = [...content.blocks, newBlock];
      }

      dispatch(
        updateCurrentNote({
          content: {
            type: 'text',
            blocks: updatedBlocks,
            version: content.version,
          },
        }),
      );
      dispatch(setSelectedBlockId(newBlock.id));
      dispatch(markDirty());
    },
    [currentNote, currentFormatting, dispatch],
  );

  const handleRemoveBlock = useCallback(
    (blockId: string) => {
      if (!currentNote || currentNote.type !== 'text') return;

      const content = currentNote.content as {type: 'text'; blocks: TextBlock[]; version: number};
      if (content.blocks.length <= 1) return; // Keep at least one block

      const updatedBlocks = content.blocks.filter(b => b.id !== blockId);

      dispatch(
        updateCurrentNote({
          content: {
            type: 'text',
            blocks: updatedBlocks,
            version: content.version,
          },
        }),
      );
      dispatch(markDirty());
    },
    [currentNote, dispatch],
  );

  const handleChangeBlockType = useCallback(
    (blockId: string, blockType: BlockType) => {
      if (!currentNote || currentNote.type !== 'text') return;

      const content = currentNote.content as {type: 'text'; blocks: TextBlock[]; version: number};
      const updatedBlocks = content.blocks.map(block =>
        block.id === blockId ? {...block, blockType} : block,
      );

      dispatch(
        updateCurrentNote({
          content: {
            type: 'text',
            blocks: updatedBlocks,
            version: content.version,
          },
        }),
      );
      dispatch(markDirty());
    },
    [currentNote, dispatch],
  );

  const handleToggleFormatting = useCallback(
    (key: keyof Pick<TextFormatting, 'bold' | 'italic' | 'underline' | 'strikethrough'>) => {
      dispatch(toggleTextFormatting(key));
    },
    [dispatch],
  );

  const handleChangeFontSize = useCallback(
    (delta: number) => {
      const newSize = Math.max(12, Math.min(32, currentFormatting.fontSize + delta));
      dispatch(setTextFormatting({...currentFormatting, fontSize: newSize}));
    },
    [currentFormatting, dispatch],
  );

  const handleMarkSaved = useCallback(() => {
    dispatch(markSaved());
  }, [dispatch]);

  const handleResetEditor = useCallback(() => {
    dispatch(resetEditor());
  }, [dispatch]);

  return {
    // State
    currentNote,
    textBlocks,
    currentFormatting,
    isDirty,

    // Actions
    selectBlock: handleSelectBlock,
    updateText: handleTextChange,
    addBlock: handleAddBlock,
    removeBlock: handleRemoveBlock,
    changeBlockType: handleChangeBlockType,
    toggleFormatting: handleToggleFormatting,
    changeFontSize: handleChangeFontSize,
    markSaved: handleMarkSaved,
    resetEditor: handleResetEditor,
  };
};

export default useTextEditor;
