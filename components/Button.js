import React from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";
import tw from "twrnc";

const Button = ({
  title,
  onPress,
  style,
  textStyle,
  loading = false,
  disabled = false,
  variant = "primary",
}) => {
  const getButtonStyle = () => {
    if (variant === "primary") {
      return "bg-blue-500";
    } else if (variant === "secondary") {
      return "bg-green-500";
    } else if (variant === "outline") {
      return "bg-transparent border border-blue-500";
    }
    return "bg-blue-500";
  };

  const getTextStyle = () => {
    if (variant === "outline") {
      return "text-blue-500";
    }
    return "text-white";
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={tw`py-3 px-4 rounded-lg justify-center items-center ${getButtonStyle()} ${
        disabled ? "opacity-50" : ""
      } ${style}`}
    >
      {loading ? (
        <ActivityIndicator color={variant === "outline" ? "#3498db" : "#fff"} />
      ) : (
        <Text style={tw`font-semibold ${getTextStyle()} ${textStyle}`}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;
