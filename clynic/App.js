import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "./screens/Splash";
import AppStack from "./screens/AppStack";
import AuthStack from "./screens/AuthStack";
import AuthProvider, { useAuth } from "./context/AuthContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "./global.css";

const RootStack = createNativeStackNavigator();

function AppNavigator() {
  const { authenticated } = useAuth();

  return (
    <NavigationContainer>
      <RootStack.Navigator initialRouteName="splash" screenOptions={{ headerShown: false }}>
          <RootStack.Screen name="splash" component={SplashScreen} />
        {
          authenticated ? (
            <RootStack.Screen name="app" component={AppStack} />
          ) : (
            <RootStack.Screen name="auth-wrapper" component={AuthStack} />
          )
        }
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