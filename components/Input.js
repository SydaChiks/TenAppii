import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TextInput, View } from "react-native";
import tw from "twrnc";

const Input = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  icon,
  error,
  keyboardType = "default",
  ...rest
}) => {
  return (
    <View style={tw`mb-4`}>
      {label && <Text style={tw`text-gray-600 mb-1`}>{label}</Text>}
      <View
        style={tw`flex-row items-center border rounded-md px-3 py-2  h-12 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      >
        {icon && (
          <Ionicons name={icon} size={20} style={tw`mr-2 text-gray-500`} />
        )}
        <TextInput
          style={tw`flex-1 text-sm `}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          {...rest}
        />
      </View>
      {error && <Text style={tw`text-red-500 mt-1 text-sm`}>{error}</Text>}
    </View>
  );
};

export default Input;
