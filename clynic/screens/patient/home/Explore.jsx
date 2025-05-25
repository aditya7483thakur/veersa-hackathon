import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Image
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Images } from '../../../constants/Images';
import { Colors } from '../../../constants/Colors';
import { useAuth } from '../../../context/AuthContext';
import DoctorCard from '../../../components/RenderDoctorCard';
import FilterModal from '../../../components/FilterModal';
import { doctorService } from '../../../services/doctorService';
import locationService from '../../../services/locationService';

const ExploreScreen = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [location, setLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    fees: null,
    distance: null,
    experience: null,
    sortBy: 'fees',
    sortDirection: 'desc'
  });

  const { accessToken, logout } = useAuth();

  // Get user location
  const getUserLocation = async () => {
    try {
      setLocationLoading(true);
      const userLocation = await locationService.getCurrentLocation();
      setLocation(userLocation);
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Location Error', error.message);
    } finally {
      setLocationLoading(false);
    }
  };

  // Initial fetch of all doctors
  const fetchAllDoctors = async () => {
    try {
      setLoading(true);
      const response = await doctorService.getAllDoctors();
      if (response.success) {
        setDoctors(response.data);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error.message || error);
      Alert.alert('Error', 'Failed to fetch doctors. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Search doctors with filters
  const searchDoctors = async (query = '', currentFilters = filters) => {
    try {
      setLoading(true);

      const searchParams = {
        searchTerm: query,
        ...currentFilters,
        userLat: location?.latitude,
        userLon: location?.longitude,
      };

      // Remove null/undefined values
      Object.keys(searchParams).forEach(key => {
        if (searchParams[key] === null || searchParams[key] === undefined) {
          delete searchParams[key];
        }
      });
      console.log(searchParams)

      // const response = await doctorService.findDoctors(searchParams);
      // setDoctors(response);
    } catch (error) {
      console.error('Error searching doctors:', error.message || error);
      Alert.alert('Error', 'Failed to search doctors. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllDoctors();
    getUserLocation();
  }, []);

  // Handle search input
  const handleSearch = (text) => {
    setSearchQuery(text);

    if (text.trim() === '') {
      // If search is empty and no filters applied, show all doctors
      const hasActiveFilters = Object.values(filters).some(value =>
        value !== null && value !== undefined && value !== ''
      );

      if (!hasActiveFilters) {
        fetchAllDoctors();
      } else {
        searchDoctors('', filters);
      }
    } else {

      searchDoctors(text, filters);

    }
  };

  // Handle refresh
  const onRefresh = () => {
    setRefreshing(true);
    if (searchQuery.trim() === '' && !hasActiveFilters()) {
      fetchAllDoctors();
    } else {
      searchDoctors(searchQuery, filters);
    }
  };

  // Check if filters are active
  const hasActiveFilters = () => {
    return Object.values(filters).some(value =>
      value !== null && value !== undefined && value !== ''
    );
  };

  // Apply filters
  const applyFilters = (newFilters) => {
    setFilters(newFilters);
    setShowFilters(false);
    searchDoctors(searchQuery, newFilters);
  };

  // Reset filters
  const resetFilters = () => {
    const defaultFilters = {
      fees: null,
      distance: null,
      experience: null,
      sortBy: 'fees',
      sortDirection: 'desc'
    };
    setFilters(defaultFilters);

    // If no search query, fetch all doctors, otherwise search with no filters
    if (searchQuery.trim() === '') {
      fetchAllDoctors();
    } else {
      searchDoctors(searchQuery, defaultFilters);
    }
  };

  if (loading && doctors.length === 0) {
    return (
      <SafeAreaView
        className="flex-1"
        style={{ backgroundColor: Colors.bgColor(1) }}
      >
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={Colors.bgWhite(1)} />
          <Text className="mt-4 text-white text-lg">
            Loading doctors...
          </Text>
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
              <View className="flex-row gap-1 items-center">
                <Image source={Images.logo} className="w-10 h-10" resizeMode='contain' />
                <Text className="text-2xl font-bold text-white">
                  Clynic
                </Text>
              </View>
              <Text className="text-white opacity-80">
                Your Health, Our Priority
              </Text>
            </View>
<<<<<<< HEAD:clynic/screens/patient/Explore.jsx

            <View className="flex-row items-center space-x-3">
=======
            
            <View className="flex-row items-center gap-2">
>>>>>>> main:clynic/screens/patient/home/Explore.jsx
              {/* Location Button */}
              <TouchableOpacity
                onPress={getUserLocation}
                className="w-10 h-10 rounded-full items-center justify-center"
                style={{ backgroundColor: Colors.bgWhite(0.2), borderColor: Colors.bgWhite(0.6), borderWidth: 1 }}
                disabled={locationLoading}
              >
                {locationLoading ? (
                  <ActivityIndicator size="small" color={Colors.bgWhite(1)} />
                ) : (
                  <Ionicons
                    name={location ? "location" : "location-outline"}
                    size={18}
                    color={Colors.bgWhite(1)}
                  />
                )}
              </TouchableOpacity>

              {/* Logout Button */}
              <TouchableOpacity
                onPress={() => {
                  Alert.alert("Confirm Sign out", "Are you sure you want to sign out?", [{
                    text: "Okay",
                    onPress: logout
                  }], {cancelable: true})
                }}
                className="w-10 h-10 rounded-full items-center justify-center"
                style={{ backgroundColor: Colors.bgWhite(0.2), borderColor: Colors.bgWhite(0.6), borderWidth: 1 }}
              >
                <Ionicons
                  name="power"
                  size={20}
                  color={Colors.bgWhite(1)}
                />
              </TouchableOpacity>
            </View>
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
              backgroundColor: Colors.bgWhite(0.9)
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
            <TouchableOpacity onPress={() => setShowFilters(true)}>
              <Ionicons
                name="options"
                size={20}
                color={hasActiveFilters() ? "#4CAF50" : Colors.bgColor(1)}
              />
            </TouchableOpacity>
          </View>
<<<<<<< HEAD:clynic/screens/patient/Explore.jsx

=======
          
          {/* Location Status */}
          {location && (
            <View className="flex-row items-center mt-2 px-2">
              <Ionicons name="location" size={16} color="#fff" />
              <Text className="text-white opacity-80 ml-1 text-sm">
                Location enabled - showing nearby results
              </Text>
            </View>
          )}

          {/* Active Filters Indicator */}
          {hasActiveFilters() && (
            <View className="flex-row items-center mt-2 px-2">
              <Ionicons name="funnel" size={16} color="#fff" />
              <Text className="text-white opacity-80 ml-1 text-sm">
                Filters applied
              </Text>
              <TouchableOpacity onPress={resetFilters} className="ml-2">
                <Text className="text-white underline text-sm">Clear</Text>
              </TouchableOpacity>
            </View>
          )}
>>>>>>> main:clynic/screens/patient/home/Explore.jsx
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

          {doctors.length === 0 ? (
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
              {(searchQuery.length > 0 || hasActiveFilters()) && (
                <Text
                  className="text-sm mt-2 text-center px-8"
                  style={{ color: Colors.black(0.4) }}
                >
                  Try adjusting your search terms or filters
                </Text>
              )}
            </View>
          ) : (
            <FlatList
              data={doctors}
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

        {/* Filter Modal */}
        <FilterModal
          visible={showFilters}
          onClose={() => setShowFilters(false)}
          filters={filters}
          onApplyFilters={applyFilters}
          onResetFilters={resetFilters}
        />
      </SafeAreaView>
    </>
  );
};

export default ExploreScreen;
