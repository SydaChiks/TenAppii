import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
import Card from "../components/Card";
import { useTheme } from "../context/ThemeContext";

const PaymentsScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Theme-specific styles
  const styles = {
    background: isDark ? "bg-gray-900" : "bg-gray-50",
    text: isDark ? "text-white" : "text-gray-800",
    secondaryText: isDark ? "text-gray-300" : "text-gray-600",
    cardBackground: isDark ? "bg-gray-800" : "bg-white",
    headerBackground: isDark ? "bg-blue-900" : "bg-blue-500",
    inputBackground: isDark ? "bg-gray-700" : "bg-gray-100",
    inputText: isDark ? "text-white" : "text-gray-900",
    borderColor: isDark ? "border-gray-700" : "border-gray-200",
    tabBackground: isDark ? "bg-gray-700" : "bg-white",
    tabActiveBackground: isDark ? "bg-gray-600" : "bg-blue-50",
    tabActiveBorder: isDark ? "border-blue-400" : "border-blue-500",
    tabText: isDark ? "text-gray-300" : "text-gray-500",
    tabActiveText: isDark ? "text-blue-400" : "text-blue-500",
    paymentButton: isDark ? "bg-blue-700" : "bg-blue-600",
    uploadButton: isDark ? "bg-gray-700" : "bg-gray-200",
    uploadIcon: isDark ? "#d1d5db" : "#4B5563",
    paymentMethodBg: isDark ? "bg-gray-700" : "bg-gray-50",
    divider: isDark ? "border-gray-700" : "border-gray-100",
    invoiceIconBg: isDark ? "bg-gray-700" : "bg-blue-100",
    invoiceIcon: isDark ? "#93c5fd" : "#3B82F6",
    uploadSectionBg: isDark ? "bg-gray-700" : "bg-blue-100",
    uploadSectionIcon: isDark ? "#93c5fd" : "#3B82F6",
  };

  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [selectedTab, setSelectedTab] = useState("payments");

  useEffect(() => {
    fetchPaymentData();
  }, []);

  const fetchPaymentData = () => {
    setTimeout(() => {
      setPaymentData({
        nextPayment: {
          amount: "R 440,450.00",
          dueDate: "March 1, 2024",
        },
        paymentMethods: [
          { id: "1", last4: "4242", expiryDate: "12/25", type: "visa" },
        ],
        paymentHistory: [
          {
            id: "1",
            amount: "R 440,450.00",
            date: "Feb 1, 2024",
            status: "paid",
            hasInvoice: true,
          },
          {
            id: "2",
            amount: "R 440,450.00",
            date: "Jan 1, 2024",
            status: "paid",
            hasInvoice: true,
          },
          {
            id: "3",
            amount: "R 440,450.00",
            date: "Mar 1, 2024",
            status: "upcoming",
            hasInvoice: false,
          },
        ],
        invoices: [
          {
            id: "inv-001",
            title: "February Rent",
            date: "Feb 1, 2024",
            amount: "R 440,450.00",
            status: "paid",
          },
          {
            id: "inv-002",
            title: "January Rent",
            date: "Jan 1, 2024",
            amount: "R 440,450.00",
            status: "paid",
          },
          {
            id: "inv-003",
            title: "March Rent",
            date: "Mar 1, 2024",
            amount: "R 440,450.00",
            status: "unpaid",
          },
        ],
      });
      setLoading(false);
    }, 1500);
  };

  const handlePayNow = () => {
    setProcessingPayment(true);
    setTimeout(() => {
      setProcessingPayment(false);
      Alert.alert(
        "Success",
        "Your payment of R 440,450.00 has been processed successfully."
      );
      setPaymentData((prev) => ({
        ...prev,
        paymentHistory: prev.paymentHistory.map((payment) =>
          payment.status === "upcoming"
            ? { ...payment, status: "paid" }
            : payment
        ),
        invoices: prev.invoices.map((invoice) =>
          invoice.status === "unpaid" ? { ...invoice, status: "paid" } : invoice
        ),
      }));
    }, 2000);
  };

  const handleAddPaymentMethod = () => {
    Alert.alert(
      "Feature",
      "This feature would allow users to add a new payment method."
    );
  };

  const handleUploadProof = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
        copyToCacheDirectory: true,
      });

      if (
        result.canceled === false &&
        result.assets &&
        result.assets.length > 0
      ) {
        Alert.alert(
          "Success",
          "Proof of payment uploaded successfully. It will be reviewed by management."
        );
      }
    } catch (error) {
      Alert.alert("Error", "Failed to upload document");
    }
  };

  const handleViewInvoice = (invoiceId) => {
    Alert.alert(
      "View Invoice",
      "This would open the invoice PDF for invoice #" + invoiceId
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={tw`flex-1 ${styles.background}`}>
        <View style={tw`flex flex-col items-center justify-center h-screen`}>
          <ActivityIndicator
            style={tw`w-12 h-12`}
            size="large"
            color="#3B82F6"
          />
          <Text style={tw`mt-4 text-base ${styles.secondaryText}`}>
            Loading payment information...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 ${styles.background}`}>
      {/* Header with blue background */}
      <View style={tw`${styles.headerBackground} p-6 pb-12 rounded-b-3xl`}>
        <View style={tw`flex-row justify-between items-center`}>
          <View style={tw`flex-row items-center`}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={tw`p-2 mr-3`}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={tw`text-2xl font-bold text-white`}>Payments</Text>
          </View>
          <TouchableOpacity
            style={tw`p-2 ${
              isDark ? "bg-blue-800" : "bg-blue-400"
            } rounded-full`}
          >
            <Ionicons name="help-circle-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Navigation */}
      <View
        style={tw`flex-row ${styles.tabBackground} mx-4 rounded-xl -mt-6  shadow-md overflow-hidden`}
      >
        <TouchableOpacity
          style={tw`flex-1 py-3 items-center ${
            selectedTab === "payments"
              ? `${styles.tabActiveBackground} border-b-2 ${styles.tabActiveBorder}`
              : ""
          }`}
          onPress={() => setSelectedTab("payments")}
        >
          <Text
            style={tw`font-semibold ${
              selectedTab === "payments" ? styles.tabActiveText : styles.tabText
            }`}
          >
            Payments
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`flex-1 py-3 items-center ${
            selectedTab === "invoices"
              ? `${styles.tabActiveBackground} border-b-2 ${styles.tabActiveBorder}`
              : ""
          }`}
          onPress={() => setSelectedTab("invoices")}
        >
          <Text
            style={tw`font-semibold ${
              selectedTab === "invoices" ? styles.tabActiveText : styles.tabText
            }`}
          >
            Invoices
          </Text>
        </TouchableOpacity>
      </View>

      {selectedTab === "payments" ? (
        <ScrollView style={tw`flex-1 px-4 pt-4`}>
          {/* Next Payment Due Card */}
          <Card style={`mb-6 ${styles.cardBackground}`}>
            <View style={tw`p-5`}>
              <Text style={tw`text-base ${styles.secondaryText} mb-2`}>
                Next Payment Due
              </Text>
              <Text style={tw`text-3xl font-bold ${styles.text} mb-2`}>
                {paymentData.nextPayment.amount}
              </Text>
              <Text style={tw`text-base ${styles.secondaryText} mb-5`}>
                Due {paymentData.nextPayment.dueDate}
              </Text>

              <View style={tw`flex-row space-x-2`}>
                <TouchableOpacity
                  style={tw`flex-1 py-4 rounded-lg items-center justify-center ${
                    processingPayment
                      ? isDark
                        ? "bg-blue-800"
                        : "bg-blue-400"
                      : styles.paymentButton
                  }`}
                  onPress={handlePayNow}
                  disabled={processingPayment}
                >
                  {processingPayment ? (
                    <View style={tw`flex flex-row items-center justify-center`}>
                      <ActivityIndicator
                        style={tw`mr-2`}
                        size="small"
                        color="#FFFFFF"
                      />
                      <Text style={tw`text-white font-bold`}>
                        Processing...
                      </Text>
                    </View>
                  ) : (
                    <Text style={tw`text-white font-bold`}>Pay Now</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={tw`py-4 px-4 rounded-lg items-center justify-center ${styles.uploadButton}`}
                  onPress={handleUploadProof}
                >
                  <Ionicons
                    name="cloud-upload-outline"
                    size={24}
                    color={styles.uploadIcon}
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={tw`mt-3 py-2 border border-blue-500 rounded-lg items-center justify-center`}
                onPress={handleUploadProof}
              >
                <Text style={tw`text-blue-500 font-bold`}>
                  Upload Proof of Payment
                </Text>
              </TouchableOpacity>
            </View>
          </Card>

          {/* Payment Methods Section */}
          <Card style={`mb-6 ${styles.cardBackground}`}>
            <View style={tw`p-5`}>
              <View style={tw`flex flex-row justify-between items-center mb-4`}>
                <Text style={tw`text-lg font-bold ${styles.text}`}>
                  Payment Methods
                </Text>
                <TouchableOpacity onPress={handleAddPaymentMethod}>
                  <Text style={tw`text-blue-500 font-bold`}>+ Add</Text>
                </TouchableOpacity>
              </View>

              {paymentData.paymentMethods.map((method) => (
                <View
                  key={method.id}
                  style={tw`flex flex-row items-center ${styles.paymentMethodBg} rounded-lg p-4`}
                >
                  <Ionicons
                    name="card-outline"
                    size={24}
                    color={styles.uploadIcon}
                  />
                  <View style={tw`ml-4 flex-1`}>
                    <Text style={tw`text-base font-bold ${styles.text}`}>
                      •••• {method.last4}
                    </Text>
                    <Text style={tw`text-sm ${styles.secondaryText} mt-1`}>
                      Expires {method.expiryDate}
                    </Text>
                  </View>
                  <TouchableOpacity style={tw`p-2`}>
                    <Ionicons
                      name="create-outline"
                      size={20}
                      color={styles.uploadIcon}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </Card>

          {/* Payment History Section */}
          <Card style={`mb-6 ${styles.cardBackground}`}>
            <View style={tw`p-5`}>
              <Text style={tw`text-lg font-bold ${styles.text} mb-4`}>
                Payment History
              </Text>

              {paymentData.paymentHistory.map((payment) => (
                <View
                  key={payment.id}
                  style={tw`flex flex-row justify-between items-center py-4 border-b ${styles.divider}`}
                >
                  <View>
                    <Text style={tw`text-base font-bold ${styles.text}`}>
                      {payment.amount}
                    </Text>
                    <Text style={tw`text-sm ${styles.secondaryText} mt-1`}>
                      {payment.date}
                    </Text>
                  </View>

                  <View style={tw`flex flex-row items-center`}>
                    {payment.status === "paid" ? (
                      <View
                        style={tw`flex flex-row items-center ${
                          isDark ? "bg-green-900" : "bg-green-100"
                        } px-3 py-1 rounded-full mr-2`}
                      >
                        <Ionicons
                          name="checkmark-circle"
                          size={16}
                          color={isDark ? "#6EE7B7" : "#10B981"}
                        />
                        <Text
                          style={tw`ml-1 ${
                            isDark ? "text-green-300" : "text-green-700"
                          } font-bold`}
                        >
                          Paid
                        </Text>
                      </View>
                    ) : (
                      <View
                        style={tw`flex flex-row items-center ${
                          isDark ? "bg-orange-900" : "bg-orange-100"
                        } px-3 py-1 rounded-full mr-2`}
                      >
                        <Ionicons
                          name="time-outline"
                          size={16}
                          color={isDark ? "#FCD34D" : "#F59E0B"}
                        />
                        <Text
                          style={tw`ml-1 ${
                            isDark ? "text-orange-300" : "text-orange-700"
                          } font-bold`}
                        >
                          Upcoming
                        </Text>
                      </View>
                    )}

                    {payment.hasInvoice && (
                      <TouchableOpacity
                        style={tw`p-2`}
                        onPress={() => handleViewInvoice(payment.id)}
                      >
                        <Ionicons
                          name="document-text-outline"
                          size={18}
                          color="#3B82F6"
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </Card>
        </ScrollView>
      ) : (
        <ScrollView style={tw`flex-1 px-4 pt-4`}>
          {/* Invoices Section */}
          <Card style={`mb-6 ${styles.cardBackground}`}>
            <View style={tw`p-4`}>
              <Text style={tw`text-lg font-bold ${styles.text} mb-4`}>
                Invoices
              </Text>

              {paymentData.invoices.map((invoice) => (
                <TouchableOpacity
                  key={invoice.id}
                  style={tw`flex-row items-center justify-between py-4 border-b ${styles.divider}`}
                  onPress={() => handleViewInvoice(invoice.id)}
                >
                  <View style={tw`flex-row items-center flex-1`}>
                    <View
                      style={tw`${styles.invoiceIconBg} p-2 rounded-lg mr-3`}
                    >
                      <Ionicons
                        name="document-text-outline"
                        size={24}
                        color={styles.invoiceIcon}
                      />
                    </View>
                    <View style={tw`flex-1`}>
                      <Text style={tw`text-base font-bold ${styles.text}`}>
                        {invoice.title}
                      </Text>
                      <Text style={tw`text-sm ${styles.secondaryText}`}>
                        {invoice.date} • {invoice.amount}
                      </Text>
                    </View>
                  </View>

                  <View style={tw`flex-row items-center`}>
                    <View style={tw`min-w-20`}>
                      {invoice.status === "paid" ? (
                        <View
                          style={tw`flex flex-row items-center ${
                            isDark ? "bg-green-900" : "bg-green-100"
                          } px-3 py-1 rounded-full mr-2`}
                        >
                          <Ionicons
                            name="checkmark-circle"
                            size={16}
                            color={isDark ? "#6EE7B7" : "#10B981"}
                          />
                          <Text
                            style={tw`ml-1 ${
                              isDark ? "text-green-300" : "text-green-700"
                            } font-bold`}
                          >
                            Paid
                          </Text>
                        </View>
                      ) : (
                        <View
                          style={tw`flex flex-row items-center ${
                            isDark ? "bg-orange-900" : "bg-orange-100"
                          } px-3 py-1 rounded-full mr-2`}
                        >
                          <Ionicons
                            name="time-outline"
                            size={16}
                            color={isDark ? "#FCD34D" : "#F59E0B"}
                          />
                          <Text
                            style={tw`ml-1 ${
                              isDark ? "text-orange-300" : "text-orange-700"
                            } font-bold`}
                          >
                            Unpaid
                          </Text>
                        </View>
                      )}
                    </View>

                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={isDark ? "#777" : "#999"}
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </Card>

          {/* Upload Section */}
          <Card style={`mb-6 ${styles.cardBackground}`}>
            <View style={tw`p-5 items-center`}>
              <View style={tw`${styles.uploadSectionBg} p-4 rounded-full mb-4`}>
                <Ionicons
                  name="cloud-upload-outline"
                  size={32}
                  color={styles.uploadSectionIcon}
                />
              </View>
              <Text
                style={tw`text-lg font-bold ${styles.text} mb-2 text-center`}
              >
                Upload Proof of Payment
              </Text>
              <Text style={tw`${styles.secondaryText} mb-4 text-center px-4`}>
                If you've made a payment via bank transfer, please upload your
                proof of payment here.
              </Text>
              <TouchableOpacity
                style={tw`py-3 px-6 ${styles.paymentButton} rounded-lg items-center justify-center w-full`}
                onPress={handleUploadProof}
              >
                <Text style={tw`text-white font-bold`}>Select Document</Text>
              </TouchableOpacity>
            </View>
          </Card>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default PaymentsScreen;
