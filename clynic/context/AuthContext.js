import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Alert } from "react-native";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    accessToken: null,
    authenticated: false,
  });

  const checkAuthStatus = async () => {
    try {
      const accessToken = await SecureStore.getItemAsync(
        process.env.EXPO_PUBLIC_ACCESS_TOKEN_SECRET
      );

      if (accessToken) {
        axios.defaults.headers.common["Authorization"] =
          `Bearer ${accessToken}`;

        setAuthState({
          accessToken,
          authenticated: true,
        });
      } else {
        setAuthState({
          accessToken: null,
          authenticated: false,
        });
      }
    } catch (error) {
      console.log("Error loading tokens:", error);
      setAuthState({
        accessToken: null,
        authenticated: false,
      });
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const register = async (user) => {
    try {
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_BACKED_API_URL}/auth/register`,
        {
          ...user,
        }
      );
      const { accessToken } = response.data;

      setAuthState({
        accessToken,
        authenticated: true,
      });

      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      await SecureStore.setItemAsync(
        process.env.EXPO_PUBLIC_ACCESS_TOKEN_SECRET,
        accessToken
      );
      Alert.alert("Success", response.data.message);
    } catch (error) {
      console.log("Registration error details:");
      Alert.alert("Error", error.message);
    }
  };

 const login = async ({ email, password }) => {
  try {
    const response = await axios.post(
      `${process.env.EXPO_PUBLIC_BACKED_API_URL}/auth/login`,
      { email, password }
    );

    const { accessToken } = response.data;

    setAuthState({
      accessToken,
      authenticated: true,
    });

    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

    await SecureStore.setItemAsync(
      process.env.EXPO_PUBLIC_ACCESS_TOKEN_SECRET,
      accessToken
    );

    return response;
  } catch (error) {
    // Log for debugging
    console.log("Login error:", error);

    // Don't alert here — handle that in handleSubmit
    throw error; // <-- Important: Let the caller handle it
  }
};


  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync(
        process.env.EXPO_PUBLIC_ACCESS_TOKEN_SECRET
      );

      axios.defaults.headers.common["Authorization"] = "";
      setAuthState({
        accessToken: null,
        authenticated: false,
      });

      return { status: 200 };
    } catch (error) {
      console.log("Error logging out:", error);
      return { status: 500 };
    }
  };

  const value = {
    register,
    login,
    logout,
    authState,
    accessToken:authState.accessToken,
    authenticated: authState.authenticated,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
