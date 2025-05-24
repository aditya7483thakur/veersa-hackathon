import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import LoginScreen from '../components/LoginScreen';
import RegisterScreen from '../components/RegisterScreen';
import { Colors } from '../constants/Colors';
import CustomButton from '../components/CustomButton';

const AuthScreen = () => {
  const [isSignup, setIsSignup] = useState(true);

  const handleToggle = () => {
    setIsSignup(!isSignup);
  }

  return (
    <View
      className="flex-1 p-4"
      style={{ backgroundColor: Colors.bgWhite(1) }}
    >
      <View className="flex-1 justify-center items-center w-full">
        {isSignup ? <RegisterScreen /> : <LoginScreen />}
      </View>

      <CustomButton
        inverted={true}
        handlePress={handleToggle}
        text={isSignup ? "Already have an account? Login" : "New user? Sign up"}
        otherStyles={{ width: "95%", alignSelf: "center", marginBottom: 20 }}
      />

    </View>
  );
};

export default AuthScreen;
