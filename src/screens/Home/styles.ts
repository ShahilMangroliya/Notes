import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
`;

export const Header = styled.View`
  padding: 16px;
  gap: 12px;
  background-color: ${props => props.theme.background};
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.border};
`;

export const Title = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: ${props => props.theme.text};
  margin-bottom: 8px;
`;

export const ListContainer = styled.View`
  flex: 1;
  background-color: ${props => props.theme.background};
`;

export const EmptyContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 40px;
`;

export const EmptyIcon = styled.Text`
  font-size: 64px;
  margin-bottom: 16px;
`;

export const EmptyTitle = styled.Text`
  font-size: 20px;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin-bottom: 8px;
  text-align: center;
`;

export const EmptySubtitle = styled.Text`
  font-size: 16px;
  color: ${props => props.theme.textSecondary};
  text-align: center;
`;

export const CreateButton = styled.Text`
  font-size: 40px;
  color: ${props => props.theme.text};
`;

export const LoadingContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const ErrorContainer = styled.View`
  padding: 16px;
  background-color: #ff3b3033;
  margin: 16px;
  border-radius: 8px;
`;

export const ErrorText = styled.Text`
  color: #ff3b30;
  font-size: 14px;
  text-align: center;
`;

export const OptionButton = styled.TouchableOpacity`
  background-color: ${props => props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 12px;
  flex-direction: row;
  align-items: center;
  gap: 16px;
`;

export const OptionIcon = styled.Text`
  font-size: 32px;
`;

export const OptionContent = styled.View`
  flex: 1;
`;

export const OptionTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin-bottom: 4px;
`;

export const OptionDescription = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.textSecondary};
`;
