import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Image,
  RefreshControl,
  ActivityIndicator,
<<<<<<< HEAD
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons"; // or react-native-vector-icons
import { Colors } from "../../constants/Colors";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import DoctorCard from "../../components/DoctorCard";
=======
  Alert
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons'; // or react-native-vector-icons
import { Colors } from '../../constants/Colors';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import DoctorCard from '../../components/RenderDoctorCard';
import { Images } from '../../constants/Images';
>>>>>>> sid

const ExploreScreen = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
<<<<<<< HEAD
  const { accessToken, logout } = useAuth();
=======
  const { accessToken, logout} = useAuth();
>>>>>>> sid

  // Fetch doctors from API
  const fetchDoctors = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_BACKED_API_URL}/doctor/get-doctors`
      );

      const result = response.data;
      if (result.success) {
        setDoctors(result.data);
        setFilteredDoctors(result.data);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error.message || error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  useEffect(() => {
    fetchDoctors();
  }, []);

  // Handle search
  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text.trim() === "") {
      setFilteredDoctors(doctors);
    } else {
      const filtered = doctors.filter(
        (doctor) =>
          doctor.doctorName?.toLowerCase().includes(text.toLowerCase()) ||
          doctor.specialization?.toLowerCase().includes(text.toLowerCase()) ||
          doctor.hospitalName?.toLowerCase().includes(text.toLowerCase()) ||
          doctor.city?.toLowerCase().includes(text.toLowerCase()) ||
          doctor.state?.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredDoctors(filtered);
    }
  };

  // Handle refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchDoctors();
  };

  // Calculate distance (placeholder - replace with actual distance calculation)
  const calculateDistance = () => {
    return (Math.random() * 10).toFixed(1);
  };

  // Render doctor card

  if (loading) {
    return (
      <SafeAreaView
        className="flex-1"
        style={{ backgroundColor: Colors.bgColor(1) }}
      >
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={Colors.bgWhite(1)} />
          <Text className="mt-4 text-white text-lg">Loading doctors...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <>
      <StatusBar backgroundColor={Colors.bgColor(1)} barStyle="light-content" />
      <SafeAreaView
        className="flex-1 pt-5"
        style={{ backgroundColor: Colors.bgColor(1) }}
      >
        {/* Header */}
        <View className="px-6 pb-6">
          <View className="flex-row justify-between items-center mb-6">
            <View>
<<<<<<< HEAD
              <Text className="text-2xl font-bold text-white">MediLink</Text>
=======
              <View className="flex-row ml-[-10] items-center justify-center gap-1">
                <Image source={Images.logo} className="w-12 h-12 ml-[-25%]" resizeMode='contain' />
                <Text className="text-2xl font-bold text-white">
                  Clynic
                </Text>
              </View>
>>>>>>> sid
              <Text className="text-white opacity-80">
                Your Health, Our Priority
              </Text>
            </View>
<<<<<<< HEAD
            <TouchableOpacity>
              <Text onPress={logout}>logout</Text>
            </TouchableOpacity>
            <TouchableOpacity className="w-10 h-10 rounded-full bg-white bg-opacity-20 items-center justify-center">
              <Ionicons name="power" size={20} color={Colors.bgWhite(1)} />
=======
            <TouchableOpacity
              className="w-12 h-12 rounded-full items-center justify-center"
              style={{ backgroundColor: Colors.bgWhite(0.2), borderColor: Colors.bgWhite(0.5), borderWidth: 1 }}
              onPress={() => {
                Alert.alert("Confirm Sign out", "Sure you want to sign out?", [
                {
                  text: "OK",
                  onPress: logout
                }
                ], { cancelable: true });
              }}
            >
              <Ionicons
                name="power"
                size={20}
                color={Colors.bgWhite(1)}
              />
>>>>>>> sid
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View
            className="rounded-xl px-4 py-1 flex-row items-center"
            style={{
              shadowColor: Colors.black(0.1),
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 3,
              backgroundColor: Colors.bgWhite(0.95)
            }}
          >
            <Ionicons name="search" size={20} color={Colors.black(0.4)} />
            <TextInput
              className="flex-1 ml-3 text-base"
              placeholder="Search doctors, specialties..."
              placeholderTextColor={Colors.black(0.4)}
              value={searchQuery}
              onChangeText={handleSearch}
            />
            <TouchableOpacity>
              <Ionicons name="options" size={20} color={Colors.bgColor(1)} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Available Doctors Section */}
        <View
          className="flex-1 rounded-t-3xl pt-6"
          style={{ backgroundColor: Colors.bgWhite(0.95) }}
        >
          <Text
            className="text-xl font-bold mb-4 px-5"
            style={{ color: Colors.bgColor(1) }}
          >
            Available Doctors
          </Text>

          {filteredDoctors.length === 0 ? (
            <View className="flex-1 justify-center items-center">
              <Ionicons
                name="medical-outline"
                size={64}
                color={Colors.black(0.3)}
              />
              <Text
                className="text-lg mt-4"
                style={{ color: Colors.black(0.5) }}
              >
                No doctors found
              </Text>
              {searchQuery.length > 0 && (
                <Text
                  className="text-sm mt-2 text-center px-8"
                  style={{ color: Colors.black(0.4) }}
                >
                  Try adjusting your search terms
                </Text>
              )}
            </View>
          ) : (
            <FlatList
              data={filteredDoctors}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => <DoctorCard item={item} />}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={[Colors.bgColor(1)]}
                />
              }
              contentContainerStyle={{ paddingBottom: 50 }}
            />
          )}
        </View>
      </SafeAreaView>
    </>
  );
};

export default ExploreScreen;
