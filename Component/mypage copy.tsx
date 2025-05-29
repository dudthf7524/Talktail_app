import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import Header from './header';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ConfirmModal from './modal/confirmModal';
import MessageModal from './modal/messageModal';
import { orgStore } from '../store/orgStore';
import { removeToken } from '../utils/token';

type RootStackParamList = {
  MypageChangeInfo: undefined;
  MypageChangePW: undefined;
  Login: undefined;
  // Add other screens as needed
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Mypage = () => {
  const navigation = useNavigation<NavigationProp>();
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [openMessageModal, setOpenMessageModal] = useState(false);
  const { logout } = orgStore();
  const handleLogout = async() => {
    try {
      await logout();
      await removeToken();
      setOpenMessageModal(true);
      setTimeout(() => {
        navigation.navigate('Login');
      }, 2000);
    } catch(error) {
      console.error(error);
    }
  };

  return (
    <>
      <Header title="마이페이지"/>
      <SafeAreaView style={styles.container}>
        <View style={styles.article_container}>
          <View style={styles.cs_container}>
              <View style={styles.cs_title_box}>
                <Text style={styles.cs_title}>E-mail</Text>
                <Text style={styles.cs_title}>연락처</Text>
              </View>
              <View style={styles.cs_text_box}>
                <Text style={styles.cs_text}>talktail@creamoff.co.kr</Text>
                <Text style={styles.cs_text}>010-4898-5955</Text>
              </View>
          </View>
          <View style={styles.btn_container}>
            <TouchableOpacity style={styles.btn_box} onPress={() => navigation.navigate('MypageChangeInfo')}>
              <View style={styles.btn}> 
                <Text style={styles.btn_text}>정보 수정</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn_box} onPress={() => navigation.navigate('MypageChangePW')}>
              <View style={styles.btn}>
                <Text style={styles.btn_text}>비밀번호 수정</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={styles.logout_btn} onPress={() => setOpenConfirmModal(true)}>
          <Text style={styles.logout_btn_text}>로그아웃</Text>
        </TouchableOpacity>
      </SafeAreaView>
      <ConfirmModal
        visible={openConfirmModal}
        title="로그아웃"
        content="로그아웃 하시겠습니까?"
        confirmText="로그아웃"
        cancelText="취소"
        onCancel={() => setOpenConfirmModal(false)}
        onConfirm={handleLogout}
      />
      <MessageModal
        visible={openMessageModal}
        title="로그아웃 완료"
        content="로그인 화면으로 이동됩니다."
        onClose={() => setOpenMessageModal(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "auto",
    backgroundColor: '#FFFFFF',
    display:"flex",
    flexDirection: "column",
    alignItems: "center",
  },
  article_container: {
    width: "80%",
    height: "auto",
    borderWidth: 1,
    borderColor: "black",
    marginTop: 100,
    display: "flex",
    alignItems: "center",
  },
  cs_container: {
    width: "90%",
    height: "auto",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "black",
    marginTop: 20,
    marginBottom: 10,
    paddingBottom: 10,
  },
  cs_title_box: {
    width: "25%",
    height: 70,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  cs_title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#F5B75C",
  },
  cs_text_box: {
    width: "75%",
    height: 70,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  cs_text: {
    fontSize: 16,
    color: "black",
    textAlign: "right",
  },
  btn_container: {
    width: 240,
    height: 100,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 20,
  },
  btn_box: {
    width: 100,
    height: "100%",
    borderWidth: 1,
    borderColor: "#F0663F",
    backgroundColor: "#F0663F",
    borderRadius: 6,
  },
  btn: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  btn_text: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  logout_btn: {
    width: "50%",
    height: 35,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#F0663F",
    borderRadius: 6,
    marginTop: 60,
    marginBottom: 70,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logout_btn_text: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#F0663F",
  }
});

export default Mypage; 