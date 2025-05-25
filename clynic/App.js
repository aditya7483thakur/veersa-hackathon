import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "./screens/Splash";
import OnboardingScreens from "./components/OnboardingScreens";
import AuthScreen from "./screens/auth";
import AuthProvider, { useAuth } from "./context/AuthContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "./global.css";
import TabLayout from "./screens/TabLayout";

const RootStack = createNativeStackNavigator();

function AppNavigator() {
  const { authenticated, loading } = useAuth();

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