import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import {useTheme} from 'styled-components/native';
import NoteEditor from '@/screens/NoteEditor/NoteEditor';
import NoteView from '@/screens/NoteView/NoteView';
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
      <Stack.Screen name="NoteEditor" component={NoteEditor} />
      <Stack.Screen name="NoteView" component={NoteView} />
    </Stack.Navigator>
  );
};

export default Navigation;
