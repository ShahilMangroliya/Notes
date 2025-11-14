import React from 'react';
import {Modal as RNModal} from 'react-native';
import styled from 'styled-components/native';

/**
 * Props for Modal component
 */
export interface ModalProps {
  /** Modal visibility */
  visible: boolean;
  /** Close handler */
  onClose: () => void;
  /** Modal content */
  children: React.ReactNode;
  /** Animation type */
  animationType?: 'none' | 'slide' | 'fade';
  /** Modal title */
  title?: string;
  /** Show close button */
  showCloseButton?: boolean;
  /** Disable backdrop press to close */
  disableBackdropClose?: boolean;
}

const Overlay = styled.Pressable`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  padding: 24px;
`;

const ModalContent = styled.View`
  background-color: ${props => props.theme.surface};
  border-radius: 16px;
  width: 100%;
  max-width: 400px;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 8px;
  elevation: 10;
`;

const ModalHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.border};
`;

const ModalTitle = styled.Text`
  color: ${props => props.theme.text};
  font-size: 18px;
  font-weight: 600;
  flex: 1;
`;

const CloseButton = styled.TouchableOpacity`
  padding: 4px;
  margin-left: 12px;
`;

const CloseButtonText = styled.Text`
  color: ${props => props.theme.textSecondary};
  font-size: 24px;
  line-height: 24px;
`;

const ModalBody = styled.View`
  padding: 20px;
`;

/**
 * Modal component for displaying overlay dialogs
 *
 * @example
 * ```tsx
 * <Modal
 *   visible={isModalVisible}
 *   onClose={handleClose}
 *   title="Settings"
 * >
 *   <Text>Modal content goes here</Text>
 * </Modal>
 *
 * <Modal
 *   visible={showDialog}
 *   onClose={handleClose}
 *   animationType="slide"
 *   disableBackdropClose
 * >
 *   <CustomContent />
 * </Modal>
 * ```
 */
export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  children,
  animationType = 'fade',
  title,
  showCloseButton = true,
  disableBackdropClose = false,
}) => {
  const handleBackdropPress = () => {
    if (!disableBackdropClose) {
      onClose();
    }
  };

  return (
    <RNModal
      visible={visible}
      transparent
      animationType={animationType}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Overlay onPress={handleBackdropPress}>
        <ModalContent
          onStartShouldSetResponder={() => true}
          accessibilityViewIsModal
        >
          {(title || showCloseButton) && (
            <ModalHeader>
              {title && <ModalTitle>{title}</ModalTitle>}
              {showCloseButton && (
                <CloseButton
                  onPress={onClose}
                  accessibilityRole="button"
                  accessibilityLabel="Close modal"
                >
                  <CloseButtonText>×</CloseButtonText>
                </CloseButton>
              )}
            </ModalHeader>
          )}
          <ModalBody>{children}</ModalBody>
        </ModalContent>
      </Overlay>
    </RNModal>
  );
};

export default Modal;
