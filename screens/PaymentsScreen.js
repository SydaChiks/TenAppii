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

const PaymentsScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [selectedTab, setSelectedTab] = useState("payments");

  useEffect(() => {
    // Simulate fetching payment data
    fetchPaymentData();
  }, []);

  const fetchPaymentData = () => {
    // Dummy payment data
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

    // Simulate payment processing
    setTimeout(() => {
      setProcessingPayment(false);
      Alert.alert(
        "Success",
        "Your payment of R 440,450.00 has been processed successfully."
      );

      // Update payment history
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
    // This would normally open a modal for adding a payment method
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
    // This would normally open the invoice PDF
    Alert.alert(
      "View Invoice",
      "This would open the invoice PDF for invoice #" + invoiceId
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={tw`flex-1 bg-gray-50`}>
        <View style={tw`flex flex-col items-center justify-center h-screen`}>
          <ActivityIndicator
            style={tw`w-12 h-12`}
            size="large"
            color="#3B82F6"
          />
          <Text style={tw`mt-4 text-base text-gray-600`}>
            Loading payment information...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      {/* Header with blue background */}
      <View style={tw`bg-blue-500 p-6 pb-12 rounded-b-3xl`}>
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
          <TouchableOpacity style={tw`p-2 bg-blue-400 rounded-full`}>
            <Ionicons name="help-circle-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Navigation */}
      <View
        style={tw`flex-row bg-white mx-4 rounded-xl -mt-6 shadow-md overflow-hidden`}
      >
        <TouchableOpacity
          style={tw`flex-1 py-3 items-center ${
            selectedTab === "payments"
              ? "bg-blue-50 border-b-2 border-blue-500"
              : ""
          }`}
          onPress={() => setSelectedTab("payments")}
        >
          <Text
            style={tw`font-semibold ${
              selectedTab === "payments" ? "text-blue-500" : "text-gray-500"
            }`}
          >
            Payments
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`flex-1 py-3 items-center ${
            selectedTab === "invoices"
              ? "bg-blue-50 border-b-2 border-blue-500"
              : ""
          }`}
          onPress={() => setSelectedTab("invoices")}
        >
          <Text
            style={tw`font-semibold ${
              selectedTab === "invoices" ? "text-blue-500" : "text-gray-500"
            }`}
          >
            Invoices
          </Text>
        </TouchableOpacity>
      </View>

      {selectedTab === "payments" ? (
        <ScrollView style={tw`flex-1 px-4 pt-4`}>
          {/* Next Payment Due Card */}
          <Card style="mb-6">
            <View style={tw`p-5`}>
              <Text style={tw`text-base text-gray-600 mb-2`}>
                Next Payment Due
              </Text>
              <Text style={tw`text-3xl font-bold text-gray-800 mb-2`}>
                {paymentData.nextPayment.amount}
              </Text>
              <Text style={tw`text-base text-gray-600 mb-5`}>
                Due {paymentData.nextPayment.dueDate}
              </Text>

              <View style={tw`flex-row space-x-2`}>
                <TouchableOpacity
                  style={tw`flex-1 py-4 rounded-lg items-center justify-center ${
                    processingPayment ? "bg-blue-400" : "bg-blue-600"
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
                  style={tw`py-4 px-4 rounded-lg items-center justify-center bg-gray-200`}
                  onPress={handleUploadProof}
                >
                  <Ionicons
                    name="cloud-upload-outline"
                    size={24}
                    color="#4B5563"
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={tw`mt-3 py-2 border border-blue-500 rounded-lg items-center justify-center`}
                onPress={handleUploadProof}
              >
                <Text style={tw`text-blue-600 font-bold`}>
                  Upload Proof of Payment
                </Text>
              </TouchableOpacity>
            </View>
          </Card>

          {/* Payment Methods Section */}
          <Card style="mb-6">
            <View style={tw`p-5`}>
              <View style={tw`flex flex-row justify-between items-center mb-4`}>
                <Text style={tw`text-lg font-bold text-gray-800`}>
                  Payment Methods
                </Text>
                <TouchableOpacity onPress={handleAddPaymentMethod}>
                  <Text style={tw`text-blue-600 font-bold`}>+ Add</Text>
                </TouchableOpacity>
              </View>

              {paymentData.paymentMethods.map((method) => (
                <View
                  key={method.id}
                  style={tw`flex flex-row items-center bg-gray-50 rounded-lg p-4`}
                >
                  <Ionicons name="card-outline" size={24} color="#4B5563" />
                  <View style={tw`ml-4 flex-1`}>
                    <Text style={tw`text-base font-bold text-gray-800`}>
                      •••• {method.last4}
                    </Text>
                    <Text style={tw`text-sm text-gray-600 mt-1`}>
                      Expires {method.expiryDate}
                    </Text>
                  </View>
                  <TouchableOpacity style={tw`p-2`}>
                    <Ionicons name="create-outline" size={20} color="#4B5563" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </Card>

          {/* Payment History Section */}
          <Card style="mb-6">
            <View style={tw`p-5`}>
              <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>
                Payment History
              </Text>

              {paymentData.paymentHistory.map((payment) => (
                <View
                  key={payment.id}
                  style={tw`flex flex-row justify-between items-center py-4 border-b border-gray-100`}
                >
                  <View>
                    <Text style={tw`text-base font-bold text-gray-800`}>
                      {payment.amount}
                    </Text>
                    <Text style={tw`text-sm text-gray-600 mt-1`}>
                      {payment.date}
                    </Text>
                  </View>

                  <View style={tw`flex flex-row items-center`}>
                    {payment.status === "paid" ? (
                      <View
                        style={tw`flex flex-row items-center bg-green-100 px-3 py-1 rounded-full mr-2`}
                      >
                        <Ionicons
                          name="checkmark-circle"
                          size={16}
                          color="#10B981"
                        />
                        <Text style={tw`ml-1 text-green-700 font-bold`}>
                          Paid
                        </Text>
                      </View>
                    ) : (
                      <View
                        style={tw`flex flex-row items-center bg-orange-100 px-3 py-1 rounded-full mr-2`}
                      >
                        <Ionicons
                          name="time-outline"
                          size={16}
                          color="#F59E0B"
                        />
                        <Text style={tw`ml-1 text-orange-700 font-bold`}>
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
          <Card style="mb-6">
            <View style={tw`p-5`}>
              <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>
                Invoices
              </Text>

              {paymentData.invoices.map((invoice) => (
                <TouchableOpacity
                  key={invoice.id}
                  style={tw`flex-row items-center justify-between py-4 border-b border-gray-100`}
                  onPress={() => handleViewInvoice(invoice.id)}
                >
                  <View style={tw`flex-row items-center`}>
                    <View style={tw`bg-blue-100 p-2 rounded-lg mr-3`}>
                      <Ionicons
                        name="document-text-outline"
                        size={24}
                        color="#3B82F6"
                      />
                    </View>
                    <View>
                      <Text style={tw`text-base font-bold text-gray-800`}>
                        {invoice.title}
                      </Text>
                      <Text style={tw`text-sm text-gray-600`}>
                        {invoice.date} • {invoice.amount}
                      </Text>
                    </View>
                  </View>

                  <View style={tw`flex-row items-center`}>
                    {invoice.status === "paid" ? (
                      <View
                        style={tw`flex flex-row items-center bg-green-100 px-3 py-1 rounded-full mr-2`}
                      >
                        <Ionicons
                          name="checkmark-circle"
                          size={16}
                          color="#10B981"
                        />
                        <Text style={tw`ml-1 text-green-700 font-bold`}>
                          Paid
                        </Text>
                      </View>
                    ) : (
                      <View
                        style={tw`flex flex-row items-center bg-orange-100 px-3 py-1 rounded-full mr-2`}
                      >
                        <Ionicons
                          name="time-outline"
                          size={16}
                          color="#F59E0B"
                        />
                        <Text style={tw`ml-1 text-orange-700 font-bold`}>
                          Unpaid
                        </Text>
                      </View>
                    )}

                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color="#9CA3AF"
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </Card>

          {/* Upload Section */}
          <Card style="mb-6">
            <View style={tw`p-5 items-center`}>
              <View style={tw`bg-blue-100 p-4 rounded-full mb-4`}>
                <Ionicons
                  name="cloud-upload-outline"
                  size={32}
                  color="#3B82F6"
                />
              </View>
              <Text
                style={tw`text-lg font-bold text-gray-800 mb-2 text-center`}
              >
                Upload Proof of Payment
              </Text>
              <Text style={tw`text-gray-600 mb-4 text-center px-4`}>
                If you've made a payment via bank transfer, please upload your
                proof of payment here.
              </Text>
              <TouchableOpacity
                style={tw`py-3 px-6 bg-blue-600 rounded-lg items-center justify-center w-full`}
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
