import "./global.css";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "./screens/Splash";
import { NavigationContainer } from "@react-navigation/native";
import IntroScreen from "./screens/Intro";

// Stack for navigation
const Stack = createNativeStackNavigator();

const App = () => {
  return (
    // Stack Screens
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

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;