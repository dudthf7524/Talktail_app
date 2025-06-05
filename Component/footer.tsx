import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';

const BRAND_COLOR = '#F0663F';

const Footer = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>사업자 정보</Text>
      <View style={styles.infoTable}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>대표</Text>
          <Text style={styles.infoValue}>권도혁</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>사업자등록번호</Text>
          <Text style={styles.infoValue}>514-87-03021</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>통신판매업</Text>
          <Text style={styles.infoValue}>2025-경북경산-0073</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>주소</Text>
          <Text style={styles.infoValue}>경상북도 경산시 삼풍로 27, 309호</Text>
        </View>
      </View>
      <Text style={styles.copyright}>
        ©TalkTail co Ltd. All rights reserved
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 0,
    alignItems: 'center',
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#888',
    fontWeight: 'bold',
    marginBottom: 12,
    alignSelf: 'center',
    letterSpacing: 1,
  },
  infoTable: {
    width: '90%',
    maxWidth: 400,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    width: '100%',
  },
  infoLabel: {
    color: '#888',
    fontSize: 12,
    // fontWeight: 'bold',
    minWidth: 110,
    textAlign: 'left',
  },
  infoValue: {
    width: '100%',
    color: '#888',
    fontSize: 12,
    flexShrink: 1,
    textAlign: 'left',
    marginLeft: 10,
  },
  copyright: {
    color: '#ccc',
    fontSize: 13,
    marginTop: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default Footer;