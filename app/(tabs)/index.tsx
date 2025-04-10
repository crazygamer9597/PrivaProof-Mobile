import { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  ScrollView,
  TextInput,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Circle as XCircle } from 'lucide-react-native';
import { supabase } from '../../lib/supabase';
import WebScanner from '../../components/WebScanner';
import AgeVerifier from '../../components/AgeVerifier';

interface StoredItem {
  id: string;
  random_id: string;
  name: string;
  description: string;
  created_at: string;
  age: number;
  [key: string]: any;
}

function ScanScreen() {
  const [scanned, setScanned] = useState(false);
  const [scannedText, setScannedText] = useState<string>('');
  const [result, setResult] = useState<{
    message: string;
    isError: boolean;
  } | null>(null);
  const [itemDetails, setItemDetails] = useState<StoredItem | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraReady, setCameraReady] = useState(false);
  const cameraRef = useRef(null);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    setScanned(true);
    setScannedText(data);
    try {
      // Fetch item details from stored_ids table using the scanned random_id
      const { data: items, error } = await supabase
        .from('stored_ids')
        .select('*')
        .eq('random_id', data);

      if (error) {
        console.error('Database error:', error);
        throw new Error(error.message);
      }

      if (!items || items.length === 0) {
        setItemDetails(null);
        setResult({
          message: 'No items found with this ID',
          isError: true,
        });
        return;
      }

      // If multiple items found, use the first one
      const selectedItem = items[0];
      setItemDetails(selectedItem);
      setResult({
        message: items.length > 1 
          ? 'Multiple items found, showing first match' 
          : 'Item found successfully',
        isError: false,
      });

      // Store the scan in scan_history using name from stored_ids
      const { error: historyError } = await supabase
        .from('scan_history')
        .insert({
          item_id: selectedItem.random_id,
          item_name: selectedItem.name,
        });

      if (historyError) {
        console.error('Error saving to scan history:', historyError);
        // Don't show error to user as this is a background operation
      }
    } catch (err) {
      console.error('Error fetching item:', err);
      setItemDetails(null);
      setResult({
        message: err instanceof Error ? err.message : 'Failed to fetch item details',
        isError: true,
      });
    }
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text>Loading camera permissions...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, styles.permissionContainer]}>
        <Text style={styles.permissionText}>No access to camera</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {scanned && (
        <View style={styles.scannedTextContainer}>
          <Text style={styles.scannedText} numberOfLines={2}>
            {scannedText}
          </Text>
        </View>
      )}
      {Platform.OS === 'web' ? (
        <WebScanner onScan={handleBarCodeScanned} isActive={true} />
      ) : (
        <View style={styles.cameraContainer}>
          <CameraView
            ref={cameraRef}
            style={StyleSheet.absoluteFillObject}
            facing="back"
            onBarcodeScanned={scanned || !cameraReady ? undefined : handleBarCodeScanned}
            onCameraReady={() => setCameraReady(true)}
            barcodeScannerSettings={{
              barcodeTypes: ['qr'],
            }}
          />
          <View style={styles.scanOverlay}>
            <View style={styles.scanBox}>
              <View style={styles.cornerTopLeft} />
              <View style={styles.cornerTopRight} />
              <View style={styles.cornerBottomLeft} />
              <View style={styles.cornerBottomRight} />
            </View>
            <Text style={styles.scanText}>
              Position QR code within the frame
            </Text>
          </View>
        </View>
      )}
      {scanned && (
        <View style={styles.resultContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setScanned(false);
              setItemDetails(null);
              setResult(null);
              setScannedText('');
              setCameraReady(false);
            }}
          >
            <Text style={styles.buttonText}>Tap to Scan Again</Text>
          </TouchableOpacity>
          {result && (
            <Text
              style={[styles.resultText, result.isError && styles.errorText]}
            >
              {result.message}
            </Text>
          )}
          {itemDetails && (
            <ScrollView style={styles.detailsContainer}>
              <View style={styles.detailsCard}>
                <View style={styles.headerSection}>
                  <Text style={styles.detailsTitle}>{itemDetails.name}</Text>
                  <Text style={styles.idText}>ID: {itemDetails.random_id}</Text>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Description</Text>
                  <Text style={styles.descriptionText}>
                    {itemDetails.description}
                  </Text>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Additional Details</Text>
                  {Object.entries(itemDetails).map(([key, value]) => {
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
                        <Text style={styles.detailLabel}>{key}</Text>
                        <Text style={styles.detailValue}>{displayValue}</Text>
                      </View>
                    );
                  })}
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Metadata</Text>
                  <Text style={styles.metadataText}>
                    Created: {new Date(itemDetails.created_at).toLocaleString()}
                  </Text>
                </View>

                <AgeVerifier itemAge={itemDetails.age} />
              </View>
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  scannedTextContainer: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 15,
    borderRadius: 8,
    zIndex: 1,
  },
  scannedText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  resultContainer: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
    width: '100%',
    maxHeight: '80%',
  },
  button: {
    backgroundColor: '#6366f1',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    width: '50%',
    alignSelf: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  resultText: {
    color: '#10b981',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  errorText: {
    color: '#ef4444',
  },
  detailsContainer: {
    width: '100%',
    paddingHorizontal: 20,
    maxHeight: 300,
  },
  detailsCard: {
    backgroundColor: '#2c2d31',
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
  },
  headerSection: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3f3f46',
    paddingBottom: 12,
  },
  detailsTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  idText: {
    color: '#6366f1',
    fontSize: 14,
  },
  section: {
    marginBottom: 16,
    fontSize: 16,
    color: '#fff',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  descriptionText: {
    color: '#e5e7eb',
    fontSize: 14,
    lineHeight: 20,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  detailLabel: {
    color: '#6366f1',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 8,
    minWidth: 100,
  },
  detailValue: {
    color: '#9ca3af',
    fontSize: 14,
    flex: 1,
  },
  metadataText: {
    color: '#71717a',
    fontSize: 12,
  },
  scanOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  scanBox: {
    width: 250,
    height: 250,
    position: 'relative',
    backgroundColor: 'transparent',
  },
  cornerTopLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 40,
    height: 40,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#6366f1',
  },
  cornerTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 40,
    height: 40,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: '#6366f1',
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 40,
    height: 40,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#6366f1',
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: '#6366f1',
  },
  scanText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  permissionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default ScanScreen;
