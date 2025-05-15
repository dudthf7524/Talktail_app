import React, { useState, useEffect } from 'react';
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
import SelectDropdown from 'react-native-select-dropdown';
import { usePetStore } from '../store/useStore';
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

const EditPet = ({ route, navigation }) => {
  const { pet } = route.params;
  const { updatePet, updateLoading, updateError, fetchPets } = usePetStore();
  const [openMessageModal, setOpenMessageModal] = useState(false);
  const [formData, setFormData] = useState<PetData>({
    name: '',
    birth: new Date(),
    breed: '',
    gender: true,
    isNeutered: false,
    disease: '',
  });

  useEffect(() => {
    // Convert string date to Date object
    const [year, month, day] = pet.birth.split('-').map(Number);
    const birthDate = new Date(year, month - 1, day);

    setFormData({
      name: pet.name,
      birth: birthDate,
      breed: pet.breed,
      gender: pet.gender,
      isNeutered: pet.isNeutered,
      disease: pet.disease,
    });
  }, [pet]);

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

  const handleUpdate = async () => {
    try {
      const token = await getToken();
      if (!token) {
        Alert.alert("오류", "로그인해주세요.");
        navigation.navigate('Login');
        return;
      }

      const { device_code } = token;
      if (!device_code) {
        Alert.alert("오류", "디바이스 코드를 찾을 수 없습니다. 다시 로그인해주세요.");
        return;
      }

      const petData = {
        ...formData,
        birth: formData.birth.getFullYear().toString() + '-' +
               (formData.birth.getMonth() + 1).toString().padStart(2, '0') + '-' +
               formData.birth.getDate().toString().padStart(2, '0'),
        device_code,
        pet_code: pet.pet_code
      };

      await updatePet(petData);
      setOpenMessageModal(true);
      await fetchPets();
      navigation.navigate('PetLists');
    } catch (error) {
      console.error('Error updating pet:', error);
      Alert.alert("수정 실패", "펫 정보 수정에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const breeds = [
    { label: '견종을 선택하세요', value: '' },
    { label: '리트리버', value: 'retriever' },
    { label: '말티즈', value: 'maltese' },
    { label: '푸들', value: 'poodle' },
    { label: '진돗개', value: 'jindo' },
    { label: '시바견', value: 'shiba' },
    { label: '기타', value: 'other' },
  ];

  return (
    <>
      <Header title="반려동물 정보 수정" />
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
                  placeholderTextColor="#999999"
                />
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
              </View>

              {/* 견종 */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>품종</Text>
                <TextInput
                  style={styles.input}
                  value={formData.breed}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, breed: text }))}
                  placeholder="품종을 입력하세요(ex : 말티즈, 푸들)"
                  placeholderTextColor="#999999"
                />
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
                  placeholderTextColor="#999999"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              <TouchableOpacity 
                style={[styles.submitButton, updateLoading && styles.submitButtonDisabled]} 
                onPress={handleUpdate}
                disabled={updateLoading}
              >
                <Text style={styles.submitButtonText}>
                  {updateLoading ? '수정 중...' : '수정하기'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
      <MessageModal
        visible={openMessageModal}
        title="수정 완료"
        content="반려동물 정보가 수정되었습니다."
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

export default EditPet; 