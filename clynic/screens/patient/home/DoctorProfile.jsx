import { useNavigation, useRoute } from '@react-navigation/native';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Linking,
 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/Colors'; 
import CustomButton from '../../../components/CustomButton'; 
import { AntDesign } from "@expo/vector-icons";

const DoctorProfile = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { doctor } = route.params || {};
  console.log(doctor);

  const handleBooking = () => {
    navigation.navigate("Schedule", {
      doctor: JSON.stringify(doctor)
    });
  };

  const redirectToGoogleMaps = () => {
      const doctorLat = doctor.location.coordinates[1];
      const doctorLon = doctor.location.coordinates[0];
      const url = `https://www.google.com/maps/dir/?api=1&destination=${doctorLat},${doctorLon}`;
      Linking.openURL(url);
  };

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-white px-4">
      <TouchableOpacity 
        className="w-10 h-10 self-start mx-5 mb-5 mt-[-10%] rounded-full items-center justify-center" 
        style={{ backgroundColor: Colors.bgColor(0.8) }}
        activeOpacity={0.7}
        onPress={() => navigation.goBack()}
      >
        <AntDesign
          name="arrowleft"
          size={20}
          color={"#fff"}
        />
      </TouchableOpacity>
      <View className="bg-[#edf4ff] w-full max-w-sm rounded-3xl p-6 gap-4">
        {/* Profile Image */}
        <View className="items-center">
          <View
            className="bg-white rounded-full w-20 h-20 flex items-center justify-center"
          >
            {doctor?.profilePhoto ? (
              <Image
                source={{ uri: "https://res.cloudinary.com/dkhbiyylo/image/upload/fl_preserve_transparency/v1748009059/avatar_aetfjt.jpg?_s=public-apps" }}
                className="w-20 h-20 rounded-full"
                resizeMode='contain'
              />
            ) : (
              <Ionicons name="person" size={36} color={"#3b82f6"} />
            )}
          </View>

          <Text className="font-bold text-lg mt-2" style={{ color: Colors.bgColor(0.8) }}>
            {doctor?.doctorName || 'Dr. Unknown'}
          </Text>
          <Text className="text-gray-500 text-sm">{doctor?.specialization || 'General Practice'}</Text>
        </View>

        {/* Experience */}
        <View className="bg-white rounded-xl p-4 shadow-sm">
          <Text className="font-semibold text-sm" style={{ color: Colors.bgColor(0.8) }}>
            Experience
          </Text>
          <Text className="text-gray-500 mt-1 text-sm">
            {doctor?.experience || '0'} Years
          </Text>
        </View>

        {/* Location */}
        <View className="bg-white rounded-xl p-4 shadow-sm">
          <Text className="font-semibold text-sm" style={{ color: Colors.bgColor(0.8) }}>
            Location
          </Text>
          <Text className="text-gray-500 mt-1 text-sm">
            {doctor?.hospitalName || 'N/A'}
            {"\n"}
            {doctor?.city || ''}, {doctor?.state || ''}
          </Text>
        </View>

        {/* Fees */}
        <View className="bg-white rounded-xl p-4 shadow-sm">
          <Text className="text-blue-600 font-semibold text-sm" style={{ color: Colors.bgColor(0.8) }}>
            Consultation Fee
          </Text>
          <Text className="text-gray-500 mt-1 font-bold">
            ₹{doctor?.fees || '500'}
          </Text>
        </View>

        {/* Buttons */}
        <View className="justify-between">
          <CustomButton
            handlePress={redirectToGoogleMaps}
            text={"Get Directions"}
            otherStyles={{ marginBottom: -5 }}
          />
          <CustomButton
            handlePress={handleBooking}
            text={"Book Appointment"}
            inverted={true}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default DoctorProfile;
