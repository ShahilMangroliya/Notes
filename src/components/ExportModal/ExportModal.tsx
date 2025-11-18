import React, {useCallback} from 'react';
import {Alert, ActivityIndicator} from 'react-native';
import styled from 'styled-components/native';
import Modal from '@/components/Modal';
import Icon from '@/components/Icon';
import StyledText from '@/components/Text';
import {useAppDispatch, useAppSelector} from '@/hooks/hooks';
import {exportAndShareThunk} from '@/redux/exportSlice';
import type {Note, ExportFormat} from '@/types/note';

/**
 * Props for ExportModal component
 */
export interface ExportModalProps {
  /** Modal visibility */
  visible: boolean;
  /** Note to export */
  note: Note;
  /** Close handler */
  onClose: () => void;
}

const ModalContent = styled.View`
  padding: 20px;
`;

const ExportOption = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 16px;
  margin-bottom: 12px;
  background-color: ${props => props.theme.surface};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.border};
`;

const OptionIcon = styled.View`
  margin-right: 16px;
`;

const OptionText = styled(StyledText)<{$disabled?: boolean}>`
  font-size: 16px;
  flex: 1;
  opacity: ${props => (props.$disabled ? 0.5 : 1)};
`;

const LoadingContainer = styled.View`
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const LoadingText = styled(StyledText).attrs({
  $secondary: true,
})`
  margin-top: 12px;
`;

/**
 * ExportModal component for selecting export format
 *
 * @example
 * ```tsx
 * <ExportModal
 *   visible={showExportModal}
 *   note={currentNote}
 *   onClose={() => setShowExportModal(false)}
 * />
 * ```
 */
export const ExportModal: React.FC<ExportModalProps> = ({
  visible,
  note,
  onClose,
}) => {
  const dispatch = useAppDispatch();
  const {isExporting, error} = useAppSelector(state => state.export);

  const handleExport = useCallback(
    async (format: ExportFormat) => {
      try {
        // For drawing notes, image and PDF exports need special handling
        // which is done in the DrawingNote component
        if (
          note.type === 'drawing' &&
          (format === 'image' || format === 'pdf')
        ) {
          Alert.alert(
            'Info',
            'Image and PDF export for drawings is handled by the drawing editor. Please use the export button in the drawing screen.',
          );
          onClose();
          return;
        }

        await dispatch(exportAndShareThunk({note, format})).unwrap();
        onClose();
      } catch (err) {
        Alert.alert(
          'Export Failed',
          error || (err as Error).message || 'Failed to export note',
        );
      }
    },
    [note, dispatch, onClose, error],
  );

  const exportOptions: Array<{
    format: ExportFormat;
    icon: string;
    label: string;
    disabled?: boolean;
  }> = [
    {
      format: 'pdf',
      icon: 'file-text',
      label: 'Export as PDF',
    },
    {
      format: 'text',
      icon: 'file-text',
      label: 'Export as Text',
      disabled: note.type !== 'text',
    },
    {
      format: 'markdown',
      icon: 'file-text',
      label: 'Export as Markdown',
      disabled: note.type !== 'text',
    },
    {
      format: 'image',
      icon: 'picture',
      label: 'Export as Image',
      disabled: note.type !== 'drawing',
    },
    {
      format: 'json',
      icon: 'code',
      label: 'Export as JSON',
    },
  ];

  return (
    <Modal visible={visible} onClose={onClose} title="Export Note">
      <ModalContent>
        {isExporting ? (
          <LoadingContainer>
            <ActivityIndicator size="large" color="#007AFF" />
            <LoadingText>Exporting...</LoadingText>
          </LoadingContainer>
        ) : (
          <>
            {exportOptions.map(option => (
              <ExportOption
                key={option.format}
                onPress={() => !option.disabled && handleExport(option.format)}
                disabled={option.disabled || isExporting}
                accessibilityRole="button"
                accessibilityLabel={`Export as ${option.label}`}
                accessibilityState={{disabled: option.disabled || isExporting}}
              >
                <OptionIcon>
                  <Icon
                    name={option.icon as any}
                    size={24}
                    color={option.disabled ? '#999' : '#007AFF'}
                  />
                </OptionIcon>
                <OptionText $disabled={option.disabled}>
                  {option.label}
                </OptionText>
              </ExportOption>
            ))}
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ExportModal;
