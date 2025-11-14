import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
`;

export const Header = styled.View`
  padding: 24px 20px 20px;
  gap: 16px;
  background-color: ${props => props.theme.background};
`;

export const Title = styled.Text`
  font-size: 32px;
  font-weight: 700;
  color: ${props => props.theme.text};
  letter-spacing: -0.5px;
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

// EmptyIcon removed - using Icon component directly

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

// CreateButton removed - using Icon component directly

export const LoadingContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const ErrorContainer = styled.View`
  padding: 16px;
  background-color: ${props => props.theme.errorBackground};
  margin: 20px;
  border-radius: 12px;
`;

export const ErrorText = styled.Text`
  color: ${props => props.theme.error};
  font-size: 14px;
  text-align: center;
`;

export const OptionButton = styled.TouchableOpacity`
  background-color: ${props => props.theme.surface};
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 12px;
  flex-direction: row;
  align-items: center;
  gap: 16px;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.03;
  shadow-radius: 6px;
  elevation: 1;
`;

// OptionIcon removed - using Icon component directly

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
