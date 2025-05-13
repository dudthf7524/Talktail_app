import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import Svg, { Path, Line } from 'react-native-svg';

type IRDataPoint = {
  timestamp: number;
  value: number;
};

const DetailHeart = ({ hrData, screen }: { hrData: number, screen: string}) => {
  const [data, setData] = useState<IRDataPoint[]>([]);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);
  const screenWidth = Dimensions.get('window').width;
  const pointsPerView = 50; // 한 화면에 보여질 데이터 포인트 수를 50개로 변경
  const pointWidth = 0 // 각 포인트의 너비를 화면 너비에 맞게 계산
  const chartWidth = 0;
  const chartHeight = 200;
  const padding = 0; // 좌우 패딩 제거
  const graphHeight = chartHeight - 40; // 상하 여백 유지

  // 초당 50개의 데이터 추가
  useEffect(() => {
    if (!isAutoScrolling) return; // 자동 스크롤이 비활성화된 경우 데이터 업데이트 중지

    const interval = setInterval(() => {
      // 50개의 새로운 데이터 포인트 생성
      const newDataPoints: IRDataPoint[] = Array.from({ length: 50 }, (_, i) => ({
        timestamp: Date.now() + i * 20, // 20ms 간격
        value: Math.random() * 20000 + 100000 // 100000 ~ 120000 사이의 랜덤값
      }));

      setData(prevData => {
        const updatedData = [...prevData, ...newDataPoints];
        // 최대 1000개의 데이터 포인트만 유지
        return updatedData.slice(-1000);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isAutoScrolling]); // isAutoScrolling을 의존성으로 추가

  // 자동 스크롤 효과
  useEffect(() => {
    if (!isAutoScrolling) return;

    const scrollInterval = setInterval(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }
    }, 100);

    return () => clearInterval(scrollInterval);
  }, [isAutoScrolling]);

  // Y축 레이블 생성
  const yLabels = ['120000', '115000', '110000', '105000', '100000'];

  // SVG Path 생성
  const createPath = () => {
    if (data.length === 0) return '';
    
    const points = data.map((item, index) => {
      const x = index * pointWidth; // 각 포인트의 x 좌표를 pointWidth 간격으로 설정
      const y = chartHeight - padding - ((item.value - 100000) / 20000) * graphHeight;
      return `${x},${y}`;
    });
    return `M ${points.join(' L ')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.chart_container}>
        <View style={styles.chart_wrapper}>
          {/* 그래프 영역 */}
          <ScrollView 
            ref={scrollViewRef}
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.graphContainer}
          >
            <Svg width={chartWidth} height={chartHeight}>
              {/* 그리드 라인 */}
              {yLabels.map((_, index) => (
                <Line
                  key={index}
                  x1={padding}
                  y1={padding + (graphHeight * index) / 4}
                  x2={chartWidth - padding}
                  y2={padding + (graphHeight * index) / 4}
                  stroke="#E0E0E0"
                  strokeWidth="1"
                />
              ))}
              
              {/* 데이터 라인 */}
              {data.length > 0 && (
                <Path
                  d={createPath()}
                  stroke="#F5B75C"
                  strokeWidth="2"
                  fill="none"
                />
              )}
            </Svg>
          </ScrollView>
        </View>
        
        {/* 자동 스크롤 제어 버튼 */}
        <TouchableOpacity 
          style={styles.playButton} 
          onPress={() => setIsAutoScrolling(!isAutoScrolling)}
        >
          <Text style={styles.playButtonText}>
            {isAutoScrolling ? '정지' : '재생'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '98%',
    backgroundColor: '#ffffff',
    alignSelf: 'center',
  },
  chart_container: {
    paddingHorizontal: 0, 
    paddingVertical: 12, 
    backgroundColor: '#ffffff',
    borderRadius: 0,
    marginHorizontal: 0, 
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chart_wrapper: {
    flexDirection: 'row',
    height: 200,
  },
  graphContainer: {
    flex: 1,
  },
  playButton: {
    backgroundColor: '#F5B75C',
    paddingHorizontal: 20,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: 16,
  },
  playButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default DetailHeart; 