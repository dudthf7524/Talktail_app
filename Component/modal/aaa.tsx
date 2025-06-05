import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from 'react-native';

interface FindIdModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (deviceCode: string) => void;
  findIdSuccess?: boolean;
  foundId?: string;
}

const FindIdModal = ({ visible, onClose, onSubmit, findIdSuccess, foundId }: FindIdModalProps) => {
  const [deviceCode, setDeviceCode] = useState('');

  const handleSubmit = () => {
    if (deviceCode.trim()) {
      onSubmit(deviceCode);
    }
  };

  const handleClose = () => {
    setDeviceCode('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>아이디 찾기</Text>
          
          {!findIdSuccess ? (
            <>
              <Text style={styles.description}>
                등록된 디바이스 코드를 입력해주세요.
              </Text>
              
              <TextInput
                style={styles.input}
                value={deviceCode}
                onChangeText={setDeviceCode}
                placeholder="디바이스 코드를 입력하세요"
                placeholderTextColor="#999999"
              />

              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
                  <Text style={styles.cancelButtonText}>취소</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                  <Text style={styles.submitButtonText}>확인</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <View style={styles.successContainer}>
                <Text style={styles.successTitle}>아이디 찾기 성공</Text>
                <Text style={styles.successDescription}>
                  등록된 아이디는 다음과 같습니다:
                </Text>
                <View style={styles.idContainer}>
                  <Text style={styles.foundId}>{foundId}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                <Text style={styles.closeButtonText}>확인</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#F0663F',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  successContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F0663F',
    marginBottom: 15,
  },
  successDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  idContainer: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  foundId: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    backgroundColor: '#F0663F',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FindIdModal; 