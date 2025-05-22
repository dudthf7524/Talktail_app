import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image
} from 'react-native';
import Header from './header';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { userStore } from '../store/userStore';
import type { Pet } from '../store/userStore';
import ConfirmModal from './modal/confirmModal';
import MessageModal from './modal/messageModal';

type RootStackParamList = {
  PetLists: undefined;
  RegisterPet: undefined;
  EditPet: {
    pet: {
      pet_code: string;
      name: string;
      birth: string;
      breed: string;
      gender: boolean;
      neutered: boolean;
      disease: string;
    };
  };
  Dashboard: {
    selectedPet: {
      name: string;
      gender: boolean;
      birth: string;
      breed: string;
      neutered: boolean;
      disease: string;
    };
  };
  ConnectBle: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const PetLists = ({ navigation }) => {
  const { pets, loadLoading, loadError, fetchPets, deletePet, deleteLoading, deleteError } = userStore();
  const [expandedPetId, setExpandedPetId] = useState<string | null>(null);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);
  const [deletePetId, setDeletePetId] = useState<string | null>(null);
  const [openMessageModal, setOpenMessageModal] = useState<boolean>(false);
  const toggleExpand = (petId: string) => {
    setExpandedPetId(expandedPetId === petId ? null : petId);
  };

  const handlePetSelect = (petId: string) => {
    setSelectedPetId(selectedPetId === petId ? null : petId);
  };

  const handleConnectBle = (pet: Pet) => {
    const selectedPet = pets.find((pet) => pet.pet_code === selectedPetId)
    navigation.navigate('ConnectBle', {
      selectedPet
      }
    );
  };

  useEffect(() => {
    fetchPets();
  }, []);

  if (loadLoading) {
    return (
      <View style={styles.container}>
        <Text>로딩 중...</Text>
      </View>
    );
  }
  // if (deleteLoading) {
  //   return (
  //     <View style={styles.container}>
  //       <Text>삭제 중...</Text>
  //     </View>
  //   );
  // }

  if (loadError) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{loadError}</Text>
      </View>
    );
  }
  if (deleteError) {  
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{deleteError}</Text>
      </View>
    );
  }

  const handleDelete = async () => {
    if (deletePetId) {
      await deletePet(deletePetId);
      setOpenConfirmModal(false); 
      setOpenMessageModal(true);
      fetchPets();
    }
  } 
  return (
    <>
      <Header title="반려견 목록" />
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.petList}>
            {pets.map((pet,index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.petCard,
                  selectedPetId === pet.pet_code && styles.selectedPetCard
                ]}
                onPress={() => handlePetSelect(pet.pet_code)}
              >
                <View style={styles.petInfo}>
                  <View style={styles.nameContainer}>
                    <Text style={styles.petName}>{pet.name}</Text>
                    {/* <Text style={styles.petBreed}>{pet.breed}</Text> */}
                    <View style={styles.btn_box}>
                      <TouchableOpacity 
                        style={styles.btn}
                        onPress={() => navigation.navigate('EditPet', { pet })}
                      >
                        <Image source={require('../assets/images/btn_edit.png')} style={styles.btn_icon} />
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.btn} 
                        onPress={() => {
                          setDeletePetId(pet.pet_code);
                          setOpenConfirmModal(true);
                        }}
                      >
                        <Image source={require('../assets/images/btn_delete.png')} style={styles.btn_icon} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.detailsContainer}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailText}>
                        생년월일: {pet.birth}
                      </Text>
                    </View>
                    <View style={styles.gender_breed_box}>
                      <Image source={pet.gender ? require("../assets/images/gender_male.png") : require("../assets/images/gender_female.png")} style={styles.gender_icon} />
                      <Text style={styles.breed_text}>{pet.breed}</Text>
                    </View>
                  </View>
                  {expandedPetId === pet.pet_code && (
                    <View style={styles.diseasesContainer}>
                      <Text style={styles.isNeuteredText}>중성화 여부 : {pet.neutered ? '완료' : '미완료'}</Text>
                      <Text style={styles.diseasesTitle}>앓고 있는 질병</Text>
                      <Text style={styles.diseasesText}>{pet.disease}</Text>
                    </View>
                  )}
                  <TouchableOpacity
                    style={styles.moreButton}
                    onPress={() => toggleExpand(pet.pet_code)}
                  >
                    <Text style={styles.moreButtonText}>
                      {expandedPetId === pet.pet_code ? '접기' : '상세보기'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        <TouchableOpacity
          style={styles.addButton}
          onPress={selectedPetId ? handleConnectBle : () => navigation.navigate('RegisterPet')}
        >
          <Text style={styles.addButtonText}>
            {selectedPetId ? '모니터링 보기' : '반려동물 등록하기'}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
      <ConfirmModal
        visible={openConfirmModal}
        title="삭제 확인"
        content="정말로 삭제하시겠습니까?"
        confirmText="삭제"
        cancelText="취소"
        onConfirm={handleDelete}
        onCancel={() => setOpenConfirmModal(false)}
      />
      <MessageModal
        visible={openMessageModal}
        title="삭제 완료"
        content="펫이 삭제되었습니다."
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
  isNeuteredText: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
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
    fontSize: 13,
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
    backgroundColor: '#FFC4B4',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  btn_box: {
    width: 60,
    height: 24,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  btn: {
    width: 24,
    height: 24,
  },
  btn_icon : {
    width: '100%',
    height: '100%',
  },
  gender_breed_box :{
    width: '100%',
    height: 16,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 0,
  },
  gender_icon : {
    width: 16,
    height: 16,
  },
  breed_text : {
    width: 'auto',
    height: 16,
    fontSize: 14,
    color: '#666666',
    margin: 0,
  }
});

export default PetLists; 