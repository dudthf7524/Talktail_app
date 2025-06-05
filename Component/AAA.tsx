import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Header from './header';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ConfirmModal from './modal/confirmModal';
import MessageModal from './modal/messageModal';
import PasswordConfirmModal from './modal/passwordConfirmModal';
import { orgStore } from '../store/orgStore';
import { removeToken } from '../utils/token';

type RootStackParamList = {
  Login: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const MypageOut = () => {
  const navigation = useNavigation<NavigationProp>();
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [openMessageModal, setOpenMessageModal] = useState(false);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [openAlertModal, setOpenAlertModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: '' });
  const [modalObject, setModalObject] = useState({
    visible: false,
    title: '',
    content: '',
    confirmText: '',
    cancelText: '',
    action: 'logout' as 'logout' | 'withdrawal'
  });
  const { logout, withdrawal, verifyPassword } = orgStore();

  const handleConfirm = async () => {
    if (modalObject.action === 'logout') {
      try {
        await logout();
        await removeToken();
        setOpenMessageModal(true);
        setTimeout(() => {
          navigation.navigate('Login');
        }, 2000);
      } catch (error) {
        console.error(error);
      }
    } else if (modalObject.action === 'withdrawal') {
      try {
        await withdrawal();
        await removeToken();
        setOpenMessageModal(true);
        setTimeout(() => {
          navigation.navigate('Login');
        }, 2000);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handlePasswordConfirm = async (password: string) => {
    console.log(password)
    try {
      // const isValid = await verifyPassword(password);
      if (0 === 0) {
        setOpenPasswordModal(false);
        setModalObject({
          visible: true,
          title: '회원탈퇴',
          content: withdrawalNotice,
          confirmText: '탈퇴하기',
          cancelText: '취소',
          action: 'withdrawal'
        });
        setOpenConfirmModal(true);
      } else {
        setModalContent({
          title: "오류",
          content: "비밀번호가 일치하지 않습니다."
        });
        setOpenAlertModal(true);
      }
    } catch (error) {
      console.error(error);
      setModalContent({
        title: "오류",
        content: "비밀번호 확인 중 오류가 발생했습니다."
      });
      setOpenAlertModal(true);
    }
  };

  const withdrawalNotice = `회원탈퇴 시 주의사항

1. 데이터 보관
- 회원탈퇴 시 즉시 모든 개인정보가 삭제됩니다.
- 다만, 관련 법령에 따라 보존이 필요한 정보는 일정 기간 보관됩니다.
  • 계약 또는 청약철회 등에 관한 기록: 5년
  • 대금결제 및 재화 등의 공급에 관한 기록: 5년
  • 소비자의 불만 또는 분쟁처리에 관한 기록: 3년

2. 탈퇴 후 영향
- 탈퇴 후에는 기존 계정으로 로그인이 불가능합니다.
- 보유하고 계신 포인트, 쿠폰 등은 모두 소멸됩니다.
- 재가입 시에도 이전 데이터는 복구되지 않습니다.

3. 탈퇴 전 확인사항
- 진행 중인 거래가 있다면 완료 후 탈퇴를 진행해주세요.
- 미사용 포인트나 쿠폰이 있다면 사용 후 탈퇴를 진행해주세요.

위 내용을 모두 확인하셨습니까?`;

  return (
    <>
      <Header title="개인 설정" />
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>계정 관리</Text>
            <TouchableOpacity
              style={[styles.button, styles.logoutButton]}
              onPress={() => {
                setModalObject({
                  visible: true,
                  title: '로그아웃',
                  content: '로그아웃 하시겠습니까?',
                  confirmText: '로그아웃',
                  cancelText: '취소',
                  action: 'logout'
                });
                setOpenConfirmModal(true);
              }}
            >
              <Text style={styles.buttonText}>로그아웃</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>회원 탈퇴</Text>
            <Text style={styles.warningText}>
              개인정보 처리방침에 따라 데이터가 삭제됩니다.
            </Text>
            <TouchableOpacity
              style={[styles.button, styles.withdrawalButton]}
              onPress={() => setOpenPasswordModal(true)}
            >
              <Text style={[styles.buttonText, styles.withdrawalText]}>회원탈퇴</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
      <ConfirmModal
        visible={openConfirmModal}
        title={modalObject.title}
        content={modalObject.content}
        confirmText={modalObject.confirmText}
        cancelText={modalObject.cancelText}
        onCancel={() => setOpenConfirmModal(false)}
        onConfirm={handleConfirm}
      />
      <MessageModal
        visible={openMessageModal}
        title="회원탈퇴 완료"
        content="로그인 화면으로 이동됩니다."
        onClose={() => setOpenMessageModal(false)}
      />
      <PasswordConfirmModal
        visible={openPasswordModal}
        title="비밀번호 확인"
        content="비밀번호를 입력해주세요."
        confirmText="확인"
        cancelText="취소"
        onClose={() => setOpenPasswordModal(false)}
        onConfirm={handlePasswordConfirm}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  warningText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    lineHeight: 20,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0663F',
  },
  withdrawalButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F0663F',
  },
  withdrawalText: {
    color: '#FF3B30',
  },
});

export default MypageOut;