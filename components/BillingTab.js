import { Ionicons } from "@expo/vector-icons";
import React, { useContext } from "react";
import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "twrnc";
import { Card } from "../components";
import { ThemeContext } from "../context/ThemeContext";

const BillingTab = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";
  const screenWidth = Dimensions.get("window").width;

  // Simulated billing data
  const billingData = {
    totalExpectedRent: 1_760_000,
    totalRentCollected: 1_540_000,
    collectionRate: 87.5,
    pendingInvoices: 5,
    overdueInvoices: 2,
    recentInvoices: [
      { id: "1", tenant: "John Doe", amount: 440_450, status: "Paid" },
      { id: "2", tenant: "Jane Smith", amount: 380_250, status: "Overdue" },
      { id: "3", tenant: "Mike Johnson", amount: 420_000, status: "Pending" },
      { id: "4", tenant: "Sarah Williams", amount: 395_000, status: "Paid" },
    ],
  };

  const renderBillingMetric = (label, value, icon, color) => (
    <View
      style={[
        tw`flex-row items-center p-4 rounded-lg mb-2`,
        {
          backgroundColor: isDark
            ? `rgba(${getColorRGB(color)}, 0.2)`
            : `rgba(${getColorRGB(color)}, 0.1)`,
          width:
            screenWidth > 600 ? `${(screenWidth - 64) / 2 - 16}px` : "100%",
        },
      ]}
    >
      <View style={tw`mr-4`}>
        <Ionicons name={icon} size={24} color={`rgb(${getColorRGB(color)})`} />
      </View>
      <View>
        <Text style={tw`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
          {label}
        </Text>
        <Text
          style={tw`text-lg font-bold ${
            isDark ? "text-white" : "text-gray-800"
          }`}
          adjustsFontSizeToFit
          numberOfLines={1}
        >
          {typeof value === "number" ? `R ${value.toLocaleString()}` : value}
        </Text>
      </View>
    </View>
  );

  // Helper function to get RGB values for colors
  const getColorRGB = (color) => {
    const colorMap = {
      blue: "59, 130, 246",
      green: "34, 197, 94",
      purple: "124, 58, 237",
      orange: "249, 115, 22",
    };
    return colorMap[color] || "0, 0, 0";
  };

  return (
    <ScrollView style={tw`flex-1 px-4 pt-4`} contentContainerStyle={tw`pb-8`}>
      {/* Billing Metrics Grid */}
      <View
        style={[
          tw`flex-row flex-wrap justify-between mb-4`,
          {
            flexDirection: screenWidth > 600 ? "row" : "column",
            alignItems: screenWidth > 600 ? "flex-start" : "stretch",
          },
        ]}
      >
        {[
          {
            label: "Total Expected Rent",
            value: billingData.totalExpectedRent,
            icon: "cash-outline",
            color: "blue",
          },
          {
            label: "Total Rent Collected",
            value: billingData.totalRentCollected,
            icon: "download-outline",
            color: "green",
          },
          {
            label: "Collection Rate",
            value: `${billingData.collectionRate}%`,
            icon: "stats-chart-outline",
            color: "purple",
          },
          {
            label: "Pending Invoices",
            value: billingData.pendingInvoices,
            icon: "document-text-outline",
            color: "orange",
          },
        ].map((metric, index) => (
          <View
            key={index}
            style={[
              tw`mb-2`,
              {
                width:
                  screenWidth > 600
                    ? `${(screenWidth - 64) / 2 - 16}px`
                    : "100%",
              },
            ]}
          >
            {renderBillingMetric(
              metric.label,
              metric.value,
              metric.icon,
              metric.color
            )}
          </View>
        ))}
      </View>

      {/* Recent Invoices Card */}
      <Card style="mb-6">
        <View style={tw`p-5`}>
          <View style={tw`flex-row justify-between items-center mb-4`}>
            <Text
              style={tw`text-lg font-bold ${
                isDark ? "text-white" : "text-gray-800"
              }`}
            >
              Recent Invoices
            </Text>
            <TouchableOpacity>
              <Text style={tw`text-blue-600`}>View All</Text>
            </TouchableOpacity>
          </View>
          {billingData.recentInvoices.map((invoice) => (
            <View
              key={invoice.id}
              style={tw`flex-row justify-between items-center py-3 border-b ${
                isDark ? "border-gray-700" : "border-gray-100"
              }`}
            >
              <View>
                <Text
                  style={tw`font-bold ${
                    isDark ? "text-white" : "text-gray-800"
                  }`}
                >
                  {invoice.tenant}
                </Text>
                <Text style={tw`text-sm text-gray-600`}>
                  R {invoice.amount.toLocaleString()}
                </Text>
              </View>
              <View
                style={tw`px-3 py-1 rounded-full ${
                  invoice.status === "Paid"
                    ? "bg-green-100"
                    : invoice.status === "Overdue"
                    ? "bg-orange-100"
                    : "bg-blue-100"
                }`}
              >
                <Text
                  style={tw`${
                    invoice.status === "Paid"
                      ? "text-green-700"
                      : invoice.status === "Overdue"
                      ? "text-orange-700"
                      : "text-blue-700"
                  } text-xs font-bold`}
                >
                  {invoice.status}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </Card>
    </ScrollView>
  );
};

export default BillingTab;
