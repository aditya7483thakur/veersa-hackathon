import React from 'react';
import { View, Text } from 'react-native';
import { Colors } from '../constants/Colors';

const Indicator = ({ value, focused, color }) => {
  return (
    <View style={{ alignItems: 'center' }}>
      {/* Your indicator content */}
      <Text style={{ color, fontSize: 10, color: focused ? Colors.bgColor(0.8) : Colors.black(0.8) }}>
        {value}
      </Text>
    </View>
  );
};

export default Indicator; 