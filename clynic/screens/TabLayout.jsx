import { View, Text, TouchableOpacity, } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ExploreScreen from './patient/Explore';
import AppointmentScreen from './patient/Appointments';
import AskAIScreen from './patient/AskAI';
import { Colors } from '../constants/Colors';
import Indicator from '../components/Indicator';
import {AntDesign, FontAwesome5} from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const TabLayout = () => {

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          padding: 4,
          marginBottom: 20, 
          width: "90%",
          borderRadius: 10,
          alignSelf: "center",
          justifyContent: "center",
          borderTopWidth: 0,
          height: 60,
          elevation: 5,
          shadowColor: Colors.bgColor(1)
        },
        headerShown: false
      }}
      initialRouteName="Explore"
    >
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
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
                className="mt-[-3] w-12 h-12 rounded-full items-center justify-center text-center"
                style={{ backgroundColor: focused ? Colors.bgColor(0.8) : Colors.black(0.1), borderRadius: "100%" }}
              >
                <AntDesign
                  name={'search1'}
                  size={20}
                  color={focused ? Colors.bgWhite(1) : Colors.black(0.4)}
                />
              </View>
              <Indicator
                value={"Explore"}
                focused={focused}
                color={focused ? Colors.bgWhite(1) : Colors.black(0.4)}
              />
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
                className="mt-[-3] w-12 h-12 rounded-full items-center justify-center text-center"
                style={{ backgroundColor: focused ? Colors.bgColor(0.8) : Colors.black(0.1), borderRadius: "100%" }}
              >
                <AntDesign
                  name={'calendar'}
                  size={20}
                  color={focused ? Colors.bgWhite(1) : Colors.black(0.4)}
                />
              </View>
              <Indicator
                value={"Appointments"}
                focused={focused}
                color={focused ? Colors.bgWhite(1) : Colors.black(0.4)}
              />
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
                className="mt-[-3] w-12 h-12 rounded-full items-center justify-center text-center"
                style={{ backgroundColor: focused ? Colors.bgColor(0.8) : Colors.black(0.1), borderRadius: "100%" }}
              >
                <FontAwesome5
                  name={'robot'}
                  size={20}
                  color={focused ? Colors.bgWhite(1) : Colors.black(0.4)}
                />
              </View>
              <Indicator
                value={"Ask AI"}
                focused={focused}
                color={focused ? Colors.bgWhite(1) : Colors.black(0.4)}
              />
            </View>
          )
        }}
      />
    </Tab.Navigator>
  );
};

export default TabLayout;
