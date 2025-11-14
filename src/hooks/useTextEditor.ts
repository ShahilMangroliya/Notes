import {useCallback, useMemo} from 'react';
import {useAppDispatch, useAppSelector} from './hooks';
import {
  setSelectedBlockId,
  setTextFormatting,
  toggleTextFormatting,
  markDirty,
  markSaved,
  resetEditor,
} from '@/redux/editorSlice';
import {updateCurrentNote} from '@/redux/notesSlice';
import {selectCurrentFormatting, selectIsDirty} from '@/redux/selectors';
import {selectCurrentNote} from '@/redux/selectors';
import {generateId} from '@/util/uuid';
import logger from '@/util/DebugLogger';
import type {TextBlock, BlockType, TextFormatting} from '@/types/note';

/**
 * Custom hook for managing text editor state
 */
export const useTextEditor = () => {
  const dispatch = useAppDispatch();

  logger.hook('useTextEditor', 'render');

  const currentNote = useAppSelector(selectCurrentNote);
  const currentFormatting = useAppSelector(selectCurrentFormatting);
  const isDirty = useAppSelector(selectIsDirty);
  const selectedBlockId = useAppSelector(
    state => state.editor.textEditor.selectedBlockId,
  );

  logger.hook('useTextEditor', 'state', {
    hasCurrentNote: !!currentNote,
    noteId: currentNote?.id,
    isDirty,
  });

  // Get text blocks if current note is a text note
  const textBlocks = useMemo(
    () =>
      currentNote?.type === 'text'
        ? (currentNote.content as {blocks: TextBlock[]}).blocks
        : [],
    [currentNote],
  );

  // Get formatting from selected block, or use global formatting
  const selectedBlock = useMemo(
    () => textBlocks.find(b => b.id === selectedBlockId),
    [textBlocks, selectedBlockId],
  );
  const activeFormatting = selectedBlock?.formatting || currentFormatting;

  // Actions
  const handleSelectBlock = useCallback(
    (blockId: string) => {
      logger.hook('useTextEditor', 'handleSelectBlock', {blockId});
      dispatch(setSelectedBlockId(blockId));

      // Sync formatting from selected block to global state
      const block = textBlocks.find(b => b.id === blockId);
      if (block) {
        dispatch(setTextFormatting(block.formatting));
      }
    },
    [dispatch, textBlocks],
  );

  const handleTextChange = useCallback(
    (blockId: string, text: string) => {
      logger.hook('useTextEditor', 'handleTextChange', {
        blockId,
        textLength: text.length,
      });
      if (!currentNote || currentNote.type !== 'text') {
        logger.warn('handleTextChange called without valid text note', {
          hasCurrentNote: !!currentNote,
          noteType: currentNote?.type,
        });
        return;
      }

      const content = currentNote.content as {
        type: 'text';
        blocks: TextBlock[];
        version: number;
      };
      const updatedBlocks = content.blocks.map(block =>
        block.id === blockId ? {...block, text} : block,
      );

      dispatch(
        updateCurrentNote({
          content: {
            type: 'text',
            text: updatedBlocks.map(b => b.text).join('\n'),
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
      logger.hook('useTextEditor', 'handleAddBlock', {afterBlockId});
      if (!currentNote || currentNote.type !== 'text') {
        logger.warn('handleAddBlock called without valid text note', {
          hasCurrentNote: !!currentNote,
          noteType: currentNote?.type,
          currentNoteId: currentNote?.id,
        });
        return;
      }

      if (!('blocks' in currentNote.content)) {
        logger.warn('handleAddBlock called but content has no blocks', {
          noteId: currentNote.id,
          contentType: currentNote.content.type,
        });
        return;
      }

      const content = currentNote.content as {
        type: 'text';
        blocks: TextBlock[];
        version: number;
      };

      if (!Array.isArray(content.blocks)) {
        logger.warn('handleAddBlock called but blocks is not an array', {
          noteId: currentNote.id,
          blocksType: typeof content.blocks,
        });
        return;
      }
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
            text: updatedBlocks.map(b => b.text).join('\n'),
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

      const content = currentNote.content as {
        type: 'text';
        blocks: TextBlock[];
        version: number;
      };
      if (content.blocks.length <= 1) return; // Keep at least one block

      const updatedBlocks = content.blocks.filter(b => b.id !== blockId);

      dispatch(
        updateCurrentNote({
          content: {
            type: 'text',
            text: updatedBlocks.map(b => b.text).join('\n'),
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

      const content = currentNote.content as {
        type: 'text';
        blocks: TextBlock[];
        version: number;
      };
      const updatedBlocks = content.blocks.map(block =>
        block.id === blockId ? {...block, blockType} : block,
      );

      dispatch(
        updateCurrentNote({
          content: {
            type: 'text',
            text: updatedBlocks.map(b => b.text).join('\n'),
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
    (
      key: keyof Pick<
        TextFormatting,
        'bold' | 'italic' | 'underline' | 'strikethrough'
      >,
    ) => {
      logger.hook('useTextEditor', 'handleToggleFormatting', {
        key,
        selectedBlockId,
      });

      if (!currentNote || currentNote.type !== 'text' || !selectedBlockId) {
        logger.warn('handleToggleFormatting called without selected block');
        return;
      }

      // Update global formatting state
      dispatch(toggleTextFormatting(key));

      // Update the selected block's formatting
      const content = currentNote.content as {
        type: 'text';
        blocks: TextBlock[];
        version: number;
      };
      const updatedBlocks = content.blocks.map(block => {
        if (block.id === selectedBlockId) {
          const newFormatting = {
            ...block.formatting,
            [key]: !block.formatting[key],
          };
          return {...block, formatting: newFormatting};
        }
        return block;
      });

      dispatch(
        updateCurrentNote({
          content: {
            type: 'text',
            text: updatedBlocks.map(b => b.text).join('\n'),
            blocks: updatedBlocks,
            version: content.version,
          },
        }),
      );
      dispatch(markDirty());
    },
    [currentNote, selectedBlockId, dispatch],
  );

  const handleChangeFontSize = useCallback(
    (delta: number) => {
      if (!currentNote || currentNote.type !== 'text' || !selectedBlockId) {
        logger.warn('handleChangeFontSize called without selected block');
        return;
      }

      const content = currentNote.content as {
        type: 'text';
        blocks: TextBlock[];
        version: number;
      };
      const targetBlock = content.blocks.find(b => b.id === selectedBlockId);
      if (!targetBlock) return;

      const newSize = Math.max(
        12,
        Math.min(32, targetBlock.formatting.fontSize + delta),
      );
      logger.hook('useTextEditor', 'handleChangeFontSize', {
        delta,
        oldSize: targetBlock.formatting.fontSize,
        newSize,
      });

      // Update global formatting state
      dispatch(
        setTextFormatting({...targetBlock.formatting, fontSize: newSize}),
      );

      // Update the selected block's formatting
      const updatedBlocks = content.blocks.map(block =>
        block.id === selectedBlockId
          ? {...block, formatting: {...block.formatting, fontSize: newSize}}
          : block,
      );

      dispatch(
        updateCurrentNote({
          content: {
            type: 'text',
            text: updatedBlocks.map(b => b.text).join('\n'),
            blocks: updatedBlocks,
            version: content.version,
          },
        }),
      );
      dispatch(markDirty());
    },
    [currentNote, selectedBlockId, dispatch],
  );

  const handleMarkSaved = useCallback(() => {
    logger.hook('useTextEditor', 'handleMarkSaved');
    dispatch(markSaved());
  }, [dispatch]);

  const handleResetEditor = useCallback(() => {
    logger.hook('useTextEditor', 'handleResetEditor');
    dispatch(resetEditor());
  }, [dispatch]);

  return {
    // State
    currentNote,
    textBlocks,
    currentFormatting: activeFormatting, // Return formatting from selected block
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
