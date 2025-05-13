import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import Header from './header';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  PetLists: undefined;
  RegisterPet: undefined;
  Dashboard: {
    selectedPet: {
      name: string;
      gender: string;
      birthDate: string;
      breed: string;
      isNeutered: boolean;
      diseases: string;
    };
  };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type PetData = {
  id: string;
  name: string;
  birthDate: string;
  breed: string;
  gender: 'male' | 'female';
  isNeutered: boolean;
  diseases: string;
};

// 샘플 데이터
const samplePets: PetData[] = [
  {
    id: '1',
    name: '멍멍이',
    birthDate: '2020-05-15',
    breed: '리트리버',
    gender: 'male',
    isNeutered: true,
    diseases: '심장사상충, 슬개골 탈구',
  },
  {
    id: '2',
    name: '초코',
    birthDate: '2021-03-20',
    breed: '말티즈',
    gender: 'female',
    isNeutered: false,
    diseases: '없음',
  },
  {
    id: '3',
    name: '바둑이',
    birthDate: '2019-11-08',
    breed: '진돗개',
    gender: 'male',
    isNeutered: true,
    diseases: '관절염',
  },
  {
    id: '4',
    name: '나비',
    birthDate: '2022-01-30',
    breed: '푸들',
    gender: 'female',
    isNeutered: false,
    diseases: '없음',
  },
  {
    id: '5',
    name: '단비',
    birthDate: '2021-07-12',
    breed: '시바견',
    gender: 'male',
    isNeutered: true,
    diseases: '알레르기성 피부염',
  },
];

const PetLists = () => {
  const navigation = useNavigation<NavigationProp>();
  const [expandedPetId, setExpandedPetId] = useState<string | null>(null);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  const toggleExpand = (petId: string) => {
    setExpandedPetId(expandedPetId === petId ? null : petId);
  };

  const handlePetSelect = (pet: PetData) => {
    setSelectedPetId(selectedPetId === pet.id ? null : pet.id);
  };

  const handleMonitoringPress = () => {
    console.log("AA");
    if (selectedPetId) {
      const selectedPet = samplePets.find(pet => pet.id === selectedPetId);
      if (selectedPet) {
        navigation.navigate('Dashboard', {
          selectedPet: {
            name: selectedPet.name,
            gender: selectedPet.gender,
            birthDate: selectedPet.birthDate,
            breed: selectedPet.breed,
            isNeutered: selectedPet.isNeutered,
            diseases: selectedPet.diseases
          }
        });
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  return (
    <>
      <Header title="반려견 목록" />
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.petList}>
            {samplePets.map((pet) => (
              <TouchableOpacity
                key={pet.id}
                style={[
                  styles.petCard,
                  selectedPetId === pet.id && styles.selectedPetCard
                ]}
                onPress={() => handlePetSelect(pet)}
              >
                <View style={styles.petInfo}>
                  <View style={styles.nameContainer}>
                    <Text style={styles.petName}>{pet.name}</Text>
                    <Text style={styles.petBreed}>{pet.breed}</Text>
                  </View>
                  <View style={styles.detailsContainer}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailText}>
                        생년월일: {formatDate(pet.birthDate)}
                      </Text>
                      <Text style={styles.detailText}>
                        성별: {pet.gender === 'male' ? '수컷' : '암컷'}
                      </Text>
                    </View>
                    <Text style={styles.detailText}>
                      중성화: {pet.isNeutered ? '완료' : '미완료'}
                    </Text>
                  </View>
                  {expandedPetId === pet.id && (
                    <View style={styles.diseasesContainer}>
                      <Text style={styles.diseasesTitle}>앓고 있는 질병</Text>
                      <Text style={styles.diseasesText}>{pet.diseases}</Text>
                    </View>
                  )}
                  <TouchableOpacity
                    style={styles.moreButton}
                    onPress={() => toggleExpand(pet.id)}
                  >
                    <Text style={styles.moreButtonText}>
                      {expandedPetId === pet.id ? '접기' : '질병보기'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        <TouchableOpacity
          style={styles.addButton}
          onPress={selectedPetId ? handleMonitoringPress : () => navigation.navigate('RegisterPet')}
        >
          <Text style={styles.addButtonText}>
            {selectedPetId ? '모니터링 보기' : '반려견 등록하기'}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
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
  petList: {
    padding: 16,
  },
  petCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  petInfo: {
    gap: 6,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  petName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F0663F',
  },
  petBreed: {
    fontSize: 14,
    color: '#F5B75C',
    fontWeight: '600',
  },
  detailsContainer: {
    gap: 4,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailText: {
    fontSize: 14,
    color: '#666666',
  },
  diseasesContainer: {
    marginTop: 6,
    padding: 10,
    backgroundColor: '#FFF5F2',
    borderRadius: 8,
  },
  diseasesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F0663F',
    marginBottom: 4,
  },
  diseasesText: {
    fontSize: 14,
    color: '#666666',
  },
  moreButton: {
    alignSelf: 'flex-end',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 4,
    backgroundColor: '#F5B75C',
  },
  moreButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#F0663F',
    margin: 12,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  selectedPetCard: {
    borderColor: '#F0663F',
    borderWidth: 2,
    backgroundColor: '#FFF5F2',
  },
});

export default PetLists; 