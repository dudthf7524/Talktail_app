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
} from 'react-native';
import Header from './header';
import DateTimePicker from '@react-native-community/datetimepicker';
import SelectDropdown from 'react-native-select-dropdown';

type PetData = {
  name: string;
  birthDate: Date;
  breed: string;
  gender: 'male' | 'female';
  isNeutered: boolean;
  diseases: string;
};

const RegisterPet = () => {
  const [petData, setPetData] = useState<PetData>({
    name: '',
    birthDate: new Date(),
    breed: '',
    gender: 'male',
    isNeutered: false,
    diseases: '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setPetData(prev => ({ ...prev, birthDate: selectedDate }));
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const handleSubmit = () => {
    // TODO: API 호출로 데이터 전송
    console.log('Pet Data:', petData);
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
      <Header title="반려견 정보 입력" />
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <ScrollView style={styles.scrollView}>
            <View style={styles.form}>
              {/* 반려견 이름 */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>반려견 이름</Text>
                <TextInput
                  style={styles.input}
                  value={petData.name}
                  onChangeText={(text) => setPetData(prev => ({ ...prev, name: text }))}
                  placeholder="반려견 이름을 입력하세요"
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
                    {formatDate(petData.birthDate)}
                  </Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={petData.birthDate}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                    maximumDate={new Date()}
                  />
                )}
              </View>

              {/* 견종 */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>견종</Text>
                <SelectDropdown
                  data={breeds}
                  onSelect={(selectedItem) => {
                    setPetData(prev => ({ ...prev, breed: selectedItem.value }));
                  }}
                  defaultButtonText="견종을 선택하세요"
                  buttonTextAfterSelection={(selectedItem) => selectedItem.label}
                  rowTextForSelection={(item) => item.label}
                  buttonStyle={styles.dropdownButton}
                  buttonTextStyle={styles.dropdownButtonText}
                  dropdownStyle={styles.dropdown}
                  rowStyle={styles.dropdownRow}
                  rowTextStyle={styles.dropdownRowText}
                />
              </View>

              {/* 성별 */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>성별</Text>
                <View style={styles.radioGroup}>
                  <TouchableOpacity
                    style={[
                      styles.radioButton,
                      petData.gender === 'male' && styles.radioButtonSelected,
                    ]}
                    onPress={() => setPetData(prev => ({ ...prev, gender: 'male' }))}
                  >
                    <Text style={[
                      styles.radioButtonText,
                      petData.gender === 'male' && styles.radioButtonTextSelected,
                    ]}>수컷</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.radioButton,
                      petData.gender === 'female' && styles.radioButtonSelected,
                    ]}
                    onPress={() => setPetData(prev => ({ ...prev, gender: 'female' }))}
                  >
                    <Text style={[
                      styles.radioButtonText,
                      petData.gender === 'female' && styles.radioButtonTextSelected,
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
                      petData.isNeutered && styles.radioButtonSelected,
                    ]}
                    onPress={() => setPetData(prev => ({ ...prev, isNeutered: true }))}
                  >
                    <Text style={[
                      styles.radioButtonText,
                      petData.isNeutered && styles.radioButtonTextSelected,
                    ]}>예</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.radioButton,
                      !petData.isNeutered && styles.radioButtonSelected,
                    ]}
                    onPress={() => setPetData(prev => ({ ...prev, isNeutered: false }))}
                  >
                    <Text style={[
                      styles.radioButtonText,
                      !petData.isNeutered && styles.radioButtonTextSelected,
                    ]}>아니오</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* 앓고 있는 질병 */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>앓고 있는 질병</Text>
                <TextInput
                  style={styles.textArea}
                  value={petData.diseases}
                  onChangeText={(text) => setPetData(prev => ({ ...prev, diseases: text }))}
                  placeholder="앓고 있는 질병을 입력하세요"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>저장하기</Text>
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
});

export default RegisterPet; 