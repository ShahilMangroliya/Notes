import React from 'react';
import styled from 'styled-components/native';
import {useTheme} from 'styled-components/native';
import Icon from '@/components/Icon';
import type {AntDesignIconName} from '@/components/Icon';
import type {ThemeMode} from '@/redux/themeSlice';

/**
 * Props for ThemeSelector component
 */
export interface ThemeSelectorProps {
  /** Current theme mode */
  currentTheme: ThemeMode;
  /** Theme change handler */
  onThemeChange: (theme: ThemeMode) => void;
}

const Container = styled.View`
  flex-direction: row;
  background-color: ${props => props.theme.surface};
  border-radius: 8px;
  padding: 3px;
  gap: 3px;
`;

const ThemeButton = styled.TouchableOpacity<{$isSelected: boolean}>`
  width: 36px;
  height: 36px;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background-color: ${props =>
    props.$isSelected ? props.theme.primary : 'transparent'};
`;

/**
 * ThemeSelector component - Shows all three theme modes side by side
 *
 * @example
 * ```tsx
 * <ThemeSelector
 *   currentTheme={currentTheme}
 *   onThemeChange={setTheme}
 * />
 * ```
 */
export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentTheme,
  onThemeChange,
}) => {
  const theme = useTheme();

  const themes: Array<{
    mode: ThemeMode;
    icon: AntDesignIconName;
    label: string;
  }> = [
    {mode: 'light', icon: 'sun' as AntDesignIconName, label: 'Light'},
    {mode: 'dark', icon: 'moon' as AntDesignIconName, label: 'Dark'},
    {mode: 'system', icon: 'bulb' as AntDesignIconName, label: 'System'},
  ];

  return (
    <Container>
      {themes.map(({mode, icon, label}) => {
        const isSelected = currentTheme === mode;
        return (
          <ThemeButton
            key={mode}
            $isSelected={isSelected}
            onPress={() => onThemeChange(mode)}
            accessibilityRole="button"
            accessibilityLabel={`Switch to ${label.toLowerCase()} theme`}
            accessibilityState={{selected: isSelected}}
          >
            <Icon
              name={icon}
              size={18}
              color={isSelected ? '#FFFFFF' : theme.textSecondary}
            />
          </ThemeButton>
        );
      })}
    </Container>
  );
};

export default ThemeSelector;
