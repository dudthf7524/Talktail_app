import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Header from './header';
import { orgStore } from '../store/orgStore';

const MypageAgree = () => {
  const [marketingAgreed, setMarketingAgreed] = useState(false);
  const [smsAgreed, setSmsAgreed] = useState(false);
  const [emailAgreed, setEmailAgreed] = useState(false);
  const [pushAgreed, setPushAgreed] = useState(false);
  const [showMarketingFull, setShowMarketingFull] = useState(false);

  const { agree, loadAgree, loadAgreeLoading, loadAgreeError, loadAgreeSuccess } = orgStore();

  useEffect(() => {
    loadAgree();
  }, []);

  const marketingPolicy = `마케팅 목적의 개인정보 수집 및 이용 동의

1. 수집하는 개인정보 항목

- 필수항목: 디바이스 코드, 기관명, 기관 주소, 아이디, 비밀번호, 담당자 이메일, 담당자 연락처
- 동물 등록 정보 (필수): 환자명, 생년월일, 체중, 성별, 종, 품종, 중성화 여부, 진단명
- 선택항목: 입원일자, 주치의, 과거병력

2. 수집 및 이용 목적

- Tailing 디바이스 기반 Talktail 솔루션의 안내 및 기능 업데이트
- 기관 맞춤형 마케팅 및 프로모션 정보 제공
- 기술 지원 및 서비스 개선을 위한 통계 분석
- 제품 연구 개발을 위한 비식별화된 데이터 활용

3. 보유 및 이용 기간

- 회원 탈퇴 또는 동의 철회 시까지 보유
- 단, 관련 법령에 따라 보존이 필요한 경우 해당 기간 동안 보유

4. 동의 거부 시 불이익 안내

- 동의를 거부하셔도 서비스 이용에는 제한이 없으며, 마케팅 및 프로모션 정보 제공이 제한됩니다.`;

  return (
    <>
    <Header title="알림 설정" />
    <ScrollView contentContainerStyle={styles.container}>
      {/* 마케팅 목적 동의 */}
      <Text style={styles.sectionTitle}>
        마케팅 목적의 개인정보 수집 및 이용 동의
        <Text
          style={styles.link}
          onPress={() => setShowMarketingFull(!showMarketingFull)}
        >
          {showMarketingFull ? ' 닫기' : ' 전문보기'}
        </Text>
      </Text>
      {showMarketingFull && (
        <View style={styles.fullTextBox}>
          <Text style={styles.fullText}>
          {marketingPolicy}
          </Text>
        </View>
      )}
      <View style={styles.checkboxRow}>
        <TouchableOpacity
          style={[styles.checkbox, marketingAgreed && styles.checkboxChecked]}
          onPress={() => setMarketingAgreed(!marketingAgreed)}
        >
          {marketingAgreed && <Text style={styles.checkmark}>✓</Text>}
        </TouchableOpacity>
        <Text style={styles.checkboxText}>
          (선택) 마케팅 목적의 개인정보 수집 및 이용에 동의합니다.
        </Text>
      </View>

      {/* 광고성 정보 수신 동의 */}
      <Text style={[styles.sectionTitle, { marginTop: 24 }]}>광고성 정보 수신 동의</Text>
      <View style={styles.checkboxRow}>
        <TouchableOpacity
          style={[styles.checkbox, smsAgreed && styles.checkboxChecked]}
          onPress={() => setSmsAgreed(!smsAgreed)}
        >
          {smsAgreed && <Text style={styles.checkmark}>✓</Text>}
        </TouchableOpacity>
        <Text style={styles.checkboxText}>(선택) SMS 수신 동의</Text>
      </View>
      <View style={styles.checkboxRow}>
        <TouchableOpacity
          style={[styles.checkbox, emailAgreed && styles.checkboxChecked]}
          onPress={() => setEmailAgreed(!emailAgreed)}
        >
          {emailAgreed && <Text style={styles.checkmark}>✓</Text>}
        </TouchableOpacity>
        <Text style={styles.checkboxText}>(선택) 이메일 수신 동의</Text>
      </View>
      <View style={styles.checkboxRow}>
        <TouchableOpacity
          style={[styles.checkbox, pushAgreed && styles.checkboxChecked]}
          onPress={() => setPushAgreed(!pushAgreed)}
        >
          {pushAgreed && <Text style={styles.checkmark}>✓</Text>}
        </TouchableOpacity>
        <Text style={styles.checkboxText}>(선택) 앱푸시 수신 동의</Text>
      </View>
    </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  sectionTitle: {
    color: '#F5B75C',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 8,
  },
  link: {
    color: '#1976D2',
    fontWeight: 'normal',
    fontSize: 14,
    marginLeft: 6,
    textDecorationLine: 'underline',
  },
  fullTextBox: {
    backgroundColor: '#FFF8E1',
    borderRadius: 6,
    padding: 12,
    marginBottom: 10,
  },
  fullText: {
    fontSize: 13,
    color: '#333',
    lineHeight: 20,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#F5B75C',
    borderRadius: 4,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    borderColor: '#F5B75C',
    backgroundColor: '#FFF8E1',
  },
  checkmark: {
    color: '#F5B75C',
    fontSize: 18,
    fontWeight: 'bold',
  },
  checkboxText: {
    fontSize: 14,
    color: '#333',
    flexShrink: 1,
    flexWrap: 'wrap',
  },
});

export default MypageAgree;
