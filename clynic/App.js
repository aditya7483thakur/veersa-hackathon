import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "./screens/Splash";
import OnboardingScreens from "./components/OnboardingScreens";
import AuthScreen from "./screens/auth";
import AuthProvider, { useAuth } from "./context/AuthContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "./global.css";
import TabLayout from "./screens/TabLayout";
import { useEffect } from "react";
import { Linking } from "react-native";
import * as Notifications from "expo-notifications";

const RootStack = createNativeStackNavigator();

import { LogBox } from 'react-native';

LogBox.ignoreAllLogs(true); // Ignore all log notifications

function AppNavigator() {
  const { authenticated, loading } = useAuth();
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const url = response.notification.request.content.data.url;
        if (url) {
          Linking.openURL(url);
        }
      }
    );

    return () => subscription.remove();
  }, []);
  // Show splash while loading
  if (loading) {
    return (
      <NavigationContainer>
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          <RootStack.Screen name="splash" component={SplashScreen} />
        </RootStack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {/* <RootStack.Screen name="splash" component={SplashScreen} /> */}
        {authenticated ? (
          // Authenticated screens
          <>
            <RootStack.Screen name="tabs" component={TabLayout} />
            {/* <RootStack.Screen name="doctor-profile" component={DoctorProfile} /> */}

            {/* Add other authenticated screens here */}
          </>
        ) : (
          // Unauthenticated screens
          <>
            <RootStack.Screen name="onboarding" component={OnboardingScreens} />
            <RootStack.Screen name="auth" component={AuthScreen} />
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

const App = () => {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
};

export default App;
