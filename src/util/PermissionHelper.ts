import {PermissionsAndroid, Platform, Alert, Linking} from 'react-native';

/**
 * Requests microphone permission
 * @returns Promise<boolean> - true if granted
 */
export const requestMicrophonePermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Microphone Permission',
          message: 'Notes app needs access to your microphone for voice input',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (error) {
      console.error('Error requesting microphone permission:', error);
      return false;
    }
  }
  // iOS permissions are handled via Info.plist
  return true;
};

/**
 * Checks if microphone permission is granted
 * @returns Promise<boolean> - true if granted
 */
export const checkMicrophonePermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      );
      return granted;
    } catch (error) {
      console.error('Error checking microphone permission:', error);
      return false;
    }
  }
  return true;
};

/**
 * Shows permission denied alert with option to open settings
 */
export const showPermissionDeniedAlert = (): void => {
  Alert.alert(
    'Permission Required',
    'Microphone permission is required for voice input. Please enable it in Settings.',
    [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Open Settings', onPress: () => Linking.openSettings()},
    ],
  );
};

export default {
  requestMicrophonePermission,
  checkMicrophonePermission,
  showPermissionDeniedAlert,
};
