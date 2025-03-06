import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { BrowserQRCodeReader } from '@zxing/browser';

interface WebScannerProps {
  onScan: (result: { type: string; data: string }) => void;
  isActive: boolean;
}

export default function WebScanner({ onScan, isActive }: WebScannerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const codeReader = useRef(new BrowserQRCodeReader());

  useEffect(() => {
    if (!isActive || !videoRef.current) return;

    const startScanning = async () => {
      try {
        const videoInputDevices =
          await BrowserQRCodeReader.listVideoInputDevices();
        const selectedDeviceId = videoInputDevices[0].deviceId;

        await codeReader.current.decodeFromVideoDevice(
          selectedDeviceId,
          videoRef.current,
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
      }
    };

    startScanning();

    return () => {
      // Check if stopAsyncDecode exists before calling it
      if (codeReader.current.stopAsyncDecode) {
        codeReader.current.stopAsyncDecode();
      }
    };
  }, [isActive, onScan]);

  return (
    <View style={styles.container}>
      <video ref={videoRef} style={styles.video} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 12,
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
});
