import { View, Text, Image, TouchableOpacity } from "react-native";
import { Colors } from "../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const DoctorCard = ({ item }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      className="bg-white mx-4 mb-4 rounded-2xl p-4 shadow-sm"
      style={{
        shadowColor: Colors.black(0.1),
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
      }}
      onPress={() => navigation.navigate("doctor-profile", { doctor: item })}
    >
      <View className="flex-row items-center">
        <View
          className="w-16 h-16 rounded-full items-center justify-center mr-4"
          style={{ backgroundColor: Colors.bgColor(0.1) }}
        >
          {item.profilePhoto ? (
            <Image
              source={{ uri: item.profilePhoto }}
              className="w-16 h-16 rounded-full"
              resizeMode="cover"
            />
          ) : (
            <Ionicons name="person" size={32} color={Colors.bgColor(1)} />
          )}
        </View>

        <View className="flex-1">
          <Text
            className="text-lg font-bold mb-1"
            style={{ color: Colors.bgColor(1) }}
          >
            {item.doctorName || "Dr. Unknown"}
          </Text>
          <Text className="text-sm mb-1" style={{ color: Colors.black(0.6) }}>
            {item.specialization || "General Practice"}
          </Text>
          <Text className="text-xs mb-2" style={{ color: Colors.black(0.5) }}>
            {item.hospitalName || "Medical Center"}
          </Text>
          <Text className="text-xs" style={{ color: Colors.black(0.5) }}>
            {item.experience || "0"} years of Experience
          </Text>
        </View>
      </View>

      <View className="flex-row justify-between items-center mt-4 pt-3 border-t border-gray-100">
        <Text
          className="text-lg font-bold"
          style={{ color: Colors.bgColor(1) }}
        >
          ₹{item.fees || "500"}
        </Text>
        <View className="flex-row items-center">
          <Ionicons
            name="location-outline"
            size={16}
            color={Colors.bgColor(1)}
          />
          <Text className="text-sm ml-1" style={{ color: Colors.bgColor(1) }}>
            {item.city}, {item.state}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default DoctorCard;
