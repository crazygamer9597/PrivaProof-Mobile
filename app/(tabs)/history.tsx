import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, RefreshControl, TouchableOpacity, ActivityIndicator, Modal, ScrollView } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useTheme } from '../../lib/ThemeContext';
import AgeVerifier from '../../components/AgeVerifier';

interface ScanHistory {
  id: string;
  created_at: string;
  item_id: string;
  item_name: string;
}

interface StoredItem {
  id: string;
  random_id: string;
  name: string;
  description: string;
  created_at: string;
  age: number;
  [key: string]: any;
}

export default function HistoryScreen() {
  const [history, setHistory] = useState<ScanHistory[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<StoredItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { colors } = useTheme();

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('scan_history')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHistory(data || []);
      setError(null);
    } catch (err) {
      setError('Failed to load scan history');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchHistory();
    setRefreshing(false);
  };

  const handleItemPress = async (itemId: string) => {
    try {
      const { data: items, error } = await supabase
        .from('stored_ids')
        .select('*')
        .eq('random_id', itemId);

      if (error) throw error;

      if (!items || items.length === 0) {
        setError('Item not found');
        return;
      }

      setSelectedItem(items[0]);
      setModalVisible(true);
    } catch (err) {
      setError('Failed to fetch item details');
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {error ? (
        <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
          }
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: colors.text }]}>No scan history available</Text>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.historyItem, { backgroundColor: colors.card }]}
              onPress={() => handleItemPress(item.item_id)}
            >
              <Text style={[styles.itemName, { color: colors.text }]}>{item.item_name}</Text>
              <Text style={[styles.timestamp, { color: colors.text }]}>
                {new Date(item.created_at).toLocaleString()}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Item Details</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={[styles.closeButton, { color: colors.primary }]}>Close</Text>
              </TouchableOpacity>
            </View>

            {selectedItem && (
              <ScrollView style={styles.modalScrollView}>
                <View style={[styles.detailsCard, { backgroundColor: colors.card }]}>
                  <View style={styles.headerSection}>
                    <Text style={[styles.detailsTitle, { color: colors.text }]}>{selectedItem.name}</Text>
                    <Text style={[styles.idText, { color: colors.primary }]}>ID: {selectedItem.random_id}</Text>
                  </View>

                  <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Description</Text>
                    <Text style={[styles.descriptionText, { color: colors.text }]}>
                      {selectedItem.description}
                    </Text>
                  </View>

                  <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Additional Details</Text>
                    {Object.entries(selectedItem).map(([key, value]) => {
                      // Skip internal and already displayed fields
                      if (
                        [
                          'id',
                          'random_id',
                          'original_id',
                          'name',
                          'description',
                          'created_at',
                          'age',
                        ].includes(key)
                      )
                        return null;

                      // Format the value based on its type
                      let displayValue = value;
                      if (typeof value === 'object') {
                        displayValue = JSON.stringify(value, null, 2);
                      }

                      return (
                        <View key={key} style={styles.detailRow}>
                          <Text style={[styles.detailLabel, { color: colors.primary }]}>{key}</Text>
                          <Text style={[styles.detailValue, { color: colors.text }]}>{displayValue}</Text>
                        </View>
                      );
                    })}
                  </View>

                  <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Metadata</Text>
                    <Text style={[styles.metadataText, { color: colors.text }]}>
                      Created: {new Date(selectedItem.created_at).toLocaleString()}
                    </Text>
                  </View>

                  <AgeVerifier itemAge={selectedItem.age} />
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  historyItem: {
    padding: 16,
    marginHorizontal: 8,
    marginVertical: 8,
    borderRadius: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 14,
    marginTop: 4,
    opacity: 0.7,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#3f3f46',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    fontSize: 16,
    fontWeight: '500',
  },
  modalScrollView: {
    maxHeight: '90%',
  },
  detailsCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  headerSection: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3f3f46',
    paddingBottom: 12,
  },
  detailsTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  idText: {
    fontSize: 14,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 8,
    minWidth: 100,
  },
  detailValue: {
    fontSize: 14,
    flex: 1,
  },
  metadataText: {
    fontSize: 12,
  },
});