import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';

const RecordLists = ({selectedDate, selectedPetCode}: {selectedDate: string, selectedPetCode: string}) => {
  console.log("selectedDate", selectedDate);
  console.log("selectedPetCode", selectedPetCode);

  
  return (
    <>
      <SafeAreaView style={styles.container}>
      </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  }
})

export default RecordLists;