import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
import Card from "../../components/Card";

const { width } = Dimensions.get("window");

const AdminPaymentsScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [payments, setPayments] = useState({
    pendingPayments: [],
    confirmedPayments: [],
    proofUploads: [],
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentModal, setCurrentModal] = useState(null);
  const [newInvoiceData, setNewInvoiceData] = useState({
    tenantName: "",
    amount: "",
    dueDate: "",
  });

  useEffect(() => {
    fetchPaymentData();
  }, []);

  const fetchPaymentData = () => {
    // Simulated admin payment data
    setTimeout(() => {
      setPayments({
        pendingPayments: [
          {
            id: "1",
            tenantName: "John Doe",
            unit: "101",
            amount: "R 440,450.00",
            dueDate: "March 15, 2024",
          },
          {
            id: "2",
            tenantName: "Jane Smith",
            unit: "202",
            amount: "R 380,250.00",
            dueDate: "March 20, 2024",
          },
        ],
        confirmedPayments: [
          {
            id: "3",
            tenantName: "Mike Johnson",
            unit: "303",
            amount: "R 420,300.00",
            paymentDate: "February 28, 2024",
          },
        ],
        proofUploads: [
          {
            id: "proof1",
            tenantName: "Sarah Williams",
            unit: "404",
            amount: "R 390,200.00",
            uploadDate: "March 5, 2024",
            status: "pending-review",
          },
        ],
      });
      setLoading(false);
    }, 1500);
  };

  const handleSendReminder = (payment) => {
    Alert.alert(
      "Send Reminder",
      `Send payment reminder to ${payment.tenantName} for ${payment.amount}`
    );
  };

  const handleCreateInvoice = () => {
    if (
      !newInvoiceData.tenantName ||
      !newInvoiceData.amount ||
      !newInvoiceData.dueDate
    ) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    Alert.alert(
      "Create Invoice",
      `Invoice created for ${newInvoiceData.tenantName}\nAmount: ${newInvoiceData.amount}\nDue Date: ${newInvoiceData.dueDate}`
    );
    setIsModalVisible(false);
  };

  const handleReviewProofUpload = (proof) => {
    Alert.alert(
      "Review Proof of Payment",
      `Review payment proof for ${proof.tenantName}`,
      [
        {
          text: "Approve",
          onPress: () => {
            Alert.alert("Success", "Payment proof approved");
            // Update proof status
          },
        },
        {
          text: "Reject",
          style: "destructive",
          onPress: () => {
            Alert.alert("Rejected", "Payment proof rejected");
            // Update proof status
          },
        },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  const renderOverviewTab = () => (
    <ScrollView
      style={tw`flex-1 px-4 pt-4`}
      showsVerticalScrollIndicator={false}
    >
      {/* Pending Payments Card */}
      <Card style="mb-6 shadow-md">
        <View style={tw`p-5`}>
          <View style={tw`flex-row justify-between items-center mb-4`}>
            <Text style={tw`text-lg font-bold text-gray-800`}>
              Pending Payments
            </Text>
            <TouchableOpacity
              style={tw`flex-row items-center`}
              onPress={() => {
                setCurrentModal("createInvoice");
                setIsModalVisible(true);
              }}
            >
              <Text style={tw`text-blue-600 mr-2`}>Create Invoice</Text>
              <Ionicons name="add-circle" size={22} color="#2563EB" />
            </TouchableOpacity>
          </View>
          {payments.pendingPayments.map((payment) => (
            <View
              key={payment.id}
              style={tw`flex-row justify-between items-center py-4 border-b border-gray-100`}
            >
              <View style={tw`flex-1 pr-4`}>
                <Text style={tw`text-base font-bold text-gray-800`}>
                  {payment.tenantName} - Unit {payment.unit}
                </Text>
                <Text style={tw`text-sm text-gray-600`}>
                  {payment.amount} • Due {payment.dueDate}
                </Text>
              </View>
              <TouchableOpacity
                style={tw`bg-orange-100 px-3 py-2 rounded-full`}
                onPress={() => handleSendReminder(payment)}
              >
                <Text style={tw`text-orange-700 font-bold`}>Reminder</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </Card>

      {/* Proof of Payment Card */}
      <Card style="mb-6 shadow-md">
        <View style={tw`p-5`}>
          <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>
            Proof of Payment Uploads
          </Text>
          {payments.proofUploads.map((proof) => (
            <View
              key={proof.id}
              style={tw`flex-row justify-between items-center py-4 border-b border-gray-100`}
            >
              <View style={tw`flex-1 pr-4`}>
                <Text style={tw`text-base font-bold text-gray-800`}>
                  {proof.tenantName} - Unit {proof.unit}
                </Text>
                <Text style={tw`text-sm text-gray-600`}>
                  {proof.amount} • Uploaded {proof.uploadDate}
                </Text>
              </View>
              <TouchableOpacity
                style={tw`bg-blue-100 px-3 py-2 rounded-full`}
                onPress={() => handleReviewProofUpload(proof)}
              >
                <Text style={tw`text-blue-700 font-bold`}>Review</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </Card>
    </ScrollView>
  );

  const renderConfirmedPaymentsTab = () => (
    <ScrollView
      style={tw`flex-1 px-4 pt-4`}
      showsVerticalScrollIndicator={false}
    >
      <Card style="mb-6 shadow-md">
        <View style={tw`p-5`}>
          <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>
            Confirmed Payments
          </Text>
          {payments.confirmedPayments.map((payment) => (
            <View
              key={payment.id}
              style={tw`flex-row justify-between items-center py-4 border-b border-gray-100`}
            >
              <View style={tw`flex-1 pr-4`}>
                <Text style={tw`text-base font-bold text-gray-800`}>
                  {payment.tenantName} - Unit {payment.unit}
                </Text>
                <Text style={tw`text-sm text-gray-600`}>
                  {payment.amount} • Paid {payment.paymentDate}
                </Text>
              </View>
              <View style={tw`bg-green-100 px-3 py-1.5 rounded-full`}>
                <Text style={tw`text-green-700 font-bold text-xs`}>
                  Confirmed
                </Text>
              </View>
            </View>
          ))}
        </View>
      </Card>
    </ScrollView>
  );

  const renderCreateInvoiceModal = () => (
    <Modal
      visible={isModalVisible && currentModal === "createInvoice"}
      transparent={true}
      animationType="slide"
      statusBarTranslucent={true}
    >
      <View
        style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}
      >
        <View
          style={[
            tw`bg-white rounded-lg p-6 shadow-2xl`,
            { width: width * 0.85 },
          ]}
        >
          <Text style={tw`text-xl font-bold mb-6 text-center text-gray-800`}>
            Create New Invoice
          </Text>

          <TextInput
            style={tw`border border-gray-300 rounded-lg px-4 py-3 mb-4 text-base`}
            placeholder="Tenant Name"
            placeholderTextColor="#9CA3AF"
            value={newInvoiceData.tenantName}
            onChangeText={(text) =>
              setNewInvoiceData((prev) => ({ ...prev, tenantName: text }))
            }
          />

          <TextInput
            style={tw`border border-gray-300 rounded-lg px-4 py-3 mb-4 text-base`}
            placeholder="Amount (e.g., R 440,450.00)"
            placeholderTextColor="#9CA3AF"
            value={newInvoiceData.amount}
            onChangeText={(text) =>
              setNewInvoiceData((prev) => ({ ...prev, amount: text }))
            }
            keyboardType="numeric"
          />

          <TextInput
            style={tw`border border-gray-300 rounded-lg px-4 py-3 mb-6 text-base`}
            placeholder="Due Date (e.g., March 31, 2024)"
            placeholderTextColor="#9CA3AF"
            value={newInvoiceData.dueDate}
            onChangeText={(text) =>
              setNewInvoiceData((prev) => ({ ...prev, dueDate: text }))
            }
          />

          <View style={tw`flex-row justify-between`}>
            <TouchableOpacity
              style={tw`bg-gray-200 px-6 py-3 rounded-lg flex-1 mr-3`}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={tw`text-gray-700 text-center font-semibold`}>
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={tw`bg-blue-600 px-6 py-3 rounded-lg flex-1`}
              onPress={handleCreateInvoice}
            >
              <Text style={tw`text-white font-bold text-center`}>Create</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <SafeAreaView style={tw`flex-1 bg-gray-50`}>
        <View style={tw`flex flex-col items-center justify-center h-full`}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={tw`mt-4 text-base text-gray-600`}>
            Loading payment information...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      {/* Header */}
      <View style={tw`bg-blue-500 p-6 pb-12 rounded-b-3xl shadow-md`}>
        <View style={tw`flex-row justify-between items-center`}>
          <Text style={tw`text-2xl font-bold text-white`}>
            Payments Management
          </Text>
          <TouchableOpacity
            style={tw`p-2 bg-blue-400 rounded-full`}
            onPress={() =>
              Alert.alert(
                "Help",
                "Additional information about payments management."
              )
            }
          >
            <Ionicons name="help-circle-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Navigation */}
      <View
        style={tw`flex-row bg-white mx-4 rounded-xl -mt-6 shadow-md overflow-hidden`}
      >
        <TouchableOpacity
          style={tw`flex-1 py-3.5 items-center ${
            selectedTab === "overview"
              ? "bg-blue-50 border-b-2 border-blue-500"
              : ""
          }`}
          onPress={() => setSelectedTab("overview")}
        >
          <Text
            style={tw`font-semibold ${
              selectedTab === "overview" ? "text-blue-500" : "text-gray-500"
            }`}
          >
            Overview
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`flex-1 py-3.5 items-center ${
            selectedTab === "confirmed"
              ? "bg-blue-50 border-b-2 border-blue-500"
              : ""
          }`}
          onPress={() => setSelectedTab("confirmed")}
        >
          <Text
            style={tw`font-semibold ${
              selectedTab === "confirmed" ? "text-blue-500" : "text-gray-500"
            }`}
          >
            Confirmed
          </Text>
        </TouchableOpacity>
      </View>

      {/* Conditional Rendering of Tabs */}
      {selectedTab === "overview"
        ? renderOverviewTab()
        : renderConfirmedPaymentsTab()}

      {/* Create Invoice Modal */}
      {renderCreateInvoiceModal()}
    </SafeAreaView>
  );
};

export default AdminPaymentsScreen;
