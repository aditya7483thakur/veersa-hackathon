import "./global.css";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "./screens/Splash";
import { NavigationContainer } from "@react-navigation/native";
import IntroScreen from "./screens/Intro";
import AuthProvider, { useAuth } from "./context/AuthContext";
import Home from "./screens/Home";
import AuthScreen from "./screens/auth";
import LoginScreen from "./components/LoginScreen";

// Stack for navigation
const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { authenticated } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="intro"
          component={IntroScreen}
          options={{ headerShown: false }}
        />
        {authenticated ? (
          <Stack.Screen
            name="home"
            component={Home}
            options={{ headerShown: false }}
          />
        ) : (
          <Stack.Screen
            name="auth"
            component={AuthScreen}
            options={{ headerShown: false }}
          />
        )}
        <Stack.Screen name="Signin" component={LoginScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

const App = () => {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
};

export default App;
