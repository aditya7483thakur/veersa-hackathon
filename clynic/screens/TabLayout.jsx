import { Dimensions, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AppointmentScreen from './patient/Appointments';
import AskAIScreen from './patient/AskAI';
import { Colors } from '../constants/Colors';
import {AntDesign, FontAwesome5} from '@expo/vector-icons';
import ExploreLayout from './patient/ExploreLayout';

const Tab = createBottomTabNavigator();

const TabLayout = () => {

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          width: "90%",
          position: 'absolute',
          bottom: "5%",
          borderRadius: 15,
          elevation: 10,
          marginLeft: "5%",
          backgroundColor: '#fff',
          height: 60,
          borderTopWidth: 0,
          shadowColor: Colors.bgColor(1),
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.5,
          shadowRadius: 5,
        },
        headerShown: false,
      }}
      initialRouteName="ExploreTabs"
    >
      <Tab.Screen
        name="ExploreTabs"
        component={ExploreLayout}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}>
              <View 
                className="w-12 h-12 rounded-full items-center justify-center text-center mt-6"
                style={{ backgroundColor: focused ? Colors.bgColor(0.8) : Colors.black(0.1), borderRadius: "100%" }}
              >
                <AntDesign
                  name={'search1'}
                  size={20}
                  color={focused ? Colors.bgWhite(1) : Colors.black(0.4)}
                />
              </View>
            </View>
          )
        }}
      />
      <Tab.Screen 
        name="Appointments" 
        component={AppointmentScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}>
              <View 
                className="w-12 h-12 rounded-full items-center justify-center text-center mt-6"
                style={{ backgroundColor: focused ? Colors.bgColor(0.8) : Colors.black(0.1), borderRadius: "100%" }}
              >
                <AntDesign
                  name={'calendar'}
                  size={20}
                  color={focused ? Colors.bgWhite(1) : Colors.black(0.4)}
                />
              </View>
            </View>
          )
        }}
      />
      <Tab.Screen 
        name="Ask AI" 
        component={AskAIScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}>
              <View 
                className="w-12 h-12 rounded-full items-center justify-center text-center mt-6"
                style={{ backgroundColor: focused ? Colors.bgColor(0.8) : Colors.black(0.1), borderRadius: "100%" }}
              >
                <FontAwesome5
                  name={'robot'}
                  size={20}
                  color={focused ? Colors.bgWhite(1) : Colors.black(0.4)}
                />
              </View>
            </View>
          )
        }}
      />
    </Tab.Navigator>
  );
};

export default TabLayout;
