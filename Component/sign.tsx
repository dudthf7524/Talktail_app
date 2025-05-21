import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Header from './header';
import AlertModal from '../Component/modal/alertModal';
import axios from 'axios';
import { API_URL } from './constant/contants';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { deviceStore } from '../store/deviceStore';

type RootStackParamList = {
  Login: undefined;
  Sign: undefined;
  // ... other screens
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type FormData = {
  deviceCode: string;
  org_name: string;
  org_address: string;
  org_id: string;
  org_pw: string;
  confirmPassword: string;
  org_phone: string;
  org_email: string;
};

type FormErrors = {
  [key in keyof FormData]?: string;
};

const SignUp = () => {
  const [formData, setFormData] = useState<FormData>({
    deviceCode: '',
    org_name: '',
    org_address: '',
    org_id: '',
    org_pw: '',
    confirmPassword: '',
    org_phone: '',
    org_email: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isIdChecked, setIsIdChecked] = useState(false);
  const [isDeviceCodeChecked, setIsDeviceCodeChecked] = useState(false);
  const [openAlertModal, setOpenAlertModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: '' });
  const navigation = useNavigation<NavigationProp>();
  const { checkCode, checkLoading, checkError } = deviceStore();

  // 전화번호 포맷팅 함수
  const formatPhoneNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{4})(\d{4})$/);
    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`;
    }
    return text;
  };

  // 디바이스 코드 확인
  const checkDeviceCode = async () => {
    if (!formData.deviceCode) {
      setErrors(prev => ({ ...prev, deviceCode: '디바이스 코드를 입력해주세요.' }));
      return;
    }

    try {
      console.log("aaformData.deviceCode : ", formData.deviceCode);
      await checkCode(formData.deviceCode);
      setErrors(prev => ({ ...prev, deviceCode: undefined }));
      setIsDeviceCodeChecked(true);
      setModalContent({
        title: '사용 가능',
        content: '사용 가능한 디바이스 코드입니다.',
      });
    } catch (error) {
      setIsDeviceCodeChecked(false);
      setModalContent({
        title: '사용 불가',
        content: checkError || '유효하지 않은 디바이스 코드입니다.',
      });
    }
    setOpenAlertModal(true);
  };

  // 아이디 중복 체크
  const checkIdDuplication = async () => {
    if (!formData.org_id) {
      setErrors(prev => ({ ...prev, org_id: '아이디를 입력해주세요.' }));
      return;
    }

    // if (formData.org_id.length < 4) {
    //   setErrors(prev => ({ ...prev, org_id: '아이디는 4자 이상이어야 합니다.' }));
    //   return;
    // }

    try {
      // TODO: 실제 API 호출로 대체
      const response = await axios.post(`${API_URL}/user/checkId`, {
        org_id : formData.org_id})

      // const data = await response.json();
      if (response.status === 400) {
        setErrors(prev => ({ ...prev, org_id: '이미 사용 중인 아이디입니다.' }));
        setIsIdChecked(false);
        setModalContent({
          title: '사용 불가',
          content: '이미 사용 중인 아이디입니다.',
        });
      } else {
        setErrors(prev => ({ ...prev, org_id: undefined }));
        setIsIdChecked(true);
        setModalContent({
          title: '사용 가능',
          content: '사용 가능한 아이디입니다.',
        });
      }
      setOpenAlertModal(true);
    } catch (error) {
      setModalContent({
        title: '오류',
        content: '아이디 중복 확인 중 오류가 발생했습니다.',
      });
      setOpenAlertModal(true);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.deviceCode) {
      newErrors.deviceCode = '디바이스 코드를 입력해주세요.';
    } else if (!isDeviceCodeChecked) {
      newErrors.deviceCode = '디바이스 코드 확인이 필요합니다.';
    }

    if (!formData.org_name) {
      newErrors.org_name = '기관 이름을 입력해주세요.';
    }

    if (!formData.org_address) {
      newErrors.org_address = '기관 주소를 입력해주세요.';
    }

    if (!formData.org_id) {
      newErrors.org_id = '아이디를 입력해주세요.';
    } else if (formData.org_id.length < 4) {
      newErrors.org_id = '아이디는 4자 이상이어야 합니다.';
    } else if (!isIdChecked) {
      newErrors.org_id = '아이디 중복 확인이 필요합니다.';
    }

    if (!formData.org_pw) {
      newErrors.org_pw = '비밀번호를 입력해주세요.';
    } else if (formData.org_pw.length < 8) {
      newErrors.org_pw = '비밀번호는 8자 이상이어야 합니다.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.';
    } else if (formData.org_pw !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    if (!formData.org_phone) {
      newErrors.org_phone = '전화번호를 입력해주세요.';
    } else if (!/^010-\d{4}-\d{4}$/.test(formData.org_phone)) {
      newErrors.org_phone = '올바른 전화번호 형식이 아닙니다.';
    }

    if (!formData.org_email) {
      newErrors.org_email = '이메일을 입력해주세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.org_email)) {
      newErrors.org_email = '올바른 이메일 형식이 아닙니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 회원가입 제출
  const handleSubmit = async () => {
    // if (!validateForm()) {
    //   return;
    // }

    try {
      const response = await axios.post(`${API_URL}/user/signup`, formData);

      console.log("response : ", response);
      if(response.status === 201) {
        Alert.alert(
          "회원 가입 완료",
          "로그인 화면으로 이동합니다.",
          [
            {
              text: "확인",
              onPress: () => navigation.navigate('Login')
            }
          ]
        );
      }
     
    } catch (error) {
      console.error("error : ", error);
      Alert.alert('오류', '회원가입 중 오류가 발생했습니다.');
    }
  };

  return (
    <>
      <Header title="회원가입" />
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <ScrollView style={styles.scrollView}>
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.deviceLabel}>디바이스 코드</Text>
                <View style={styles.idContainer}>
                  <TextInput
                    style={[styles.input, styles.idInput]}
                    value={formData.deviceCode}
                    onChangeText={(text) => {
                      setFormData(prev => ({ ...prev, deviceCode: text }));
                      setIsDeviceCodeChecked(false);
                    }}
                    placeholder="디바이스 코드를 입력하세요"
                  />
                  <TouchableOpacity
                    style={styles.checkButton}
                    onPress={checkDeviceCode}
                  >
                    <Text style={styles.checkButtonText}>확인</Text>
                  </TouchableOpacity>
                </View>
                {errors.deviceCode && (
                  <Text style={styles.errorText}>{errors.deviceCode}</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>기관 이름</Text>
                <TextInput
                  style={styles.input}
                  value={formData.org_name}
                  onChangeText={(text) => {
                    setFormData(prev => ({ ...prev, org_name: text }));
                    setErrors(prev => ({ ...prev, org_name: undefined }));
                  }}
                  placeholder="기관 이름을 입력하세요"
                />
                {errors.org_name && (
                  <Text style={styles.errorText}>{errors.org_name}</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>기관 주소</Text>
                <TextInput
                  style={styles.input}
                  value={formData.org_address}
                  onChangeText={(text) => {
                    setFormData(prev => ({ ...prev, org_address: text }));
                    setErrors(prev => ({ ...prev, org_address: undefined }));
                  }}
                  placeholder="기관 주소를 입력하세요"
                />
                {errors.org_address && (
                  <Text style={styles.errorText}>{errors.org_address}</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>아이디</Text>
                <View style={styles.idContainer}>
                  <TextInput
                    style={[styles.input, styles.idInput]}
                    value={formData.org_id}
                    onChangeText={(text) => {
                      setFormData(prev => ({ ...prev, org_id: text }));
                      setErrors(prev => ({ ...prev, org_id: undefined }));
                      setIsIdChecked(false);
                    }}
                    placeholder="아이디를 입력하세요"
                  />
                  <TouchableOpacity
                    style={styles.checkButton}
                    onPress={checkIdDuplication}
                  >
                    <Text style={styles.checkButtonText}>중복확인</Text>
                  </TouchableOpacity>
                </View>
                {errors.org_id && (
                  <Text style={styles.errorText}>{errors.org_id}</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>비밀번호</Text>
                <TextInput
                  style={styles.input}
                  value={formData.org_pw}
                  onChangeText={(text) => {
                    setFormData(prev => ({ ...prev, org_pw: text }));
                    setErrors(prev => ({ ...prev, org_pw: undefined }));
                  }}
                  placeholder="비밀번호를 입력하세요"
                  secureTextEntry
                />
                {errors.org_pw && (
                  <Text style={styles.errorText}>{errors.org_pw}</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>비밀번호 확인</Text>
                <TextInput
                  style={styles.input}
                  value={formData.confirmPassword}
                  onChangeText={(text) => {
                    setFormData(prev => ({ ...prev, confirmPassword: text }));
                    setErrors(prev => ({ ...prev, confirmPassword: undefined }));
                  }}
                  placeholder="비밀번호를 다시 입력하세요"
                  secureTextEntry
                />
                {errors.confirmPassword && (
                  <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>담당자 전화번호</Text>
                <TextInput
                  style={styles.input}
                  value={formData.org_phone}
                  onChangeText={(text) => {
                    const formatted = formatPhoneNumber(text);
                    setFormData(prev => ({ ...prev, org_phone: formatted }));
                    setErrors(prev => ({ ...prev, org_phone: undefined }));
                  }}
                  placeholder="010-0000-0000"
                  keyboardType="phone-pad"
                  maxLength={13}
                />
                {errors.org_phone && (
                  <Text style={styles.errorText}>{errors.org_phone}</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>담당자 이메일</Text>
                <TextInput
                  style={styles.input}
                  value={formData.org_email}
                  onChangeText={(text) => {
                    setFormData(prev => ({ ...prev, org_email: text }));
                    setErrors(prev => ({ ...prev, org_email: undefined }));
                  }}
                  placeholder="이메일을 입력하세요"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {errors.org_email && (
                  <Text style={styles.errorText}>{errors.org_email}</Text>
                )}
              </View>

              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>회원가입</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
      <AlertModal
        visible={openAlertModal}
        title={modalContent.title}
        content={modalContent.content}
        onClose={() => setOpenAlertModal(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  form: {
    padding: 20,
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
  deviceLabel: {
    fontSize: 20,
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
  idContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  idInput: {
    flex: 1,
    marginRight: 8,
  },
  checkButton: {
    backgroundColor: '#F0663F',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  checkButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
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
});

export default SignUp; 