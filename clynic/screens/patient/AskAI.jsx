import { View, Text, StatusBar, TouchableOpacity, ActivityIndicator, TextInput, FlatList, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import locationService from '../../services/locationService';
import { Ionicons } from '@expo/vector-icons';
import DoctorCard from '../../components/DoctorCard';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const AskAIScreen = () => {
  const { location, setLocation } = useAuth();
  const [locationLoading, setLocationLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [firstAid, setFirstAid] = useState("");
  // Replace with your actual API base URL

  const searchDoctors = async (query) => {
    if (!query.trim()) {
      setDoctors([]);
      setHasSearched(false);
      return;
    }

    try {
      setSearchLoading(true);

      // Build query parameters
      const params = new URLSearchParams({
        text: query.trim()
      });

      // Add location if available
      if (location?.latitude && location?.longitude) {
        params.append('latitude', location.latitude.toString());
        params.append('longitude', location.longitude.toString());
      }


      const response = await axios.get(`${process.env.EXPO_PUBLIC_BACKED_API_URL}/doctor/ask-ai?${params.toString()}`);
      const { doctors, firstAid } = response.data;
      setFirstAid(firstAid)
      setDoctors(doctors);
      setHasSearched(true);

    } catch (error) {
      console.error('Error searching doctors:', error);
      Alert.alert('Search Error', 'Failed to search doctors. Please try again.');
      setDoctors([]);
      setHasSearched(true);
    } finally {
      setSearchLoading(false);
    }
  };

  // Debounced search function
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchDoctors(searchQuery);
    }, 500); // 500ms delay

    return () => clearTimeout(timeoutId);
  }, [searchQuery, location]);



  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const renderDoctorItem = ({ item }) => (
    <DoctorCard item={item} isAiCard={true} />
  );

  const renderEmptyComponent = () => {
    if (searchLoading) {
      return (
        <View className="flex-1 justify-center items-center py-20">
          <ActivityIndicator size="large" color={Colors.bgColor(1)} />
          <Text className="mt-4 text-base" style={{ color: Colors.black(0.6) }}>
            Searching doctors...
          </Text>
        </View>
      );
    }

    if (hasSearched && doctors.length === 0 && searchQuery.trim()) {
      return (
        <View className="flex-1 justify-center items-center py-20">
          <Ionicons name="search" size={64} color={Colors.black(0.3)} />
          <Text className="mt-4 text-lg font-semibold" style={{ color: Colors.black(0.6) }}>
            No doctors found
          </Text>
          <Text className="mt-2 text-center px-8" style={{ color: Colors.black(0.4) }}>
            Try searching with different keywords or specialties
          </Text>
        </View>
      );
    }

    if (!searchQuery.trim()) {
      return (
        <View className="flex-1 justify-center items-center py-20">
          <Ionicons name="medical" size={64} color={Colors.black(0.3)} />
          <Text className="mt-4 text-lg font-semibold" style={{ color: Colors.black(0.6) }}>
            Search for doctors
          </Text>
          <Text className="mt-2 text-center px-8" style={{ color: Colors.black(0.4) }}>
            Enter a doctor's name, specialty, or condition to find the right healthcare provider
          </Text>
        </View>
      );
    }

    return null;
  };

  return (
    <>
      <StatusBar backgroundColor={Colors.bgColor(1)} barStyle="light-content" />
      <SafeAreaView
        className="flex-1"
        style={{ backgroundColor: Colors.bgColor(1) }}
      >
        <View className="px-6 pt-5 pb-4">
          <View className="flex-row justify-between items-center mb-6">
            <View className="flex-row items-center space-x-3">

            </View>
          </View>

          {/* Search Bar */}
          <View
            className="rounded-xl px-4 py-3 flex-row items-center"
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
              placeholder="Search doctors, specialties, conditions..."
              placeholderTextColor={Colors.black(0.4)}
              value={searchQuery}
              onChangeText={handleSearch}
              returnKeyType="search"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery("")}
                className="ml-2"
              >
                <Ionicons name="close-circle" size={20} color={Colors.black(0.4)} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Results Section */}
        <View className="flex-1" style={{ backgroundColor: Colors.bgWhite(0.95) }}>
          {firstAid && (
            <View className="bg-blue-50 p-3 rounded-lg mx-4 mt-2">
              <Text className="text-blue-800 font-medium">AI First-Aid Tip:</Text>
              <Text className="text-blue-700">{firstAid}</Text>
            </View>
          )}

          <FlatList
            data={doctors}
            renderItem={renderDoctorItem}
            keyExtractor={(item, index) => item.id?.toString() || index.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: 16, paddingBottom: 20 }}
            ListEmptyComponent={renderEmptyComponent}
            refreshing={searchLoading}
            onRefresh={() => searchDoctors(searchQuery)}
          />
        </View>
      </SafeAreaView>
    </>
  )
}

export default AskAIScreen