import styled from 'styled-components/native';
import {KeyboardAvoidingView} from 'react-native';

export const KeyboardContainer = styled(KeyboardAvoidingView)`
  flex: 1;
`;

export const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.background};
`;

export const Header = styled.View`
  background-color: ${props => props.theme.background};
  padding: 12px 16px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom-width: 0.5px;
  border-bottom-color: ${props => props.theme.border};
`;

export const HeaderLeft = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
  flex: 1;
`;

export const HeaderRight = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;

export const BackButton = styled.Text`
  font-size: 20px;
  color: ${props => props.theme.text};
`;

export const HeaderTitle = styled.Text`
  font-size: 17px;
  font-weight: 600;
  color: ${props => props.theme.text};
`;

export const SaveButton = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.primary};
`;

export const DirtyIndicator = styled.View`
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background-color: ${props => props.theme.warning};
  margin-left: 4px;
`;

export const TitleInput = styled.TextInput.attrs(props => ({
  placeholderTextColor: props.theme.textSecondary,
}))`
  font-size: 24px;
  font-weight: 600;
  color: ${props => props.theme.text};
  padding: 16px 20px 12px;
  letter-spacing: -0.2px;
  background-color: ${props => props.theme.background};
`;

export const ToolbarContainer = styled.View`
  background-color: ${props => props.theme.background};
  border-bottom-width: 0.5px;
  border-bottom-color: ${props => props.theme.border};
`;

export const EditorContainer = styled.View`
  flex: 1;
  background-color: ${props => props.theme.background};
  padding-bottom: 70px;
`;

export const BlocksContainer = styled.View`
  padding: 8px 0 120px;
`;

export const AddBlockButton = styled.TouchableOpacity<{$disabled?: boolean}>`
  padding: 12px 20px;
  align-items: center;
  background-color: ${props => props.theme.background};
  opacity: ${props => (props.$disabled ? 0.4 : 1)};
  margin: 4px 20px;
  border-radius: 8px;
`;

export const AddBlockText = styled.Text`
  color: ${props => props.theme.textSecondary};
  font-size: 14px;
  font-weight: 500;
`;
