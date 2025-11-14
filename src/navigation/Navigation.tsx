import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import {useTheme} from 'styled-components/native';
import CreateNote from '@/screens/CreateNote/CreateNote';
import Home from '@/screens/Home/Home';
import useThemeStore from '@/hooks/useThemeStore';
import type {RootStackParamList} from '@/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigation = () => {
  const {isDarkMode} = useThemeStore();
  const theme = useTheme();

  useEffect(() => {
    StatusBar.setBarStyle(isDarkMode ? 'light-content' : 'dark-content', true);
  }, [isDarkMode]);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: theme.background,
        },
      }}
      initialRouteName="Home"
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="NoteEditor" component={CreateNote} />
    </Stack.Navigator>
  );
};

export default Navigation;
