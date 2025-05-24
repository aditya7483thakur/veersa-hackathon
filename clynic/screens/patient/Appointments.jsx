import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { Colors } from "../../constants/Colors";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";

const AppointmentScreen = () => {
  const appointment = [
    {
      id: 1,
      time: "09:00 A.M",
      date: "12 Aug 2024",
      doctor: "Dr. Bishwajit",
      specialty: "Ophthalmologist",
      hospital: "Max Super Speciality Hospital, Prashant Vihar",
      isToday: true,
    },
    {
      id: 2,
      time: "09:30 A.M",
      date: "12 Aug 2024",
      doctor: "Dr. Kansal",
      specialty: "Radiology",
      hospital: "AIIMS, Delhi",
      isToday: false,
    },
    {
      id: 3,
      time: "02:15 P.M",
      date: "15 Aug 2024",
      doctor: "Dr. Sharma",
      specialty: "Cardiology",
      hospital: "Apollo Hospital, Delhi",
      isToday: false,
    },
  ];
  const [appointments, setAppointments] = useState([]);

  const { authState } = useAuth();
  console.log(authState);
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(
          "http://192.168.1.6:5000/appointment/get-doctors"
        );
        setAppointments(response.data);
        console.log(response.data);
        console.log("Doctors fetched:", response.data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    if (authState?.accessToken) {
      fetchDoctors();
    }
  }, [authState?.accessToken]);
  return (
    <View className="flex-1 bg-gray-50 pb-10">
      {/* Header */}
      <View
        className="px-6 pt-12 pb-4 shadow-sm"
        style={{ backgroundColor: Colors.bgColor(1) }}
      >
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold text-white">Appointments</Text>
            <Text className="text-white mt-1">
              {appointments.length} upcoming appointments
            </Text>
          </View>
          <TouchableOpacity className="bg-blue-50 p-3 rounded-full">
            <Text className="text-blue-600 font-bold">↻</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Appointments List */}
      <ScrollView
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
      >
        {appointments.map((appointment) => (
          <View
            key={appointment.id}
            className={` bg-white rounded-2xl p-5 mb-4 shadow-sm border-l-4`}
            style={{
              borderLeftColor: Colors.bgColor(1), // custom left border color
            }}
          >
            {/* Time and Date Header */}
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center">
                <View className="bg-blue-50 px-3 py-1 rounded-full mr-3">
                  <Text className="text-blue-600 font-semibold text-sm">
                    {appointment.time}
                  </Text>
                </View>
                <Text className="text-gray-500 font-medium">
                  {appointment.date}
                </Text>
              </View>
            </View>

            {/* Doctor Info */}
            <View className="mb-4">
              <Text className="text-lg font-bold text-gray-900 mb-1">
                {appointment.doctor}
              </Text>
              <Text className="text-blue-600 font-medium text-sm mb-2">
                {appointment.specialty}
              </Text>
              <View className="flex-row items-start">
                <Text className="text-gray-600 text-sm flex-1 leading-5">
                  {appointment.hospital}
                </Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View className="flex-row justify-between pt-3 border-t border-gray-100">
              <TouchableOpacity className="flex-row items-center bg-red-50 px-4 py-2 rounded-lg">
                <AntDesign name="delete" size={16} color="red" />
                <Text className="text-red-500 pl-1 font-medium">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity className="flex-row items-center bg-gray-50 px-4 py-2 rounded-lg">
                <Entypo name="location" size={16} color="black" />
                <Text className="text-gray-600 pl-1 font-medium">
                  Directions
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Add New Appointment Button */}
        {/* <TouchableOpacity
          className="rounded-2xl p-4 mb-6 shadow-sm"
          style={{ backgroundColor: Colors.bgColor(1) }}
        >
          <View className="flex-row items-center justify-center">
            <AntDesign name="pluscircleo" size={18} color="white" />
            <Text className="text-white font-semibold text-lg pl-4">
              Schedule New Appointment
            </Text>
          </View>
        </TouchableOpacity> */}
      </ScrollView>
    </View>
  );
};

export default AppointmentScreen;
