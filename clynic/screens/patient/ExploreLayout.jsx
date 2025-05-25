import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ExploreScreen from "./home/Explore";
import DoctorProfile from "./home/DoctorProfile";
import ScheduleScreen from "./home/Schedule";
import ConfirmationScreen from "./home/Confirmation";

const ExploreStack = createNativeStackNavigator();

const ExploreLayout = () => {
  return (
    <ExploreStack.Navigator screenOptions={{ headerShown: false }}>
      <ExploreStack.Screen name="Explore" component={ExploreScreen} />
      <ExploreStack.Screen name="DoctorProfile" component={DoctorProfile} />
      <ExploreStack.Screen name="Schedule" component={ScheduleScreen} />
      <ExploreStack.Screen name="Confirmation" component={ConfirmationScreen} />
    </ExploreStack.Navigator>
  );
};

export default ExploreLayout;