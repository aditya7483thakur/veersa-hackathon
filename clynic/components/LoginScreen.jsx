import React, { useState } from 'react';
import {
  Text,
  TextInput,
  Alert,
  ScrollView,
  StatusBar
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import CustomButton from './CustomButton';
import { Colors } from '../constants/Colors';

const LoginScreen = () => {
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
    if (errors[key]) {
      setErrors({ ...errors, [key]: '' });
    }
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
    const response = await login(form); 

    if (response.status !== 200) {
      Alert.alert("Error", "Invalid Credentials");
      return;
    }
    Alert.alert('Success', 'Successfully logged in!');

  } catch (err) {
    Alert.alert('Error', err?.response?.data?.message || 'Login failed');
  }
};

  return (
      <ScrollView contentContainerStyle={{
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
      }} className=" bg-white w-full">
       <Text className="text-3xl font-bold text-center mb-6" style={{ color: Colors.bgColor(0.8) }}>
          Welcome Back
        </Text>

        <TextInput
          className={`border rounded-lg p-3 mb-3 text-base ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Email"
          keyboardType="email-address"
          value={form.email}
          onChangeText={(val) => handleChange('email', val)}
          placeholderTextColor="#9ca3af"
        />
        {errors.email && <Text className="text-red-500 mb-2 text-sm">{errors.email}</Text>}

        <TextInput
          className={`border rounded-lg p-3 mb-2 text-base ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Password"
          secureTextEntry
          value={form.password}
          onChangeText={(val) => handleChange('password', val)}
          placeholderTextColor="#9ca3af"
        />
        {errors.password && <Text className="text-red-500 mb-2 text-sm">{errors.password}</Text>}

        <CustomButton
          text={"LOGIN"}
          handlePress={handleSubmit}
        />
      </ScrollView>
  );
};

export default LoginScreen;
