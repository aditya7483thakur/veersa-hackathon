import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView
} from 'react-native';
import { Colors } from '../constants/Colors';
import Slider from '@react-native-community/slider';

const FilterModal = ({ 
  visible, 
  onClose, 
  filters, 
  onApplyFilters, 
  onResetFilters 
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const updateFilter = (key, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
  };

  const handleReset = () => {
    const defaultFilters = {
      fees: null,
      distance: null,
      experience: null,
      sortBy: 'fees',
      sortDirection: 'desc'
    };
    setLocalFilters(defaultFilters);
    onResetFilters();
  };

  const removeFilter = (filterKey) => {
    setLocalFilters(prev => ({
      ...prev,
      [filterKey]: null
    }));
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black bg-opacity-50">
        <View className="bg-white rounded-t-3xl max-h-5/6">
          <ScrollView className="p-6">
            {/* Header */}
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-2xl font-bold" style={{ color: Colors.bgColor(1) }}>
                Filters
              </Text>
              <TouchableOpacity onPress={onClose}>
                <Text className="text-lg" style={{ color: Colors.bgColor(1) }}>
                  Close
                </Text>
              </TouchableOpacity>
            </View>

            {/* Fees Filter */}
            <View className="mb-8">
              <Text className="text-lg font-semibold mb-4" style={{ color: Colors.black(0.8) }}>
                Fees under
              </Text>
              
              <View className="items-center">
                <Slider
                  style={{ width: '100%', height: 40 }}
                  minimumValue={500}
                  maximumValue={10000}
                  step={100}
                  value={localFilters.fees || 1590}
                  onValueChange={(value) => updateFilter('fees', value)}
                  minimumTrackTintColor={Colors.bgColor(1)}
                  maximumTrackTintColor={Colors.black(0.2)}
                  thumbStyle={{ backgroundColor: Colors.bgColor(1) }}
                />
                
                <View className="bg-gray-100 rounded-xl px-4 py-3 mt-2 min-w-24 items-center">
                  <Text className="text-lg font-bold" style={{ color: Colors.bgColor(1) }}>
                    ₹{localFilters.fees || 1590}
                  </Text>
                </View>
              </View>
              
              <TouchableOpacity
                onPress={() => removeFilter('fees')}
                className="mt-3"
              >
                <Text className="text-red-500 text-center">Remove Fees Filter</Text>
              </TouchableOpacity>
            </View>

            {/* Distance Filter */}
            <View className="mb-8">
              <Text className="text-lg font-semibold mb-4" style={{ color: Colors.black(0.8) }}>
                Distance Under
              </Text>
              
              <View className="items-center">
                <Slider
                  style={{ width: '100%', height: 40 }}
                  minimumValue={1}
                  maximumValue={100}
                  step={1}
                  value={localFilters.distance || 21}
                  onValueChange={(value) => updateFilter('distance', value)}
                  minimumTrackTintColor={Colors.bgColor(1)}
                  maximumTrackTintColor={Colors.black(0.2)}
                  thumbStyle={{ backgroundColor: Colors.bgColor(1) }}
                />
                
                <View className="bg-gray-100 rounded-xl px-4 py-3 mt-2 min-w-24 items-center">
                  <Text className="text-lg font-bold" style={{ color: Colors.bgColor(1) }}>
                    {localFilters.distance || 21} km
                  </Text>
                </View>
              </View>
              
              <TouchableOpacity
                onPress={() => removeFilter('distance')}
                className="mt-3"
              >
                <Text className="text-red-500 text-center">Remove Distance Filter</Text>
              </TouchableOpacity>
            </View>

            {/* Experience Filter */}
            <View className="mb-8">
              <Text className="text-lg font-semibold mb-4" style={{ color: Colors.black(0.8) }}>
                Experience Over
              </Text>
              
              <View className="items-center">
                <Slider
                  style={{ width: '100%', height: 40 }}
                  minimumValue={0}
                  maximumValue={40}
                  step={1}
                  value={localFilters.experience || 14}
                  onValueChange={(value) => updateFilter('experience', value)}
                  minimumTrackTintColor={Colors.bgColor(1)}
                  maximumTrackTintColor={Colors.black(0.2)}
                  thumbStyle={{ backgroundColor: Colors.bgColor(1) }}
                />
                
                <View className="bg-gray-100 rounded-xl px-4 py-3 mt-2 min-w-24 items-center">
                  <Text className="text-lg font-bold" style={{ color: Colors.bgColor(1) }}>
                    {localFilters.experience || 14} years
                  </Text>
                </View>
              </View>
              
              <TouchableOpacity
                onPress={() => removeFilter('experience')}
                className="mt-3"
              >
                <Text className="text-red-500 text-center">Remove Experience Filter</Text>
              </TouchableOpacity>
            </View>

            {/* Sort By Section */}
            <View className="mb-8">
              <Text className="text-lg font-semibold mb-4" style={{ color: Colors.black(0.8) }}>
                Sort By
              </Text>
              
              <View className="flex-row justify-between mb-4">
                {[
                  { key: 'fees', label: 'Fees' },
                  { key: 'distance', label: 'Distance' },
                  { key: 'experience', label: 'Experience' }
                ].map((option) => (
                  <TouchableOpacity
                    key={option.key}
                    onPress={() => updateFilter('sortBy', option.key)}
                    className={`flex-1 mx-1 py-3 rounded-full ${
                      localFilters.sortBy === option.key 
                        ? 'bg-blue-500' 
                        : 'bg-gray-200'
                    }`}
                  >
                    <Text className={`text-center font-medium ${
                      localFilters.sortBy === option.key 
                        ? 'text-white' 
                        : 'text-gray-700'
                    }`}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <View className="flex-row justify-between mb-4">
                {[
                  { key: 'asc', label: 'Ascending' },
                  { key: 'desc', label: 'Descending' }
                ].map((direction) => (
                  <TouchableOpacity
                    key={direction.key}
                    onPress={() => updateFilter('sortDirection', direction.key)}
                    className={`flex-1 mx-1 py-3 rounded-full ${
                      localFilters.sortDirection === direction.key 
                        ? 'bg-blue-500' 
                        : 'bg-gray-200'
                    }`}
                  >
                    <Text className={`text-center font-medium ${
                      localFilters.sortDirection === direction.key 
                        ? 'text-white' 
                        : 'text-gray-700'
                    }`}>
                      {direction.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <TouchableOpacity
                onPress={() => {
                  updateFilter('sortBy', 'fees');
                  updateFilter('sortDirection', 'desc');
                }}
                className="mt-2"
              >
                <Text className="text-red-500 text-center">Remove Sort Filter</Text>
              </TouchableOpacity>
            </View>

            {/* Action Buttons */}
            <View className="space-y-3">
              <TouchableOpacity
                onPress={handleApply}
                className="rounded-2xl py-4 items-center"
                style={{ backgroundColor: Colors.bgColor(1) }}
              >
                <Text className="text-white text-lg font-bold">Apply Filters</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={handleReset}
                className="rounded-2xl py-4 items-center border-2"
                style={{ borderColor: Colors.bgColor(1) }}
              >
                <Text className="text-lg font-bold" style={{ color: Colors.bgColor(1) }}>
                  Reset All Filters
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default FilterModal;