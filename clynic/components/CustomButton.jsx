import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { Colors } from '../constants/Colors';

const CustomButton = ({ text, handlePress, inverted = false, otherStyles }) => {
  return (
    <TouchableOpacity
        style={[{
            backgroundColor: inverted ? "transparent" : Colors.bgColor(0.8),
            borderColor: inverted ? Colors.bgColor(0.8) : "transparent",
            borderWidth: inverted ? 1.5 : 0
        }, otherStyles]}
        className="items-center py-4 rounded-lg my-5"
        activeOpacity={0.8}
        onPress={handlePress}
    >
        <Text
            className="center font-semibold tracking-wider"
            style={{ color: inverted ? Colors.bgColor(0.8) : "#fff" }}
        >
            {text}
        </Text>
    </TouchableOpacity>
  )
}

export default CustomButton;