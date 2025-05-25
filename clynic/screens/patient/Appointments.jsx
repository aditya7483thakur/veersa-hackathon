import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  Linking,
  Alert,
} from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { Colors } from "../../constants/Colors";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { appointmentService } from "../../services/appointmentService";

// Skeleton Loading Component
const AppointmentSkeleton = () => (
  <View
    className="bg-white rounded-2xl p-5 mb-4 shadow-sm border-l-4"
    style={{ borderLeftColor: Colors.bgColor(0.3) }}
  >
    {/* Time and Date Skeleton */}
    <View className="flex-row items-center justify-between mb-3">
      <View className="flex-row items-center">
        <View className="bg-gray-200 h-6 w-20 rounded-full mr-3" />
        <View className="bg-gray-200 h-4 w-24 rounded" />
      </View>
    </View>

    {/* Doctor Info Skeleton */}
    <View className="mb-4">
      <View className="bg-gray-200 h-6 w-32 rounded mb-2" />
      <View className="bg-gray-200 h-4 w-24 rounded mb-2" />
      <View className="bg-gray-200 h-4 w-48 rounded" />
    </View>

    {/* Action Buttons Skeleton */}
    <View className="flex-row justify-between pt-3 border-t border-gray-100">
      <View className="bg-gray-200 h-8 w-20 rounded-lg" />
      <View className="bg-gray-200 h-8 w-24 rounded-lg" />
    </View>
  </View>
);

const AppointmentScreen = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const { authState } = useAuth();

  const fetchAppointments = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_BACKED_API_URL}/appointment/upcoming`
      );
      setAppointments(response.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setError("Failed to load appointments. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const cancelAppointment = async (params) => {
    try {
      setLoading(true);
      const response = await appointmentService.cancelAppointment(params);

      if (response.success) {
        Alert.alert("Success", "Appointment deleted successfully.");
        fetchAppointments();
      }
    } catch (error) {
      console.error("Error deleting appointment:", error.message || error);
      Alert.alert("Error", "Failed to deleting appointment. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (authState?.accessToken) {
      fetchAppointments();
    }
  }, []);

  const handleRefresh = () => {
    fetchAppointments(true);
  };

  const handleGeoLocation = ({ latitude, longitude }) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  // Loading Screen
  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 pb-10">
        {/* Header */}
        <View
          className="px-6 pt-12 pb-4 shadow-sm"
          style={{ backgroundColor: Colors.bgColor(1) }}
        >
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-2xl font-bold text-white">
                Appointments
              </Text>
              <View className="bg-white/20 h-4 w-32 rounded mt-1" />
            </View>
            <TouchableOpacity className="bg-blue-50 p-3 rounded-full" disabled>
              <ActivityIndicator size="small" color="#3B82F6" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Loading Skeletons */}
        <ScrollView
          className="flex-1 px-4 pt-4"
          showsVerticalScrollIndicator={false}
        >
          {[1, 2, 3].map((item) => (
            <AppointmentSkeleton key={item} />
          ))}
        </ScrollView>
      </View>
    );
  }

  // Error Screen
  if (error && !refreshing) {
    return (
      <View className="flex-1 bg-gray-50 pb-10">
        {/* Header */}
        <View
          className="px-6 pt-12 pb-4 shadow-sm"
          style={{ backgroundColor: Colors.bgColor(1) }}
        >
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-2xl font-bold text-white">
                Appointments
              </Text>
              <Text className="text-white mt-1">
                Error loading appointments
              </Text>
            </View>
            <TouchableOpacity
              className="bg-blue-50 p-3 rounded-full"
              onPress={() => fetchAppointments()}
            >
              <Text className="text-blue-600 font-bold">↻</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Error Message */}
        <View className="flex-1 justify-center items-center px-6">
          <AntDesign name="exclamationcircleo" size={64} color="#EF4444" />
          <Text className="text-gray-800 text-lg font-semibold mt-4 text-center">
            Oops! Something went wrong
          </Text>
          <Text className="text-gray-600 text-center mt-2 mb-6">{error}</Text>
          <TouchableOpacity
            className="px-6 py-3 rounded-lg"
            style={{ backgroundColor: Colors.bgColor(1) }}
            onPress={() => fetchAppointments()}
          >
            <Text className="text-white font-semibold">Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50 pb-10">
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
          <TouchableOpacity
            className="bg-blue-50 w-10 h-10 p-2 items-center justify-center rounded-full"
            onPress={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? (
              <ActivityIndicator size="small" color="#3B82F6" />
            ) : (
              <Text
                className="font-bold"
                style={{ color: Colors.bgColor(0.8) }}
              >
                <Ionicons name="reload" size={15} color={Colors.bgColor(1)} />
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Appointments List */}
      <ScrollView
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
      >
        {appointments.length === 0 ? (
          // Empty State
          <View className="flex-1 justify-center items-center py-20">
            <AntDesign name="calendar" size={64} color="#9CA3AF" />
            <Text className="text-gray-500 text-lg font-semibold mt-4">
              No upcoming appointments
            </Text>
            <Text className="text-gray-400 text-center mt-2">
              Schedule your first appointment to get started
            </Text>
          </View>
        ) : (
          appointments.map((appointment) => (
            <View
              key={appointment._id}
              className="bg-white rounded-2xl p-5 mb-4 shadow-sm border-l-4"
              style={{
                borderLeftColor: Colors.bgColor(1),
              }}
            >
              {/* Time and Date Header */}
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center">
                  <View
                    className="px-3 py-1 rounded-full mr-3"
                    style={{ backgroundColor: Colors.bgColor(0.1) }}
                  >
                    <Text
                      className="font-semibold text-sm"
                      style={{ color: Colors.bgColor(0.8) }}
                    >
                      {appointment.timeSlot}
                    </Text>
                  </View>
                  <Text className="text-gray-500 font-medium">
                    {appointment.appointmentDate}
                  </Text>
                </View>
              </View>

              {/* Doctor Info */}
              <View className="mb-4">
                <Text className="text-lg font-bold text-gray-900 mb-1">
                  {appointment.doctor_id.doctorName}
                </Text>
                <Text className="text-gray-400 text-xs flex-1 leading-5">
                  {appointment.doctor_id.description}.
                </Text>
                <Text
                  className="font-medium text-sm mb-2"
                  style={{ color: Colors.bgColor(0.8) }}
                >
                  {appointment.doctor_id.specialization}
                </Text>
                <View className="flex-row items-start">
                  <Text className="text-gray-600 text-sm flex-1 leading-5">
                    {appointment.doctor_id.hospitalName}
                  </Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View className="flex-row justify-between pt-3 border-t border-gray-100">
                <TouchableOpacity
                  onPress={() => cancelAppointment(appointment._id)}
                  className="flex-row items-center bg-red-50 px-4 py-2 rounded-lg"
                >
                  <AntDesign name="delete" size={16} color="red" />
                  <Text className="text-red-500 pl-1 font-medium">Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="flex-row items-center bg-gray-100 px-4 py-2 rounded-lg"
                  activeOpacity={0.7}
                  onPress={() =>
                    handleGeoLocation(
                      appointment?.doctor_id?.location?.coordinates[1],
                      appointment?.doctor_id?.location?.coordinates[0]
                    )
                  }
                >
                  <Entypo name="location" size={16} color="black" />
                  <Text className="text-gray-600 pl-1 font-medium">
                    Directions
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AppointmentScreen;
