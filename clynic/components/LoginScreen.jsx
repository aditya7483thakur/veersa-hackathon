import React, { useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../constants/Colors';

const LoginScreen = () => {
  const { login } = useAuth();
  const navigation = useNavigation();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const validate = () => {
    let valid = true;
    const newErrors = {};

    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Invalid email address';
      valid = false;
    }

    if (!form.password) {
      newErrors.password = 'Password is required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      await login(form);
      Alert.alert('Success', 'Successfully logged in!');
    } catch (err) {
      Alert.alert('Error', 'Login failed');
    }
  };

  return (
    <>
      <StatusBar 
          backgroundColor="transparent"
          barStyle="dark-content"
          translucent
      />
      <ScrollView contentContainerStyle={{
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
      }} className=" bg-white w-full">
        <Text className="text-2xl font-bold mb-6 text-center">Login</Text>

        <TextInput
          className="border border-gray-400 rounded-lg p-3 mb-2 text-base"
          placeholder="Email"
          keyboardType="email-address"
          value={form.email}
          onChangeText={(val) => handleChange('email', val)}
        />
        {errors.email && <Text className="text-red-500 mb-2 text-sm">{errors.email}</Text>}

        <TextInput
          className="border border-gray-400 rounded-lg p-3 mb-2 text-base"
          placeholder="Password"
          secureTextEntry
          value={form.password}
          onChangeText={(val) => handleChange('password', val)}
        />
        {errors.password && <Text className="text-red-500 mb-2 text-sm">{errors.password}</Text>}

        <TouchableOpacity
          className=" py-4 px-6 rounded-lg mt-2"
          style={{
            backgroundColor: Colors.bgColor(1), // gray-400 or your bgColor
          }}
          onPress={handleSubmit}
        >
          <Text className="text-white font-bold text-center">Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
};

export default LoginScreen;
