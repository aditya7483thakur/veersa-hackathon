import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import LoginScreen from '../components/LoginScreen';
import RegisterScreen from '../components/RegisterScreen';
import { Colors } from '../constants/Colors';

const AuthScreen = () => {
  const [isSignup, setIsSignup] = useState(true);

  return (
    <View
      className="flex-1 p-4"
      style={{ backgroundColor: Colors.bgWhite(1) }}
    >
      <View className="flex-1 justify-center items-center w-full">
        {isSignup ? <RegisterScreen /> : <LoginScreen />}
      </View>

      <TouchableOpacity
        className="mt-6 p-3 rounded-lg self-center"
        style={{ backgroundColor: Colors.bgColor(1) }}
        onPress={() => setIsSignup(!isSignup)}
      >
        <Text
          className="text-center font-semibold"
          style={{ color: Colors.black(1) }}
        >
          {isSignup ? "Already have an account? Login" : "New user? Sign up"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default AuthScreen;
