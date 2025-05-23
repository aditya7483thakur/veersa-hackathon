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
    refreshToken: null,
    authenticated: false,
  });

  const checkAuthStatus = async () => {
    try {
      const accessToken = await SecureStore.getItemAsync(
        process.env.EXPO_PUBLIC_ACCESS_TOKEN_SECRET
      );
      const refreshToken = await SecureStore.getItemAsync(
        process.env.EXPO_PUBLIC_REFRESH_TOKEN_SECRET
      );

      if (accessToken && refreshToken) {
        axios.defaults.headers.common["Authorization"] =
          `Bearer ${accessToken}`;

        setAuthState({
          accessToken,
          refreshToken,
          authenticated: true,
        });
      } else {
        setAuthState({
          accessToken: null,
          refreshToken: null,
          authenticated: false,
        });
      }
    } catch (error) {
      console.log("Error loading tokens:", error);
      setAuthState({
        accessToken: null,
        refreshToken: null,
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
        `${process.env.EXPO_PUBLIC_API_URL}/auth/register`,
        {
          ...user,
        }
      );
      Alert.alert("Success", response.data.message);
    } catch (error) {
      console.log("Registration error details:")
      Alert.alert("Error", error.response.data.message);
    }
  };

  const login = async ({email, password}) => {
    try {
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/auth/login`,
        {
          email,
          password,
        }
      );

      if (response.status !== 200) {
        Alert.alert("Error", "Invalid Credentials");
        return;
      }


      const { accessToken, refreshToken } = response.data;

      setAuthState({
        accessToken,
        refreshToken,
        authenticated: true,
      });

      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      await SecureStore.setItemAsync(
        process.env.EXPO_PUBLIC_ACCESS_TOKEN_SECRET,
        accessToken
      );
      await SecureStore.setItemAsync(
        process.env.EXPO_PUBLIC_REFRESH_TOKEN_SECRET,
        refreshToken
      );

      return response;
    } catch (error) {
      Alert.alert("Error", error.response.data.message);
      console.log(error);
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync(
        process.env.EXPO_PUBLIC_ACCESS_TOKEN_SECRET
      );
      await SecureStore.deleteItemAsync(
        process.env.EXPO_PUBLIC_REFRESH_TOKEN_SECRET
      );
      axios.defaults.headers.common["Authorization"] = "";
      setAuthState({
        accessToken: null,
        refreshToken: null,
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
    authenticated: authState.authenticated,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
