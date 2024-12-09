import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  Switch,
  Pressable,
  Platform,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useProfile } from '../contexts/ProfileContext';
import { ThemeContext } from '../contexts/ThemeContext';
import * as Yup from 'yup';

const nameValidationSchema = Yup.string()
  .required('Name is required.')
  .matches(/^[a-zA-Z\s'-]+$/, 'Invalid Characters in name')
  .max(50, 'Name must be less than 50 characters.');

const showAlert = (title, message) => {
  if (Platform.OS === 'web') {
    window.alert(`${title ? title + ': ' : ''}${message}`);
  } else {
    Alert.alert(title, message);
  }
};

export default function SettingsScreen({ navigation }) {
  const { profile, setProfile } = useProfile();
  const { theme, isDarkMode, toggleTheme } = useContext(ThemeContext);
  const [name, setName] = useState(profile.name || '');
  const [profilePicture, setProfilePicture] = useState(profile.profilePicture);

  const styles = createStyles(theme);

  const handleSaveChanges = async () => {
    try {
      // Validate name
      await nameValidationSchema.validate(name);

      // Save name if changed
      if (name.trim() !== profile.name) {
        const updatedName = name.trim() === '' ? null : name.trim();
        setProfile({ ...profile, name: updatedName });
        await AsyncStorage.setItem('profileName', updatedName || '');
      }

      // Save profile picture if changed
      if (profilePicture !== profile.profilePicture) {
        setProfile({ ...profile, profilePicture });
        await AsyncStorage.setItem('profilePicture', profilePicture || '');
      }

      navigation.goBack(); // Navigate back
    } catch (error) {
      if (error.name === 'ValidationError') {
        showAlert('Validation Error', error.errors[0]);
      } else {
        showAlert('Error', 'Failed to save settings.');
      }
    }
  };

  const handleProfilePictureChange = async () => {
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.Image,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      const { uri } = pickerResult.assets[0];
      setProfilePicture(uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text
        style={styles.title}
        accessible={true}
        accessibilityRole='header'
        accessibilityLabel='Settings Screen'
      >
        Settings
      </Text>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image
          source={{
            uri: profilePicture
              ? profilePicture
              : 'https://via.placeholder.com/100',
          }}
          style={styles.profileImage}
          accessible={true}
          accessibilityRole='image'
          accessibilityLabel={
            profilePicture
              ? 'Your current profile picture'
              : 'Default profile picture'
          }
        />
        <Pressable
          style={styles.pictureButton}
          onPress={handleProfilePictureChange}
          accessible={true}
          accessibilityRole='button'
          accessibilityLabel='Change Profile Picture'
          accessibilityHint='Opens the image library to select a new profile picture'
        >
          <Text style={styles.buttonText}>Change Picture</Text>
        </Pressable>
      </View>

      {/* Name Section */}
      <View style={styles.nameSection}>
        <Text
          style={styles.label}
          accessible={true}
          accessibilityRole='text'
          accessibilityLabel='Your Name'
        >
          Your Name
        </Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder='Enter your name'
          placeholderTextColor={theme.SECONDARY_COLOR}
          accessible={true}
          accessibilityLabel='Name Input'
          accessibilityHint='Enter your name here'
        />
      </View>

      {/* Dark Mode Section */}
      <View style={styles.toggleContainer}>
        <Text
          style={styles.label}
          accessible={true}
          accessibilityRole='text'
          accessibilityLabel='Dark Mode Toggle'
        >
          Dark Mode
        </Text>
        <Switch
          value={isDarkMode}
          onValueChange={toggleTheme}
          thumbColor={theme.PRIMARY_COLOR}
          trackColor={{
            false: theme.SECONDARY_COLOR,
            true: theme.PRIMARY_COLOR,
          }}
          accessible={true}
          accessibilityRole='switch'
          accessibilityLabel='Dark Mode'
          accessibilityHint='Toggle between light and dark themes'
        />
      </View>

      {/* Save Changes Button */}
      <Pressable
        style={styles.saveButton}
        onPress={handleSaveChanges}
        accessible={true}
        accessibilityRole='button'
        accessibilityLabel='Save Changes'
        accessibilityHint='Saves your changes and navigates back to the previous screen'
      >
        <Text style={styles.buttonText}>Save Changes</Text>
      </Pressable>
    </View>
  );
}

function createStyles(theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: theme.BACKGROUND_COLOR,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 20,
      color: theme.TEXT_COLOR,
    },
    profileSection: {
      alignItems: 'center',
      marginBottom: 30,
    },
    profileImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: theme.SECONDARY_COLOR,
    },
    pictureButton: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
      backgroundColor: theme.PRIMARY_COLOR,
    },
    nameSection: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 10,
      color: theme.TEXT_COLOR,
    },
    input: {
      borderWidth: 1,
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
      color: theme.TEXT_COLOR,
      borderColor: theme.SECONDARY_COLOR,
      backgroundColor: theme.BACKGROUND_COLOR,
    },
    errorText: {
      color: 'red',
      fontSize: theme.FONT_SIZE_SMALL,
    },
    saveButton: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
      alignItems: 'center',
      backgroundColor: theme.PRIMARY_COLOR,
    },
    buttonText: {
      color: '#000',
      fontSize: 16,
    },
    toggleContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 20,
    },
  });
}
