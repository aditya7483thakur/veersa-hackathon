import { useRoute } from '@react-navigation/native';
import {
  View,
  Text,
  Image,
 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import CustomButton from '../../components/CustomButton';
const DoctorProfile = () => {
  const route = useRoute();
  const { doctor } = route.params || {};

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-white px-4">
      <View className="bg-[#edf4ff] w-full max-w-sm rounded-3xl p-6 gap-4">
        {/* Profile Image */}
        <View className="items-center">
          <View
            className="bg-white rounded-full w-20 h-20 flex items-center justify-center"
            style={{ borderColor: "#3b82f6", borderWidth: 2 }}
          >
            {doctor?.profilePhoto ? (
              <Image
                source={{ uri: doctor.profilePhoto }}
                className="w-20 h-20 rounded-full"
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
          <Text className="text-gray-500 mt-1 text-sm">
            ₹{doctor?.fees || '500'}
          </Text>
        </View>

        {/* Buttons */}
        <View className="justify-between">
          <CustomButton
            handlePress={() => console.log("Get Directions")}
            text={"Get Directions"}
            otherStyles={{ marginBottom: -5 }}
          />
          <CustomButton
            handlePress={() => console.log("Book Appointment")}
            text={"Book Appointment"}
            inverted={true}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default DoctorProfile;
