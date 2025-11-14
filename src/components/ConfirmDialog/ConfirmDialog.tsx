import React from 'react';
import styled from 'styled-components/native';
import Modal from '@/components/Modal';
import {Button} from '@/components/Button';

/**
 * Props for ConfirmDialog component
 */
export interface ConfirmDialogProps {
  /** Dialog visibility */
  visible: boolean;
  /** Dialog title */
  title: string;
  /** Dialog message */
  message: string;
  /** Confirm button text */
  confirmText?: string;
  /** Cancel button text */
  cancelText?: string;
  /** Confirm button variant */
  confirmVariant?: 'primary' | 'secondary' | 'outline';
  /** Confirm handler */
  onConfirm: () => void;
  /** Cancel handler */
  onCancel: () => void;
  /** Destructive action (shows red styling) */
  $destructive?: boolean;
}

const DialogMessage = styled.Text`
  color: ${props => props.theme.text};
  font-size: 16px;
  line-height: 24px;
  margin-bottom: 24px;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  gap: 12px;
`;

const StyledButton = styled(Button)<{$destructive?: boolean}>`
  flex: 1;
  ${props =>
    props.$destructive &&
    `
    background-color: #FF3B30;
  `}
`;

const ButtonText = styled.Text<{$variant?: string}>`
  color: ${props =>
    props.$variant === 'outline' ? props.theme.text : props.theme.surface};
  font-size: 16px;
  font-weight: 600;
`;

/**
 * ConfirmDialog component for confirmation prompts
 *
 * @example
 * ```tsx
 * <ConfirmDialog
 *   visible={showDeleteDialog}
 *   title="Delete Note"
 *   message="Are you sure you want to delete this note? This action cannot be undone."
 *   confirmText="Delete"
 *   cancelText="Cancel"
 *   onConfirm={handleDelete}
 *   onCancel={handleCancel}
 *   $destructive
 * />
 *
 * <ConfirmDialog
 *   visible={showSaveDialog}
 *   title="Save Changes"
 *   message="You have unsaved changes. Do you want to save them?"
 *   confirmText="Save"
 *   cancelText="Discard"
 *   onConfirm={handleSave}
 *   onCancel={handleDiscard}
 * />
 * ```
 */
export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  visible,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'primary',
  onConfirm,
  onCancel,
  $destructive = false,
}) => {
  return (
    <Modal
      visible={visible}
      onClose={onCancel}
      title={title}
      showCloseButton={false}
      disableBackdropClose
    >
      <DialogMessage>{message}</DialogMessage>
      <ButtonContainer>
        <StyledButton
          $variant="outline"
          onPress={onCancel}
          accessibilityLabel={cancelText}
        >
          <ButtonText $variant="outline">{cancelText}</ButtonText>
        </StyledButton>
        <StyledButton
          $variant={confirmVariant}
          $destructive={$destructive}
          onPress={onConfirm}
          accessibilityLabel={confirmText}
        >
          <ButtonText>{confirmText}</ButtonText>
        </StyledButton>
      </ButtonContainer>
    </Modal>
  );
};

export default ConfirmDialog;
