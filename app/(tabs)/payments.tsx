import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { CreditCard, Calendar, DollarSign, CircleCheck as CheckCircle, Clock, Upload, Plus, FileText } from 'lucide-react-native';

export default function PaymentsScreen() {
  const [selectedTab, setSelectedTab] = useState('payments');

  const paymentData = {
    nextPayment: {
      amount: 'R 440,450.00',
      dueDate: 'March 1, 2024',
    },
    paymentHistory: [
      {
        id: '1',
        amount: 'R 440,450.00',
        date: 'Feb 1, 2024',
        status: 'paid',
      },
      {
        id: '2',
        amount: 'R 440,450.00',
        date: 'Jan 1, 2024',
        status: 'paid',
      },
      {
        id: '3',
        amount: 'R 440,450.00',
        date: 'Mar 1, 2024',
        status: 'upcoming',
      },
    ],
    paymentMethods: [
      { id: '1', last4: '4242', expiryDate: '12/25', type: 'visa' },
    ],
  };

  const handlePayNow = () => {
    Alert.alert(
      'Payment Confirmation',
      'Are you sure you want to pay R 440,450.00?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Pay Now', 
          onPress: () => Alert.alert('Success', 'Payment processed successfully!') 
        },
      ]
    );
  };

  const handleUploadProof = () => {
    Alert.alert('Upload Proof', 'Document picker would open here');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Payments</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'payments' && styles.activeTab]}
          onPress={() => setSelectedTab('payments')}
        >
          <Text style={[styles.tabText, selectedTab === 'payments' && styles.activeTabText]}>
            Payments
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'invoices' && styles.activeTab]}
          onPress={() => setSelectedTab('invoices')}
        >
          <Text style={[styles.tabText, selectedTab === 'invoices' && styles.activeTabText]}>
            Invoices
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {selectedTab === 'payments' ? (
          <>
            {/* Next Payment Due */}
            <View style={styles.paymentCard}>
              <View style={styles.cardHeader}>
                <DollarSign size={24} color="#3b82f6" />
                <Text style={styles.cardTitle}>Next Payment Due</Text>
              </View>
              <Text style={styles.paymentAmount}>{paymentData.nextPayment.amount}</Text>
              <Text style={styles.paymentDue}>Due {paymentData.nextPayment.dueDate}</Text>
              
              <View style={styles.paymentActions}>
                <TouchableOpacity style={styles.payButton} onPress={handlePayNow}>
                  <Text style={styles.payButtonText}>Pay Now</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.uploadButton} onPress={handleUploadProof}>
                  <Upload size={20} color="#6b7280" />
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity style={styles.proofButton} onPress={handleUploadProof}>
                <Text style={styles.proofButtonText}>Upload Proof of Payment</Text>
              </TouchableOpacity>
            </View>

            {/* Payment Methods */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Payment Methods</Text>
                <TouchableOpacity style={styles.addButton}>
                  <Plus size={16} color="#3b82f6" />
                  <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
              </View>
              
              {paymentData.paymentMethods.map((method) => (
                <View key={method.id} style={styles.paymentMethodCard}>
                  <CreditCard size={24} color="#6b7280" />
                  <View style={styles.methodInfo}>
                    <Text style={styles.methodNumber}>•••• {method.last4}</Text>
                    <Text style={styles.methodExpiry}>Expires {method.expiryDate}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Payment History */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Payment History</Text>
              
              {paymentData.paymentHistory.map((payment) => (
                <View key={payment.id} style={styles.historyItem}>
                  <View style={styles.historyInfo}>
                    <Text style={styles.historyAmount}>{payment.amount}</Text>
                    <Text style={styles.historyDate}>{payment.date}</Text>
                  </View>
                  
                  <View style={styles.statusContainer}>
                    {payment.status === 'paid' ? (
                      <>
                        <CheckCircle size={16} color="#10b981" />
                        <Text style={styles.paidStatus}>Paid</Text>
                      </>
                    ) : (
                      <>
                        <Clock size={16} color="#f59e0b" />
                        <Text style={styles.upcomingStatus}>Upcoming</Text>
                      </>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </>
        ) : (
          /* Invoices Tab */
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Invoices</Text>
            
            <View style={styles.invoiceCard}>
              <View style={styles.invoiceHeader}>
                <FileText size={24} color="#3b82f6" />
                <View style={styles.invoiceInfo}>
                  <Text style={styles.invoiceTitle}>March Rent Invoice</Text>
                  <Text style={styles.invoiceDate}>Due: March 1, 2024</Text>
                </View>
              </View>
              <Text style={styles.invoiceAmount}>R 440,450.00</Text>
              <TouchableOpacity style={styles.viewInvoiceButton}>
                <Text style={styles.viewInvoiceText}>View Invoice</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.invoiceCard}>
              <View style={styles.invoiceHeader}>
                <FileText size={24} color="#10b981" />
                <View style={styles.invoiceInfo}>
                  <Text style={styles.invoiceTitle}>February Rent Invoice</Text>
                  <Text style={styles.invoiceDate}>Paid: February 1, 2024</Text>
                </View>
              </View>
              <Text style={styles.invoiceAmount}>R 440,450.00</Text>
              <View style={styles.paidBadge}>
                <CheckCircle size={16} color="#10b981" />
                <Text style={styles.paidBadgeText}>Paid</Text>
              </View>
            </View>

            {/* Upload Section */}
            <View style={styles.uploadSection}>
              <Upload size={32} color="#3b82f6" />
              <Text style={styles.uploadTitle}>Upload Proof of Payment</Text>
              <Text style={styles.uploadDescription}>
                If you've made a payment via bank transfer, please upload your proof of payment here.
              </Text>
              <TouchableOpacity style={styles.selectDocumentButton} onPress={handleUploadProof}>
                <Text style={styles.selectDocumentText}>Select Document</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#3b82f6',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: -10,
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#dbeafe',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  activeTabText: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  paymentCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginLeft: 8,
  },
  paymentAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  paymentDue: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 20,
  },
  paymentActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  payButton: {
    flex: 1,
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  uploadButton: {
    width: 56,
    height: 56,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  proofButton: {
    borderWidth: 1,
    borderColor: '#3b82f6',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  proofButtonText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addButtonText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '600',
  },
  paymentMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  methodInfo: {
    flex: 1,
  },
  methodNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  methodExpiry: {
    fontSize: 14,
    color: '#6b7280',
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  historyInfo: {
    flex: 1,
  },
  historyAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 14,
    color: '#6b7280',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  paidStatus: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10b981',
  },
  upcomingStatus: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f59e0b',
  },
  invoiceCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  invoiceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  invoiceInfo: {
    flex: 1,
    marginLeft: 12,
  },
  invoiceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  invoiceDate: {
    fontSize: 14,
    color: '#6b7280',
  },
  invoiceAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  viewInvoiceButton: {
    backgroundColor: '#dbeafe',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  viewInvoiceText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '600',
  },
  paidBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dcfce7',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignSelf: 'flex-start',
    gap: 4,
  },
  paidBadgeText: {
    color: '#10b981',
    fontSize: 12,
    fontWeight: '600',
  },
  uploadSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  uploadTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 12,
    marginBottom: 8,
  },
  uploadDescription: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  selectDocumentButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  selectDocumentText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});