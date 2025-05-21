import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import Header from './header';
import DateTimePicker from '@react-native-community/datetimepicker';
import { userStore } from '../store/userStore';
import { getToken } from '../utils/storage';
import MessageModal from './modal/messageModal';

type PetData = {
  name: string;
  birth: Date;
  breed: string;
  gender: boolean;
  isNeutered: boolean;
  disease: string;
};

const RegisterPet = ({ navigation }) => {
  const [errors, setErrors] = useState<FormErrors>({});
  const { registerPet, registerLoading, fetchPets } = userStore();
  const [openMessageModal, setOpenMessageModal] = useState(false);
  const [formData, setFormData] = useState<PetData>({
    name: '',
    birth: new Date(2020, 0, 1),
    breed: '',
    gender: true,
    isNeutered: false,
    disease: '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData(prev => ({ ...prev, birth: selectedDate }));
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  type FormErrors = {
    [key in keyof PetData]?: string;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name) {
      newErrors.name = '반려동물 이름을 입력해주세요.';
    }

    if (!formData.birth) {
      newErrors.birth = '생년월일을 입력해주세요.';
    }

    if (!formData.breed) {
      newErrors.breed = '품종을 입력해주세요.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }
    try {
      const token = await getToken();
      if (!token) {
        Alert.alert("오류", "로그인해주세요.");
        navigation.navigate('Login');
        return;
      }

      const { device_code } = token;

      const petData = {
        ...formData,
        birth: formData.birth.getFullYear().toString() + '-' +
          (formData.birth.getMonth() + 1).toString().padStart(2, '0') + '-' +
          formData.birth.getDate().toString().padStart(2, '0'),
        device_code
      };

      await registerPet(petData);
      setOpenMessageModal(true);
      await fetchPets();
      navigation.navigate('PetLists');
    } catch (error) {
      console.error('Error registering pet:', error);
      Alert.alert("등록 실패", "펫 등록에 실패했습니다. 다시 시도해주세요.");
    }
  };


  return (
    <>
      <Header title="반려동물 등록" />
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <ScrollView style={styles.scrollView}>
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>반려동물 이름</Text>
                <TextInput
                  style={styles.input}
                  value={formData.name}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                  placeholder="반려동물 이름을 입력하세요"
                />
                {errors.name && (
                  <Text style={styles.errorText}>{errors.name}</Text>
                )}
              </View>

              {/* 생년월일 */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>생년월일</Text>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={styles.dateButtonText}>
                    {formatDate(formData.birth)}
                  </Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={formData.birth}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                    maximumDate={new Date()}
                  />
                )}
                {errors.birth && (
                  <Text style={styles.errorText}>{errors.birth}</Text>
                )}
              </View>

              {/* 견종 */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>품종</Text>
                <TextInput
                  style={styles.input}
                  value={formData.breed}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, breed: text }))}
                  placeholder="품종을 입력하세요(ex : 말티즈, 푸들)"
                />
                {errors.breed && (
                  <Text style={styles.errorText}>{errors.breed}</Text>
                )}
              </View>

              {/* 성별 */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>성별</Text>
                <View style={styles.radioGroup}>
                  <TouchableOpacity
                    style={[
                      styles.radioButton,
                      formData.gender && styles.radioButtonSelected,
                    ]}
                    onPress={() => setFormData(prev => ({ ...prev, gender: true }))}
                  >
                    <Text style={[
                      styles.radioButtonText,
                      formData.gender && styles.radioButtonTextSelected,
                    ]}>수컷</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.radioButton,
                      !formData.gender && styles.radioButtonSelected,
                    ]}
                    onPress={() => setFormData(prev => ({ ...prev, gender: false }))}
                  >
                    <Text style={[
                      styles.radioButtonText,
                      !formData.gender && styles.radioButtonTextSelected,
                    ]}>암컷</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* 중성화 여부 */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>중성화 여부</Text>
                <View style={styles.radioGroup}>
                  <TouchableOpacity
                    style={[
                      styles.radioButton,
                      formData.isNeutered && styles.radioButtonSelected,
                    ]}
                    onPress={() => setFormData(prev => ({ ...prev, isNeutered: true }))}
                  >
                    <Text style={[
                      styles.radioButtonText,
                      formData.isNeutered && styles.radioButtonTextSelected,
                    ]}>예</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.radioButton,
                      !formData.isNeutered && styles.radioButtonSelected,
                    ]}
                    onPress={() => setFormData(prev => ({ ...prev, isNeutered: false }))}
                  >
                    <Text style={[
                      styles.radioButtonText,
                      !formData.isNeutered && styles.radioButtonTextSelected,
                    ]}>아니오</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>병명</Text>
                <TextInput
                  style={styles.textArea}
                  value={formData.disease}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, disease: text }))}
                  placeholder="병명을 입력하세요"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              <TouchableOpacity
                style={[styles.submitButton, registerLoading && styles.submitButtonDisabled]}
                onPress={handleRegister}
                disabled={registerLoading}
              >
                <Text style={styles.submitButtonText}>
                  {registerLoading ? '등록 중...' : '등록하기'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
      <MessageModal
        visible={openMessageModal}
        title="등록 완료"
        content="반려동물이 등록되었습니다."
        onClose={() => setOpenMessageModal(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
  },
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
  dateButton: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#FFFFFF',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#262626',
  },
  dropdownButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#262626',
    textAlign: 'left',
  },
  dropdown: {
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderColor: '#E0E0E0',
  },
  dropdownRow: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  dropdownRowText: {
    fontSize: 16,
    color: '#262626',
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  radioButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  radioButtonSelected: {
    borderColor: '#F0663F',
    backgroundColor: '#F0663F',
  },
  radioButtonText: {
    fontSize: 16,
    color: '#262626',
  },
  radioButtonTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    color: '#262626',
    height: 100,
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
  submitButtonDisabled: {
    backgroundColor: '#cccccc',
  },
});

export default RegisterPet; 