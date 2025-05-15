import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from 'axios';
import { API_URL } from './constant/contants';
import { setToken, setDeviceCode } from '../utils/storage';
import MessageModal from './modal/messageModal';
type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  Dashboard: undefined;
  RegisterPet: undefined;
  PetLists: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type FormData = {
  id: string;
  password: string;
};

type FormErrors = {
  [key in keyof FormData]?: string;
};

const Login = ({ navigation }: { navigation: NavigationProp }) => {
  const [formData, setFormData] = useState<FormData>({
    id: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [openMessageModal, setOpenMessageModal] = useState<boolean>(false);
  // 유효성 검사
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.id) {
      newErrors.id = '아이디를 입력해주세요.';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 로그인 제출
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    // try {
    //   const response = await axios.post(`${API_URL}/user/login`, formData);

    //   if(response.status === 200){
    //     const token = response.data.data.token;

    //     await setToken(token);
    Alert.alert("로그인 성공");
    setOpenMessageModal(true);
    navigation.navigate('PetLists');
    //   }
    // } catch(e){
    //   console.error(e);
    //   Alert.alert("로그인 실패", "아이디 또는 비밀번호를 확인해주세요.");
    // }
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <Image source={require('../assets/images/talkTail_logo.png')} style={styles.logo} />
              <Text style={styles.subtitle}>반려동물은 Tail로 소통하고</Text>
              <Text style={styles.subtitle}>우리는 "Talktail"로 소통합니다.</Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>아이디</Text>
                <TextInput
                  style={styles.input}
                  value={formData.id}
                  onChangeText={(text) => {
                    setFormData(prev => ({ ...prev, id: text }));
                    setErrors(prev => ({ ...prev, id: undefined }));
                  }}
                  placeholder="아이디를 입력하세요"
                  placeholderTextColor="#999999"
                />
                {errors.id && (
                  <Text style={styles.errorText}>{errors.id}</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>비밀번호</Text>
                <TextInput
                  style={styles.input}
                  value={formData.password}
                  onChangeText={(text) => {
                    setFormData(prev => ({ ...prev, password: text }));
                    setErrors(prev => ({ ...prev, password: undefined }));
                  }}
                  placeholder="비밀번호를 입력하세요"
                  placeholderTextColor="#999999"
                  secureTextEntry
                />
                {errors.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}
              </View>

              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>로그인</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.signUpButton}
                onPress={() => navigation.navigate('SignUp')}
              >
                <Text style={styles.signUpButtonText}>회원가입</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
      <MessageModal
        visible={openMessageModal}
        title="로그인 성공"
        content="로그인이 성공적으로 완료되었습니다."
        onClose={() => setOpenMessageModal(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  logo: {
    width: 300,
    height: 100,
    marginBottom: 4
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#F0663F',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#F5B75C',
  },
  form: {
    flex: 1,
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
    color: '#333333',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#F0663F',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  signUpButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#F0663F',
  },
  signUpButtonText: {
    color: '#F0663F',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default Login; 