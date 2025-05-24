import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/Colors";
import CustomButton from "../../components/CustomButton";

// Next screen after selecting a Doctor -> To be linked later
const DoctorProfile = () => {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-white px-4">
      <View className="bg-[#edf4ff] w-full max-w-sm rounded-3xl p-6 gap-4">
        {/* Profile Image Placeholder */}
        <View className="items-center">
          <View
            className="bg-white rounded-full w-20 h-20 flex items-center justify-center"
            style={{ borderColor: "#3b82f6", borderWidth: 2 }}
          >
            <Ionicons name="person" size={36} color={"#3b82f6"} />
          </View>

            <Text 
                className=" font-bold text-lg mt-2"
                style={{ color: Colors.bgColor(0.8) }}
            >
            Dr. Ramesh
          </Text>
          <Text className="text-gray-500 text-sm">Opthalmologist</Text>
        </View>

        {/* Experience */}
        <View className="bg-white rounded-xl p-4 shadow-sm">
          <Text className="font-semibold text-sm" style={{ color: Colors.bgColor(0.8) }}>
            Experience
          </Text>
          <Text className="text-gray-500 mt-1 text-sm">26 Years</Text>
        </View>

        {/* Location */}
        <View className="bg-white rounded-xl p-4 shadow-sm">
            <Text className="font-semibold text-sm" style={{ color: Colors.bgColor(0.8) }}>
                Location
            </Text>
          <Text className="text-gray-500 mt-1 text-sm">
            Max Super Speciality Hospital{"\n"}
            Prashant Vihar{"\n"}
            New Delhi, Delhi
          </Text>
        </View>

        {/* Fees */}
        <View className="bg-white rounded-xl p-4 shadow-sm">
            <Text className="text-blue-600 font-semibold text-sm" style={{ color: Colors.bgColor(0.8) }}>
                Consultation Fee
            </Text>
          <Text className="text-gray-500 mt-1 text-sm">₹6000</Text>
        </View>

        {/* Buttons */}
        <View className="justify-between">
            <CustomButton
                handlePress={() => console.log("Works")}
                text={"Get Directions"}
                otherStyles={{ marginBottom: -5 }}
            />
            <CustomButton
                handlePress={() => console.log("Works")}
                text={"Book Appointment"}
                inverted={true}
            />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default DoctorProfile;
