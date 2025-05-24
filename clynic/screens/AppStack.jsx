import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./Home";

// Handles authentication screens
const Stack = createNativeStackNavigator();

const AppStack = () => (
  <Stack.Navigator>

    {/* Home Screen */}
    <Stack.Screen name="home" component={Home} options={{ headerShown: false }} />

  </Stack.Navigator>
);

export default AppStack;