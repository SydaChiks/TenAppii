import React, { useContext } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";
import { ThemeContext } from "../context/ThemeContext";
const Card = ({
  children,
  title,
  onPress,
  style,
  titleStyle,
  actionText,
  onActionPress,
}) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.8 : 1}
      style={tw`bg-white rounded-lg shadow-sm p-4 m-2 ${style}`}
    >
      {title && (
        <View style={tw`flex-row justify-between items-center mb-2`}>
          <Text style={tw`font-semibold text-lg ${titleStyle}`}>{title}</Text>
          {actionText && (
            <TouchableOpacity onPress={onActionPress}>
              <Text style={tw`text-blue-500`}>{actionText}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      {children}
    </TouchableOpacity>
  );
};

export default Card;
