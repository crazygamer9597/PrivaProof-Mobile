import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform, Modal } from 'react-native';
import { BrowserQRCodeReader } from '@zxing/browser';
import { useTheme } from '../lib/ThemeContext';

interface WebScannerProps {
  onScan: (result: { type: string; data: string }) => void;
  isActive: boolean;
}

export default function WebScanner({ onScan, isActive }: WebScannerProps) {
  const { colors } = useTheme();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const codeReader = useRef(new BrowserQRCodeReader());
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);
  const [showCameraSelector, setShowCameraSelector] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const scanningRef = useRef(false);

  // Initialize cameras only once when component mounts
  useEffect(() => {
    if (!isActive) return;

    const loadCameras = async () => {
      try {
        const videoInputDevices = await BrowserQRCodeReader.listVideoInputDevices();
        setCameras(videoInputDevices);
        
        if (videoInputDevices.length > 0 && !selectedCamera) {
          setSelectedCamera(videoInputDevices[0].deviceId);
        }
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to load cameras:', error);
      }
    };

    loadCameras();

    return () => {
      // Clean up when component unmounts
      stopScanning();
    };
  }, [isActive]);

  // Handle camera selection changes
  useEffect(() => {
    if (!isActive || !isInitialized || !selectedCamera) return;
    
    // Stop any existing scanning before starting a new one
    stopScanning();
    
    // Start scanning with the selected camera
    startScanning();
    
    return () => {
      stopScanning();
    };
  }, [isActive, selectedCamera, isInitialized]);

  const stopScanning = () => {
    if (scanningRef.current) {
      try {
        // @ts-ignore - The method exists but TypeScript doesn't recognize it
        codeReader.current.stopAsyncDecode();
        scanningRef.current = false;
      } catch (e) {
        console.error('Error stopping scanner:', e);
      }
    }
  };

  const startScanning = async () => {
    if (!videoRef.current || !selectedCamera || scanningRef.current) return;
    
    try {
      scanningRef.current = true;
      
      await codeReader.current.decodeFromVideoDevice(
        selectedCamera,
        videoRef.current as HTMLVideoElement,
        (result) => {
          if (result) {
            onScan({
              type: result.getBarcodeFormat().toString(),
              data: result.getText(),
            });
          }
        }
      );
    } catch (error) {
      console.error('Failed to start scanner:', error);
      scanningRef.current = false;
    }
  };

  const handleCameraChange = (deviceId: string) => {
    setSelectedCamera(deviceId);
    setShowCameraSelector(false);
  };

  return (
    <View style={styles.container}>
      <video ref={videoRef} style={styles.video} />
      
      {cameras.length > 1 && (
        <View style={styles.cameraControls}>
          <TouchableOpacity 
            style={[styles.cameraButton, { backgroundColor: colors.primary }]}
            onPress={() => setShowCameraSelector(!showCameraSelector)}
          >
            <Text style={styles.cameraButtonText}>
              {showCameraSelector ? 'Hide Cameras' : 'Change Camera'}
            </Text>
          </TouchableOpacity>
          
          {Platform.OS === 'web' ? (
            // Web platform: show inline camera selector
            showCameraSelector && (
              <View style={[styles.cameraSelector, { backgroundColor: colors.card }]}>
                {cameras.map((camera) => (
                  <TouchableOpacity
                    key={camera.deviceId}
                    style={[
                      styles.cameraOption, 
                      { 
                        backgroundColor: selectedCamera === camera.deviceId ? colors.primary : colors.input,
                        borderColor: colors.border
                      }
                    ]}
                    onPress={() => handleCameraChange(camera.deviceId)}
                  >
                    <Text style={[
                      styles.cameraOptionText, 
                      { color: selectedCamera === camera.deviceId ? '#fff' : colors.text }
                    ]}>
                      {camera.label || `Camera ${cameras.indexOf(camera) + 1}`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )
          ) : (
            // Mobile platform: show modal camera selector
            <Modal
              visible={showCameraSelector}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setShowCameraSelector(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                  <Text style={[styles.modalTitle, { color: colors.text }]}>Select Camera</Text>
                  {cameras.map((camera) => (
                    <TouchableOpacity
                      key={camera.deviceId}
                      style={[
                        styles.modalOption, 
                        { 
                          backgroundColor: selectedCamera === camera.deviceId ? colors.primary : colors.input,
                          borderColor: colors.border
                        }
                      ]}
                      onPress={() => handleCameraChange(camera.deviceId)}
                    >
                      <Text style={[
                        styles.modalOptionText, 
                        { color: selectedCamera === camera.deviceId ? '#fff' : colors.text }
                      ]}>
                        {camera.label || `Camera ${cameras.indexOf(camera) + 1}`}
                      </Text>
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity 
                    style={[styles.closeButton, { backgroundColor: colors.primary }]}
                    onPress={() => setShowCameraSelector(false)}
                  >
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 12,
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  cameraControls: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 10,
  },
  cameraButton: {
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  cameraButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  cameraSelector: {
    position: 'absolute',
    bottom: 50,
    right: 0,
    width: 200,
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cameraOption: {
    padding: 10,
    borderRadius: 6,
    marginBottom: 5,
    borderWidth: 1,
  },
  cameraOptionText: {
    fontSize: 14,
  },
  // Modal styles for mobile
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalOption: {
    width: '100%',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
  },
  modalOptionText: {
    fontSize: 16,
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 10,
    padding: 12,
    borderRadius: 8,
    width: '100%',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});
