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

type FormData = {
  hospitalName: string;
  address: string;
  id: string;
  password: string;
  confirmPassword: string;
  phone: string;
  email: string;
};

type FormErrors = {
  [key in keyof FormData]?: string;
};

const SignUp = () => {
  const [formData, setFormData] = useState<FormData>({
    hospitalName: '',
    address: '',
    id: '',
    password: '',
    confirmPassword: '',
    phone: '',
    email: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isIdChecked, setIsIdChecked] = useState(false);

  // 전화번호 포맷팅 함수
  const formatPhoneNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{4})(\d{4})$/);
    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`;
    }
    return text;
  };

  // 아이디 중복 체크
  const checkIdDuplication = async () => {
    if (!formData.id) {
      setErrors(prev => ({ ...prev, id: '아이디를 입력해주세요.' }));
      return;
    }

    if (formData.id.length < 4) {
      setErrors(prev => ({ ...prev, id: '아이디는 4자 이상이어야 합니다.' }));
      return;
    }

    try {
      // TODO: 실제 API 호출로 대체
      const response = await fetch('YOUR_API_ENDPOINT/check-id', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: formData.id }),
      });

      const data = await response.json();
      if (data.isDuplicate) {
        setErrors(prev => ({ ...prev, id: '이미 사용 중인 아이디입니다.' }));
        setIsIdChecked(false);
      } else {
        setErrors(prev => ({ ...prev, id: undefined }));
        setIsIdChecked(true);
        Alert.alert('사용 가능', '사용 가능한 아이디입니다.');
      }
    } catch (error) {
      Alert.alert('오류', '아이디 중복 확인 중 오류가 발생했습니다.');
    }
  };

  // 유효성 검사
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.hospitalName) {
      newErrors.hospitalName = '병원 이름을 입력해주세요.';
    }

    if (!formData.address) {
      newErrors.address = '병원 주소를 입력해주세요.';
    }

    if (!formData.id) {
      newErrors.id = '아이디를 입력해주세요.';
    } else if (formData.id.length < 4) {
      newErrors.id = '아이디는 4자 이상이어야 합니다.';
    } else if (!isIdChecked) {
      newErrors.id = '아이디 중복 확인이 필요합니다.';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (formData.password.length < 8) {
      newErrors.password = '비밀번호는 8자 이상이어야 합니다.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    if (!formData.phone) {
      newErrors.phone = '전화번호를 입력해주세요.';
    } else if (!/^010-\d{4}-\d{4}$/.test(formData.phone)) {
      newErrors.phone = '올바른 전화번호 형식이 아닙니다.';
    }

    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 회원가입 제출
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      // TODO: 실제 API 호출로 대체
      const response = await fetch('YOUR_API_ENDPOINT/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        Alert.alert('성공', '회원가입이 완료되었습니다.');
        // TODO: 로그인 페이지로 이동
      } else {
        Alert.alert('오류', '회원가입 중 오류가 발생했습니다.');
      }
    } catch (error) {
      Alert.alert('오류', '회원가입 중 오류가 발생했습니다.');
    }
  };

  return (
    <>
      <Header title="회원가입" />
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <ScrollView style={styles.scrollView}>
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>병원 이름</Text>
                <TextInput
                  style={styles.input}
                  value={formData.hospitalName}
                  onChangeText={(text) => {
                    setFormData(prev => ({ ...prev, hospitalName: text }));
                    setErrors(prev => ({ ...prev, hospitalName: undefined }));
                  }}
                  placeholder="병원 이름을 입력하세요"
                />
                {errors.hospitalName && (
                  <Text style={styles.errorText}>{errors.hospitalName}</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>병원 주소</Text>
                <TextInput
                  style={styles.input}
                  value={formData.address}
                  onChangeText={(text) => {
                    setFormData(prev => ({ ...prev, address: text }));
                    setErrors(prev => ({ ...prev, address: undefined }));
                  }}
                  placeholder="병원 주소를 입력하세요"
                />
                {errors.address && (
                  <Text style={styles.errorText}>{errors.address}</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>아이디</Text>
                <View style={styles.idContainer}>
                  <TextInput
                    style={[styles.input, styles.idInput]}
                    value={formData.id}
                    onChangeText={(text) => {
                      setFormData(prev => ({ ...prev, id: text }));
                      setErrors(prev => ({ ...prev, id: undefined }));
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
                  secureTextEntry
                />
                {errors.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
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
                  value={formData.phone}
                  onChangeText={(text) => {
                    const formatted = formatPhoneNumber(text);
                    setFormData(prev => ({ ...prev, phone: formatted }));
                    setErrors(prev => ({ ...prev, phone: undefined }));
                  }}
                  placeholder="010-0000-0000"
                  keyboardType="phone-pad"
                  maxLength={13}
                />
                {errors.phone && (
                  <Text style={styles.errorText}>{errors.phone}</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>담당자 이메일</Text>
                <TextInput
                  style={styles.input}
                  value={formData.email}
                  onChangeText={(text) => {
                    setFormData(prev => ({ ...prev, email: text }));
                    setErrors(prev => ({ ...prev, email: undefined }));
                  }}
                  placeholder="이메일을 입력하세요"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}
              </View>

              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>회원가입</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
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