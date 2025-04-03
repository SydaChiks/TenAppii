import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";

const AdminLeaseManagementScreen = ({ navigation }) => {
  const [leases, setLeases] = useState([]);
  const [filteredLeases, setFilteredLeases] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddLeaseModalVisible, setIsAddLeaseModalVisible] = useState(false);
  const [newLease, setNewLease] = useState({
    tenantName: "",
    unitNumber: "",
    startDate: new Date(),
    endDate: new Date(),
    monthlyRent: "",
    status: "Active",
  });
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  useEffect(() => {
    // Simulate fetching leases
    fetchLeases();
  }, []);

  useEffect(() => {
    // Filter leases based on search term
    const filtered = leases.filter(
      (lease) =>
        lease.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lease.unitNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLeases(filtered);
  }, [searchTerm, leases]);

  const fetchLeases = () => {
    // Simulated lease data
    const dummyLeases = [
      {
        id: 1,
        tenantName: "John Doe",
        unitNumber: "301",
        startDate: "2023-07-01",
        endDate: "2024-06-30",
        monthlyRent: 2500,
        status: "Active",
      },
      {
        id: 2,
        tenantName: "Jane Smith",
        unitNumber: "302",
        startDate: "2023-09-15",
        endDate: "2024-09-14",
        monthlyRent: 2700,
        status: "Expiring Soon",
      },
      {
        id: 3,
        tenantName: "Mike Johnson",
        unitNumber: "401",
        startDate: "2024-01-01",
        endDate: "2024-12-31",
        monthlyRent: 2600,
        status: "Active",
      },
    ];
    setLeases(dummyLeases);
    setFilteredLeases(dummyLeases);
  };

  const handleAddLease = () => {
    if (!newLease.tenantName || !newLease.unitNumber || !newLease.monthlyRent) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    const leaseToAdd = {
      ...newLease,
      id: leases.length + 1,
      startDate: newLease.startDate.toISOString().split("T")[0],
      endDate: newLease.endDate.toISOString().split("T")[0],
    };

    setLeases([...leases, leaseToAdd]);
    setIsAddLeaseModalVisible(false);
    setNewLease({
      tenantName: "",
      unitNumber: "",
      startDate: new Date(),
      endDate: new Date(),
      monthlyRent: "",
      status: "Active",
    });
  };

  const handleDeleteLease = (leaseId) => {
    Alert.alert("Delete Lease", "Are you sure you want to delete this lease?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          const updatedLeases = leases.filter((lease) => lease.id !== leaseId);
          setLeases(updatedLeases);
        },
      },
    ]);
  };

  const sendRenewalReminders = () => {
    const expiringLeases = leases.filter((lease) => {
      const endDate = new Date(lease.endDate);
      const today = new Date();
      const daysUntilExpiration = (endDate - today) / (1000 * 3600 * 24);
      return daysUntilExpiration <= 60 && daysUntilExpiration > 0;
    });

    Alert.alert(
      "Renewal Reminders",
      `Sending renewal reminders to ${expiringLeases.length} tenants`,
      [{ text: "OK" }]
    );
  };

  const renderLeaseItem = (lease) => {
    const getStatusColor = (status) => {
      switch (status) {
        case "Active":
          return "bg-green-100";
        case "Expiring Soon":
          return "bg-yellow-100";
        default:
          return "bg-gray-100";
      }
    };

    return (
      <View
        key={lease.id}
        style={tw`bg-white rounded-xl p-4 mb-3 shadow-sm flex-row items-center`}
      >
        <View style={tw`flex-1`}>
          <View style={tw`flex-row items-center mb-2`}>
            <Text style={tw`text-lg font-bold text-gray-800 mr-2`}>
              {lease.tenantName}
            </Text>
            <View
              style={tw`${getStatusColor(lease.status)} px-2 py-1 rounded-full`}
            >
              <Text style={tw`text-xs text-gray-800`}>{lease.status}</Text>
            </View>
          </View>
          <Text style={tw`text-gray-600 mb-1`}>
            Unit: {lease.unitNumber} | Rent: ${lease.monthlyRent}/month
          </Text>
          <Text style={tw`text-gray-500 text-sm`}>
            {lease.startDate} - {lease.endDate}
          </Text>
        </View>
        <View style={tw`flex-row`}>
          <TouchableOpacity
            style={tw`mr-2`}
            onPress={() => {
              // Edit lease logic
              Alert.alert(
                "Edit Lease",
                `Editing lease for ${lease.tenantName}`
              );
            }}
          >
            <Ionicons name="create-outline" size={24} color="#3498db" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDeleteLease(lease.id)}>
            <Ionicons name="trash-outline" size={24} color="#e74c3c" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-100`}>
      {/* Header */}
      <View style={tw`bg-blue-500 p-6 pt-4 pb-16 rounded-b-3xl`}>
        <View style={tw`flex-row justify-between items-center`}>
          <Text style={tw`text-3xl font-bold text-white`}>
            Lease Management
          </Text>
          <TouchableOpacity
            style={tw`p-2 bg-blue-400 rounded-full`}
            onPress={() => setIsAddLeaseModalVisible(true)}
          >
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search and Filter */}
      <View style={tw`px-4 -mt-8 mb-4`}>
        <View
          style={tw`bg-white rounded-xl flex-row items-center px-4 py-2 shadow-sm`}
        >
          <Ionicons name="search" size={20} color="#999" style={tw`mr-2`} />
          <TextInput
            placeholder="Search leases by tenant or unit"
            style={tw`flex-1`}
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>
      </View>

      {/* Quick Actions */}
      <View style={tw`px-4 mb-4`}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={tw`bg-white rounded-xl p-3 mr-3 flex-row items-center`}
            onPress={sendRenewalReminders}
          >
            <Ionicons name="paper-plane-outline" size={20} color="#3498db" />
            <Text style={tw`ml-2 text-gray-800`}>Send Reminders</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`bg-white rounded-xl p-3 mr-3 flex-row items-center`}
            onPress={() => navigation.navigate("LeaseTemplates")}
          >
            <Ionicons name="document-text-outline" size={20} color="#2ecc71" />
            <Text style={tw`ml-2 text-gray-800`}>Lease Templates</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`bg-white rounded-xl p-3 flex-row items-center`}
            onPress={() => navigation.navigate("RentalReports")}
          >
            <Ionicons name="stats-chart-outline" size={20} color="#9b59b6" />
            <Text style={tw`ml-2 text-gray-800`}>Rental Reports</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Lease List */}
      <ScrollView style={tw`px-4 flex-1`} showsVerticalScrollIndicator={false}>
        <Text style={tw`text-xl font-bold mb-3 text-gray-800`}>
          Current Leases ({filteredLeases.length})
        </Text>
        {filteredLeases.map(renderLeaseItem)}
      </ScrollView>

      {/* Add Lease Modal */}
      <Modal
        visible={isAddLeaseModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={tw`flex-1 justify-end`}>
          <View style={tw`bg-white rounded-t-3xl p-6 shadow-2xl`}>
            <View style={tw`flex-row justify-between items-center mb-4`}>
              <Text style={tw`text-xl font-bold text-gray-800`}>
                Add New Lease
              </Text>
              <TouchableOpacity
                onPress={() => setIsAddLeaseModalVisible(false)}
              >
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView>
              <View style={tw`mb-4`}>
                <Text style={tw`text-gray-700 mb-2`}>Tenant Name</Text>
                <TextInput
                  style={tw`border border-gray-300 rounded-lg p-3`}
                  placeholder="Enter tenant name"
                  value={newLease.tenantName}
                  onChangeText={(text) =>
                    setNewLease({ ...newLease, tenantName: text })
                  }
                />
              </View>

              <View style={tw`mb-4`}>
                <Text style={tw`text-gray-700 mb-2`}>Unit Number</Text>
                <TextInput
                  style={tw`border border-gray-300 rounded-lg p-3`}
                  placeholder="Enter unit number"
                  value={newLease.unitNumber}
                  onChangeText={(text) =>
                    setNewLease({ ...newLease, unitNumber: text })
                  }
                />
              </View>

              <View style={tw`mb-4`}>
                <Text style={tw`text-gray-700 mb-2`}>Monthly Rent</Text>
                <TextInput
                  style={tw`border border-gray-300 rounded-lg p-3`}
                  placeholder="Enter monthly rent"
                  keyboardType="numeric"
                  value={newLease.monthlyRent}
                  onChangeText={(text) =>
                    setNewLease({ ...newLease, monthlyRent: text })
                  }
                />
              </View>

              <View style={tw`mb-4`}>
                <Text style={tw`text-gray-700 mb-2`}>Start Date</Text>
                <TouchableOpacity
                  style={tw`border border-gray-300 rounded-lg p-3`}
                  onPress={() => setShowStartDatePicker(true)}
                >
                  <Text>{newLease.startDate.toLocaleDateString()}</Text>
                </TouchableOpacity>
                {showStartDatePicker && (
                  <DateTimePicker
                    value={newLease.startDate}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowStartDatePicker(Platform.OS === "ios");
                      if (selectedDate) {
                        setNewLease({ ...newLease, startDate: selectedDate });
                      }
                    }}
                  />
                )}
              </View>

              <View style={tw`mb-4`}>
                <Text style={tw`text-gray-700 mb-2`}>End Date</Text>
                <TouchableOpacity
                  style={tw`border border-gray-300 rounded-lg p-3`}
                  onPress={() => setShowEndDatePicker(true)}
                >
                  <Text>{newLease.endDate.toLocaleDateString()}</Text>
                </TouchableOpacity>
                {showEndDatePicker && (
                  <DateTimePicker
                    value={newLease.endDate}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowEndDatePicker(Platform.OS === "ios");
                      if (selectedDate) {
                        setNewLease({ ...newLease, endDate: selectedDate });
                      }
                    }}
                  />
                )}
              </View>

              <TouchableOpacity
                style={tw`bg-blue-500 rounded-lg p-4 items-center`}
                onPress={handleAddLease}
              >
                <Text style={tw`text-white font-bold`}>Create Lease</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default AdminLeaseManagementScreen;
