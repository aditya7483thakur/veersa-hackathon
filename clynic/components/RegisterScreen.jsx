import React, { useState, useEffect } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  View,
  BackHandler,
} from 'react-native';
import * as Location from 'expo-location';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../constants/Colors';

const RegisterScreen = () => {
  const { register } = useAuth();
  const navigation = useNavigation();

  const [selectedRole, setSelectedRole] = useState('patient');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'patient',
    // Doctor-specific fields
    hospitalName: '',
    hospitalAddress: '',
    specialization: '',
    fees: '',
    city: '',
    state: '',
    country: '',
    latitude: '',
    longitude: '',
    licence: '',
    experience: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [location, setLocation] = useState(null);

  // Location permission handler
  useEffect(() => {
    const GetLocationPermission = async () => {
      try {
        const { status } = await Location.getForegroundPermissionsAsync();
        if (status !== "granted") {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== "granted") {
            Alert.alert(
              "Location Permission Required",
              "Location access is necessary to find doctors near you. Please go to the app settings and allow location permission.",
              [
                {
                  text: "OK",
                  onPress: () => BackHandler.exitApp(),
                },
                {
                  text: "Open Settings", 
                  onPress: () => {
                    console.log('Open Settings');
                  }
                }
              ]
            );
          }
        }
      } catch (error) {
        console.error("Error getting location:", error);
      }
    };
    GetLocationPermission();
  }, []);

  // Get current location function
  const GetLocation = async () => {
    setLocationLoading(true);
    try {
      // Check if location permission is granted
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== "granted") {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission Denied", "Location permission is required to get your current location.");
          setLocationLoading(false);
          return;
        }
      }
      
      // Get the current location
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      console.log(currentLocation["coords"]);
      setLocation(currentLocation);
      
      // Update form fields
      setForm(prev => ({
        ...prev,
        latitude: currentLocation["coords"]["latitude"].toString(),
        longitude: currentLocation["coords"]["longitude"].toString(),
      }));
      
      const newErrors = { ...errors };
      delete newErrors.latitude;
      delete newErrors.longitude;
      setErrors(newErrors);
      
      Alert.alert("Success", "Location has been updated successfully!");
      
    } catch (error) {
      console.error("Error getting location:", error);
      Alert.alert("Error", "Failed to get current location. Please try again or enter coordinates manually.");
    } finally {
      setLocationLoading(false);
    }
  };

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setForm({ ...form, role });
    // Clear role-specific errors when switching
    const newErrors = { ...errors };
    if (role === 'patient') {
      delete newErrors.hospitalName;
      delete newErrors.hospitalAddress;
      delete newErrors.specialization;
      delete newErrors.fees;
      delete newErrors.city;
      delete newErrors.state;
      delete newErrors.country;
      delete newErrors.licence;
      delete newErrors.experience;
    }
    setErrors(newErrors);
  };

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
    if (errors[key]) {
      setErrors({ ...errors, [key]: "" });
    }
  };

const validate = () => {
    let valid = true;
    const newErrors = {};

    // Common validation
    if (!form.name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    }
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Invalid email address";
      valid = false;
    }
    if (!form.password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    }

    // Doctor-specific validation
    if (selectedRole === 'doctor') {
      if (!form.hospitalName.trim()) {
        newErrors.hospitalName = 'Hospital name is required';
        valid = false;
      }
      if (!form.hospitalAddress.trim()) {
        newErrors.hospitalAddress = 'Hospital address is required';
        valid = false;
      }
      if (!form.specialization.trim()) {
        newErrors.specialization = 'Specialization is required';
        valid = false;
      }
      if (!form.fees.trim()) {
        newErrors.fees = 'Consultation fees is required';
        valid = false;
      } else if (isNaN(form.fees) || parseFloat(form.fees) <= 0) {
        newErrors.fees = 'Please enter a valid fee amount';
        valid = false;
      }
      if (!form.city.trim()) {
        newErrors.city = 'City is required';
        valid = false;
      }
      if (!form.state.trim()) {
        newErrors.state = 'State is required';
        valid = false;
      }
      if (!form.country.trim()) {
        newErrors.country = 'Country is required';
        valid = false;
      }
      if (!form.licence.trim()) {
        newErrors.licence = 'Medical licence number is required';
        valid = false;
      }
      if (!form.experience.trim()) {
        newErrors.experience = 'Years of experience is required';
        valid = false;
      } else if (isNaN(form.experience) || parseInt(form.experience) < 0) {
        newErrors.experience = 'Please enter a valid number of years';
        valid = false;
      }
      // Latitude and longitude are optional for doctors
      if (form.latitude && (isNaN(form.latitude) || parseFloat(form.latitude) < -90 || parseFloat(form.latitude) > 90)) {
        newErrors.latitude = 'Please enter a valid latitude (-90 to 90)';
        valid = false;
      }
      if (form.longitude && (isNaN(form.longitude) || parseFloat(form.longitude) < -180 || parseFloat(form.longitude) > 180)) {
        newErrors.longitude = 'Please enter a valid longitude (-180 to 180)';
        valid = false;
      }
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
        
      await register(form);

      Alert.alert(
        "Success",
        "Account created successfully! Please sign in."
      );
    } catch (err) {
      const errorMessage = err.message || "Signup failed. Please try again.";
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderFormField = (key, placeholder, options = {}) => {
    const {
      keyboardType = 'default',
      autoCapitalize = 'sentences',
      secureTextEntry = false,
      multiline = false,
    } = options;

    return (
      <View className="mb-3">
        <TextInput
          className={`border rounded-lg p-3 mb-1 text-base ${errors[key] ? 'border-red-500' : 'border-gray-300'}`}
          placeholder={placeholder}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          secureTextEntry={secureTextEntry}
          multiline={multiline}
          value={form[key]}
          onChangeText={(val) => handleChange(key, val)}
          editable={!loading}
          style={{ 
            borderColor: errors[key] ? 'rgba(239, 68, 68, 1)' : 'rgba(209, 213, 219, 1)',
            minHeight: multiline ? 80 : 50,
            textAlignVertical: multiline ? 'top' : 'center',
          }}
        />
        {errors[key] && <Text className="text-red-500 text-sm">{errors[key]}</Text>}
      </View>
    );
  };

  return (
    <ScrollView 
      className="w-full" 
      style={{ backgroundColor: Colors.bgWhite(1) }} 
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <Text className="text-3xl font-bold text-center mb-6" style={{ color: Colors.black(1) }}>
        Sign Up
      </Text>

      {/* Role Selection Tabs */}
      <View className="flex-row mb-6 rounded-lg overflow-hidden" style={{ backgroundColor: 'rgba(243, 244, 246, 1)' }}>
        <TouchableOpacity
          className="flex-1 py-3 px-4"
          style={{
            backgroundColor: selectedRole === 'patient' ? Colors.bgColor(1) : 'transparent',
          }}
          onPress={() => handleRoleChange('patient')}
          disabled={loading}
        >
          <Text 
            className="text-center font-semibold"
            style={{ 
              color: selectedRole === 'patient' ? Colors.bgWhite(1) : Colors.black(0.6) 
            }}
          >
            Patient
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 py-3 px-4"
          style={{
            backgroundColor: selectedRole === 'doctor' ? Colors.bgColor(1) : 'transparent',
          }}
          onPress={() => handleRoleChange('doctor')}
          disabled={loading}
        >
          <Text 
            className="text-center font-semibold"
            style={{ 
              color: selectedRole === 'doctor' ? Colors.bgWhite(1) : Colors.black(0.6) 
            }}
          >
            Doctor
          </Text>
        </TouchableOpacity>
      </View>

      {/* Common Fields */}
      {renderFormField('name', 'Full Name')}
      {renderFormField('email', 'Email Address', { 
        keyboardType: 'email-address', 
        autoCapitalize: 'none' 
      })}
      {renderFormField('password', 'Password', { 
        secureTextEntry: true,
        autoCapitalize: 'none' 
      })}

      {/* Doctor-specific Fields */}
      {selectedRole === 'doctor' && (
        <View>
          <Text className="text-lg font-semibold mb-3 mt-2" style={{ color: Colors.black(0.8) }}>
            Professional Information
          </Text>
          
          {renderFormField('hospitalName', 'Hospital/Clinic Name')}
          {renderFormField('hospitalAddress', 'Hospital/Clinic Address', { multiline: true })}
          {renderFormField('specialization', 'Medical Specialization')}
          {renderFormField('fees', 'Consultation Fees', { keyboardType: 'numeric' })}
          {renderFormField('licence', 'Medical License Number')}
          {renderFormField('experience', 'Years of Experience', { keyboardType: 'numeric' })}
          
          <Text className="text-lg font-semibold mb-3 mt-4" style={{ color: Colors.black(0.8) }}>
            Location Information
          </Text>
          
          {renderFormField('city', 'City')}
          {renderFormField('state', 'State/Province')}
          {renderFormField('country', 'Country')}
          
          {/* Location Section with Get Location Button */}
          <View className="mb-3">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-base font-medium" style={{ color: Colors.black(0.7) }}>
                Coordinates (Optional)
              </Text>
              <TouchableOpacity
                className="px-3 py-2 rounded-md"
                style={{
                  backgroundColor: locationLoading ? 'rgba(156, 163, 175, 1)' : Colors.bgColor(0.1),
                  borderWidth: 1,
                  borderColor: Colors.bgColor(1),
                }}
                onPress={GetLocation}
                disabled={loading || locationLoading}
              >
                <Text 
                  className="text-xs font-medium"
                  style={{ color: Colors.bgColor(1) }}
                >
                  {locationLoading ? 'Getting...' : 'Get Location'}
                </Text>
              </TouchableOpacity>
            </View>
            
            <View className="flex-row space-x-2">
              <View className="flex-1">
                {renderFormField('latitude', 'Latitude', { keyboardType: 'numeric' })}
              </View>
              <View className="flex-1">
                {renderFormField('longitude', 'Longitude', { keyboardType: 'numeric' })}
              </View>
            </View>
          </View>
        </View>
      )}

      <TouchableOpacity
        className="rounded-lg p-4 mt-6"
        style={{
          backgroundColor: loading ? 'rgba(156, 163, 175, 1)' : Colors.bgColor(1),
        }}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text className="text-white text-center font-semibold text-base">
          {loading ? 'Creating Account...' : `Register as ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}`}
        </Text>
      </TouchableOpacity>

      
    </ScrollView>
  );
};

export default RegisterScreen;