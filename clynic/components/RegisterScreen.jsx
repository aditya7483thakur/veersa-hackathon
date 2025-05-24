import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  View,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "../constants/Colors";

const RegisterScreen = () => {
  const { register } = useAuth();
  const navigation = useNavigation();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
    if (errors[key]) {
      setErrors({ ...errors, [key]: "" });
    }
  };

  const validate = () => {
    let valid = true;
    const newErrors = {};

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
    if (!form.role.trim()) {
      newErrors.role = "Role is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await register(form);
      Alert.alert("Success", "Account created successfully! Please sign in.", [
        {
          text: "OK",
          onPress: () => navigation.navigate("Signin"),
        },
      ]);
    } catch (err) {
      const errorMessage = err.message || "Signup failed. Please try again.";
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      className=" w-full"
      style={{ backgroundColor: Colors.bgWhite(1) }}
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
        padding: 20,
      }}
    >
      <Text
        className="text-3xl font-bold text-center mb-6"
        style={{ color: Colors.bgColor(0.8) }}
      >
        Get Started With Clynic
      </Text>

      <TextInput
        className={`border rounded-lg p-3 mb-3 text-base ${errors.name ? "border-red-500" : "border-gray-300"}`}
        placeholder="Name"
        value={form.name}
        onChangeText={(val) => handleChange("name", val)}
        editable={!loading}
        style={{
          borderColor: errors.name
            ? "rgba(239, 68, 68, 1)"
            : "rgba(209, 213, 219, 1)",
        }} // red-500 or gray-300 in rgba
      />
      {errors.name && (
        <Text className="text-red-500 text-sm mb-2">{errors.name}</Text>
      )}

      <TextInput
        className={`border rounded-lg p-3 mb-3 text-base ${errors.email ? "border-red-500" : "border-gray-300"}`}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={form.email}
        onChangeText={(val) => handleChange("email", val)}
        editable={!loading}
        style={{
          borderColor: errors.email
            ? "rgba(239, 68, 68, 1)"
            : "rgba(209, 213, 219, 1)",
        }}
      />
      {errors.email && (
        <Text className="text-red-500 text-sm mb-2">{errors.email}</Text>
      )}

      <TextInput
        className={`border rounded-lg p-3 mb-3 text-base ${errors.password ? "border-red-500" : "border-gray-300"}`}
        placeholder="Password"
        secureTextEntry
        value={form.password}
        onChangeText={(val) => handleChange("password", val)}
        editable={!loading}
        style={{
          borderColor: errors.password
            ? "rgba(239, 68, 68, 1)"
            : "rgba(209, 213, 219, 1)",
        }}
      />
      {errors.password && (
        <Text className="text-red-500 text-sm mb-2">{errors.password}</Text>
      )}

      <TextInput
        className={`border rounded-lg p-3 mb-3 text-base ${errors.role ? "border-red-500" : "border-gray-300"}`}
        placeholder="Role (patient or doctor)"
        value={form.role}
        onChangeText={(val) => handleChange("role", val)}
        editable={!loading}
        style={{
          borderColor: errors.role
            ? "rgba(239, 68, 68, 1)"
            : "rgba(209, 213, 219, 1)",
        }}
      />
      {errors.role && (
        <Text className="text-red-500 text-sm mb-2">{errors.role}</Text>
      )}

      <TouchableOpacity
        className="rounded-lg p-4 mt-4"
        style={{
          backgroundColor: loading
            ? "rgba(156, 163, 175, 1)"
            : Colors.bgColor(1), // gray-400 or your bgColor
        }}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text className="text-white text-center font-semibold text-base">
          {loading ? "Creating Account..." : "Register"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default RegisterScreen;
