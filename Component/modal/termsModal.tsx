import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

type TermsModalProps = {
  visible: boolean;
  type: 'privacy' | 'terms' | 'agreement';
  onClose: () => void;
  onAgree?: () => void;
};

const TermsModal = ({ visible, type, onClose, onAgree }: TermsModalProps) => {
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [marketingAgreed, setMarketingAgreed] = useState(false);
  const [smsAgreed, setSmsAgreed] = useState(false);
  const [emailAgreed, setEmailAgreed] = useState(false);
  const [pushAgreed, setPushAgreed] = useState(false);
  const [allAgreed, setAllAgreed] = useState(false);
  const [showPrivacyFull, setShowPrivacyFull] = useState(false);
  const [showTermsFull, setShowTermsFull] = useState(false);
  const [showMarketingFull, setShowMarketingFull] = useState(false);

  useEffect(() => {
    if (allAgreed) {
      setPrivacyAgreed(true);
      setTermsAgreed(true);
      setMarketingAgreed(true);
      setSmsAgreed(true);
      setEmailAgreed(true);
      setPushAgreed(true);
    }
  }, [allAgreed]);

  useEffect(() => {
    if (privacyAgreed && termsAgreed && marketingAgreed && smsAgreed && emailAgreed && pushAgreed) {
      setAllAgreed(true);
    } else {
      setAllAgreed(false);
    }
  }, [privacyAgreed, termsAgreed, marketingAgreed, smsAgreed, emailAgreed, pushAgreed]);

  const handleAllAgree = () => {
    const newAllAgreed = !allAgreed;
    setAllAgreed(newAllAgreed);
    setPrivacyAgreed(newAllAgreed);
    setTermsAgreed(newAllAgreed);
    setMarketingAgreed(newAllAgreed);
    setSmsAgreed(newAllAgreed);
    setEmailAgreed(newAllAgreed);
    setPushAgreed(newAllAgreed);
  };

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

  const privacyPolicy = `1. 수집하는 개인정보 항목

- 회원가입 시 필수: 디바이스 코드, 기관명, 기관 주소, 아이디, 비밀번호, 담당자 이메일, 담당자 연락처
- 반려동물 등록 시 필수: 환자명, 생년월일, 체중, 성별, 종, 품종, 중성화 여부, 진단명
- 선택항목: 입원일자, 주치의, 과거병력

2. 개인정보 수집 및 이용 목적

- 사용자 인증 및 기기 연동을 통한 서비스 제공
- 환자 생체신호 기반 건강 분석 및 리포트 생성
- 기술 지원, 고객 상담, 문제 해결
- 법적 의무 이행 및 통계 활용

3. 위치정보 처리에 관한 사항

- 본 앱은 Bluetooth 기기 연결을 위해 사용자의 위치정보 접근 권한을 요청합니다.
- 해당 권한은 BLE 장치 탐색 및 연결을 위한 기술적 요구사항이며, 사용자의 실제 위치를 저장하거나 전송하지 않습니다.

4. 보유 및 이용 기간

- 회원 탈퇴 시까지 또는 관련 법령에 따라 보존

5. 제3자 제공

- 법령에 따라 수사기관 등의 요청이 있을 경우에 한해 제공

6. 이용자의 권리

- 열람, 정정, 삭제, 처리정지 요청 가능
- 요청은 talktail@creamoff.co.kr 로 접수

7. 개인정보 보호책임자

- 이름: 권도혁
- 직위: 대표자
- 이메일: talktail@creamoff.co.kr`;

  const termsOfService = `1. 서비스 개요

- Talktail은 Tailing 디바이스를 기반으로 반려동물의 IR, RED, SpO₂, 심박수, 체온 등의 생체 데이터를 측정 및 분석하여 동물병원 및 관련 기관에 건강 리포트를 제공하는 모니터링 솔루션입니다.

2. 서비스 이용 대상

- 동물병원, 수의과 대학, 연구기관 등 등록된 기관 사용자

3. 회원의 의무

- 기관 및 환자 정보를 정확히 입력
- 시스템 무단 접근, 정보 조작, 허위 등록 등 금지
- 법령 및 본 약관 준수

4. 제공 서비스

- 디바이스 연동 데이터 측정 및 분석 리포트
- 환자 건강 이력 관리 기능
- 기관 전용 기술지원, 통계 기능 제공

5. 서비스 이용 제한

- 본 약관 위반 또는 부정 행위 발생 시
- 법령 위반, 계정 도용, 비인가 기기 사용 등

6. 면책 조항

- 천재지변, 네트워크 장애 등 불가항력 사유
- 사용자 과실에 의한 서비스 장애

7. 분쟁 해결

- 본 약관에 따른 분쟁은 원칙적으로 상호 협의로 해결합니다.
- 협의가 이루어지지 않을 경우 대구지방법원 경산시법원을 관할 법원으로 합니다.`;

  const renderAgreementContent = () => {
    if (type !== 'agreement') {
      return (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
          <Text style={styles.content}>
            {type === 'privacy' ? privacyPolicy : termsOfService}
          </Text>
        </ScrollView>
      );
    }

    return (
      <View style={styles.agreementContainer}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.agreementSection}>
            <View style={styles.agreementHeader}>
              <Text style={styles.agreementTitle}>개인정보 처리방침</Text>
              <TouchableOpacity onPress={() => setShowPrivacyFull(!showPrivacyFull)}>
                <Text style={styles.viewFullText}>{showPrivacyFull ? '닫기' : '전문보기'}</Text>
              </TouchableOpacity>
            </View>
            {showPrivacyFull && (
              <View style={styles.agreementScrollView}>
                <ScrollView nestedScrollEnabled={true} style={{ maxHeight: 200 }}>
                  <Text style={styles.fullTextTitle}>크림오프 개인정보 처리방침</Text>
                  <Text style={styles.content}>{privacyPolicy}</Text>
                </ScrollView>
              </View>
            )}
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setPrivacyAgreed(!privacyAgreed)}
            >
              <View style={[styles.checkbox, privacyAgreed && styles.checkboxChecked]}>
                {privacyAgreed && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.checkboxText}>(필수) 개인정보 처리방침에 동의합니다.</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.agreementSection}>
            <View style={styles.agreementHeader}>
              <Text style={styles.agreementTitle}>이용약관</Text>
              <TouchableOpacity onPress={() => setShowTermsFull(!showTermsFull)}>
                <Text style={styles.viewFullText}>{showTermsFull ? '닫기' : '전문보기'}</Text>
              </TouchableOpacity>
            </View>
            {showTermsFull && (
              <View style={styles.agreementScrollView}>
                <ScrollView nestedScrollEnabled={true} style={{ maxHeight: 200 }}>
                  <Text style={styles.fullTextTitle}>크림오프 이용약관</Text>
                  <Text style={styles.content}>{termsOfService}</Text>
                </ScrollView>
              </View>
            )}
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setTermsAgreed(!termsAgreed)}
            >
              <View style={[styles.checkbox, termsAgreed && styles.checkboxChecked]}>
                {termsAgreed && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.checkboxText}>(필수) 이용약관에 동의합니다.</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.agreementSection}>
            <View style={styles.agreementHeader}>
              <Text style={styles.agreementTitle}>마케팅 목적의 개인정보 수집 및 이용 동의</Text>
              <TouchableOpacity onPress={() => setShowMarketingFull(!showMarketingFull)}>
                <Text style={styles.viewFullText}>{showMarketingFull ? '닫기' : '전문보기'}</Text>
              </TouchableOpacity>
            </View>
            {showMarketingFull && (
              <View style={styles.agreementScrollView}>
                <ScrollView nestedScrollEnabled={true} style={{ maxHeight: 200 }}>
                  <Text style={styles.content}>{marketingPolicy}</Text>
                </ScrollView>
              </View>
            )}
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setMarketingAgreed(!marketingAgreed)}
            >
              <View style={[styles.checkbox, marketingAgreed && styles.checkboxChecked]}>
                {marketingAgreed && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.checkboxText}>(선택) 마케팅 목적의 개인정보 수집 및 이용에 동의합니다.</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.agreementSection}>
            <Text style={styles.agreementTitle}>광고성 정보 수신 동의</Text>

            <View style={styles.checkboxContainer}>
              <TouchableOpacity style={styles.checkboxContainer} onPress={() => setSmsAgreed(!smsAgreed)}>
                <View style={[styles.checkbox, smsAgreed && styles.checkboxChecked]}>
                  {smsAgreed && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.checkboxText}>(선택) SMS 수신 동의</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.checkboxContainer}>
              <TouchableOpacity style={styles.checkboxContainer} onPress={() => setEmailAgreed(!emailAgreed)}>
                <View style={[styles.checkbox, emailAgreed && styles.checkboxChecked]}>
                  {emailAgreed && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.checkboxText}>(선택) 이메일 수신 동의</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.checkboxContainer}>
              <TouchableOpacity style={styles.checkboxContainer} onPress={() => setPushAgreed(!pushAgreed)}>
                <View style={[styles.checkbox, pushAgreed && styles.checkboxChecked]}>
                  {pushAgreed && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.checkboxText}>(선택) 앱푸시 수신 동의</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.allAgreeButton}
            onPress={handleAllAgree}
          >
            <View style={[styles.checkbox, allAgreed && styles.checkboxChecked]}>
              {allAgreed && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.allAgreeText}>전체 동의</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.agreeButton,
              (!privacyAgreed || !termsAgreed) && styles.agreeButtonDisabled
            ]}
            onPress={onAgree}
            disabled={!privacyAgreed || !termsAgreed}
          >
            <Text style={styles.agreeButtonText}>동의하고 계속하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, type === 'agreement' && styles.agreementModalContent]}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {type === 'privacy' ? '개인정보 처리방침' :
                type === 'terms' ? '이용약관' : '약관 동의'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          {renderAgreementContent()}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: Dimensions.get('window').width * 0.9,
    height: Dimensions.get('window').height * 0.8,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  agreementModalContent: {
    height: Dimensions.get('window').height * 0.9,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F0663F',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#666',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  content: {
    fontSize: 14,
    lineHeight: 24,
    color: '#333',
    textAlign: 'left',
  },
  agreementContainer: {
    flex: 1,
  },
  agreementSection: {
    marginBottom: 32,
  },
  agreementHeader: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  agreementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F5B75C',
    marginBottom: 2,
  },
  agreementScrollView: {
    height: 200,
    marginBottom: 16,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#F5B75C',
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 0,
  },
  checkboxChecked: {
    backgroundColor: '#F5B75C',
    borderColor: '#F5B75C',
  },
  checkmark: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 20,
    includeFontPadding: false,
  },
  checkboxText: {
    fontSize: 14,
    color: '#333',
  },
  agreeButton: {
    backgroundColor: '#F0663F',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  agreeButtonDisabled: {
    backgroundColor: '#ccc',
  },
  agreeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 20,

  },
  allAgreeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 15,
    padding: 10,

  },
  allAgreeText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  viewFullText: {
    color: '#4A90E2',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    textDecorationLine: 'underline',
  },
  fullTextTitle: {
    color: '#F5B75C',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

export default TermsModal; 