// services/locationService.js

import * as Location from 'expo-location';

const getCurrentLocation = async () => {
  try {
    // Ask for permissions
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Permission to access location was denied');
    }

    // Get location
    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    return { latitude, longitude };
  } catch (error) {
    throw error;
  }
};

export default {
  getCurrentLocation,
};
