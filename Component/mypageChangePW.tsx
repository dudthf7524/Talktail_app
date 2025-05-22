import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ConfirmModal from "../Component/modal/confirmModal";
import MessageModal from "../Component/modal/messageModal";
import AlertModal from "../Component/modal/alertModal";
import { orgStore } from '../store/orgStore';

type RootStackParamList = {
  Login: undefined;
  // 다른 스크린들도 여기에 추가할 수 있습니다
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface MypageChangePWProps {
  visible: boolean;
  onClose: () => void;
  org_id: string;
}

const MypageChangePW = ({ visible, onClose, org_id }: MypageChangePWProps) => {
  const navigation = useNavigation<NavigationProp>();
  const [formData, setFormData] = useState({
    currentPassword: org_id,
    newPassword: '',
    confirmPassword: '',
  });
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [openMessageModal, setOpenMessageModal] = useState(false);
  const [openAlertModal, setOpenAlertModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: '' });
  const { 
    changePW, 
    changePWSuccess, 
    changePWError,
    offChangePWSuccess,
    offChangePWError,
    logout 
  } = orgStore();

  const handleLogout = async () => {
    try {
      await logout();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      const sendData = { 
        org_pw: formData.currentPassword, 
        org_new_pw: formData.newPassword 
      };
      await changePW(sendData);
    } catch(e) {
      console.error(e);
    }
  }

  useEffect(() => {
    if(changePWSuccess) {
      setOpenConfirmModal(false);
      setModalContent({
        title: "비밀번호 변경 완료",
        content: "다시 로그인 해주세요."
      });
      setOpenMessageModal(true);
      offChangePWSuccess();
      const handleLogoutAndNavigate = async () => {
        try {
          await logout();
          await new Promise(resolve => setTimeout(resolve, 1500));
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        } catch (error) {
          console.error('Logout failed:', error);
        }
      };
      handleLogoutAndNavigate();
    }
  }, [changePWSuccess]);

  useEffect(() => {
    if(changePWError) {
      setOpenConfirmModal(false);
      setModalContent({
        title: "오류",
        content: changePWError
      });
      setOpenAlertModal(true);
      offChangePWError();
    }
  }, [changePWError]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>비밀번호 변경</Text>
          
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>아이디</Text>
              <TextInput
                style={[styles.input, { backgroundColor: '#f5f5f5' }]}
                value={org_id}
                editable={false}
                placeholder="아이디"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>기존 비밀번호</Text>
              <TextInput
                style={styles.input}
                value={formData.currentPassword}
                onChangeText={(text) => setFormData(prev => ({ ...prev, currentPassword: text }))}
                placeholder="기존 비밀번호를 입력하세요"
                secureTextEntry
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>새 비밀번호</Text>
              <TextInput
                style={styles.input}
                value={formData.newPassword}
                onChangeText={(text) => setFormData(prev => ({ ...prev, newPassword: text }))}
                placeholder="새 비밀번호를 입력하세요"
                secureTextEntry
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>새 비밀번호 확인</Text>
              <TextInput
                style={styles.input}
                value={formData.confirmPassword}
                onChangeText={(text) => setFormData(prev => ({ ...prev, confirmPassword: text }))}
                placeholder="새 비밀번호를 다시 입력하세요"
                secureTextEntry
              />
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>취소하기</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitButton} onPress={()=>{
                setOpenConfirmModal(true);
              }}>
                <Text style={styles.submitButtonText}>변경하기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      <AlertModal
        visible={openAlertModal}
        title={modalContent.title}
        content={modalContent.content}
        onClose={() => setOpenAlertModal(false)}
      />
      <ConfirmModal
        visible={openConfirmModal}
        title="비밀번호 변경"
        content="비밀번호를 변경하시겠습니까?"
        confirmText="변경"
        cancelText="취소"
        onCancel={() => setOpenConfirmModal(false)}
        onConfirm={handleSubmit}
      />
      <MessageModal
        visible={openMessageModal}
        title={modalContent.title}
        content={modalContent.content}
        onClose={() => setOpenMessageModal(false)}
      />
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
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#F0663F',
    marginBottom: 20,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#F5B75C',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    color: '#262626',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#E0E0E0',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666666',
    fontSize: 18,
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#F0663F',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default MypageChangePW;