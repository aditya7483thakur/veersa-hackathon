import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OnboardingScreens from "../components/OnboardingScreens";
import AuthScreen from "./Auth";
import IntroScreen from "./Intro";

// Handles unauthenticated screens
const Stack = createNativeStackNavigator();

const AuthStack = () => (
  <Stack.Navigator initialRouteName="intro">
    {/* Intro */}
    <Stack.Screen name="intro" component={IntroScreen} options={{ headerShown: false }} />

    {/* Onboarding screen */}
    <Stack.Screen name="onboarding" component={OnboardingScreens} options={{ headerShown: false }} />

    {/* Login/Registration screen */}
    <Stack.Screen name="auth" component={AuthScreen} options={{ headerShown: false }} />
    
  </Stack.Navigator>
);

export default AuthStack;