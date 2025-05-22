import { View, Text, TouchableOpacity, } from 'react-native';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { logout } = useAuth();

  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-2xl font-bold mb-4">logged in</Text>
            <TouchableOpacity onPress={logout}>
              <Text>log out</Text>
            </TouchableOpacity>
      
    </View>
  );
};

export default Home;
