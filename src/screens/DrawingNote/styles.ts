import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
`;

export const Header = styled.View`
  background-color: ${props => props.theme.background};
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.border};
  padding: 12px 16px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const HeaderLeft = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

export const HeaderRight = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

export const BackButton = styled.Text`
  font-size: 20px;
  color: ${props => props.theme.text};
`;

export const HeaderTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme.text};
`;

export const SaveButton = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.text};
`;

export const SavingIndicator = styled.Text`
  font-size: 13px;
  font-weight: 500;
  color: ${props => props.theme.textSecondary};
  opacity: 0.7;
`;

export const DirtyIndicator = styled.View`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${props => props.theme.warning};
`;

export const TitleInput = styled.TextInput.attrs(props => ({
  placeholderTextColor: props.theme.textSecondary,
}))`
  font-size: 24px;
  font-weight: bold;
  color: ${props => props.theme.text};
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.border};
`;

export const CanvasContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.background};
`;

export const ToolbarContainer = styled.View`
  max-height: 400px;
`;
