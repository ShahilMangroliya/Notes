import {PermissionsAndroid, Platform, Alert, Linking} from 'react-native';
import Voice from '@react-native-voice/voice';

/**
 * Checks audio permissions (comprehensive check for both platforms)
 * @returns Promise<void> - resolves if granted, rejects if blocked
 */
export const checkAudioPermission = async (): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    try {
      if (Platform.OS === 'android') {
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message:
              'Notes app needs access to your microphone for voice input',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (result === PermissionsAndroid.RESULTS.GRANTED) {
          resolve();
        } else {
          reject('blocked');
        }
      } else {
        // iOS: Check if Voice is available first
        const isAvailable = await Voice.isAvailable();
        if (!isAvailable) {
          reject('Voice recognition not available');
          return;
        }

        // For iOS, permissions are handled via Info.plist
        // The system will prompt automatically when Voice.start() is called
        // We just need to check availability
        resolve();
      }
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Requests microphone permission (legacy method for backward compatibility)
 * @returns Promise<boolean> - true if granted
 */
export const requestMicrophonePermission = async (): Promise<boolean> => {
  try {
    await checkAudioPermission();
    return true;
  } catch {
    return false;
  }
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
  checkAudioPermission,
  requestMicrophonePermission,
  checkMicrophonePermission,
  showPermissionDeniedAlert,
};
