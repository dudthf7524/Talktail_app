import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import Svg, { Path, Line, Text as SvgText } from 'react-native-svg';
import { tempDataLists, DataPoint } from './tempDummyDatas';
import Header from './header';

const DetailTemp = ({ route }: { route: any }) => {
  const { tempData } = route.params;
  const [data, setData] = useState<DataPoint[]>(tempDataLists);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = Math.max(screenWidth - 40, data.length * 50);
  const chartHeight = 220;
  const padding = 20;
  const graphHeight = chartHeight - padding * 2;

  // 2초마다 새로운 데이터 추가
  useEffect(() => {
    const interval = setInterval(() => {
      const lastData = data[data.length - 1];
      const lastKey = Object.keys(lastData)[0];
      const [date, time] = lastKey.split('-');
      
      // 시간 증가 (2초)
      const timeMatch = time.match(/.{1,2}/g);
      if (!timeMatch) return;
      
      const [hours, minutes, seconds] = timeMatch;
      let newSeconds = parseInt(seconds) + 2;
      let newMinutes = parseInt(minutes);
      let newHours = parseInt(hours);
      
      if (newSeconds >= 60) {
        newSeconds = newSeconds % 60;
        newMinutes += 1;
      }
      if (newMinutes >= 60) {
        newMinutes = newMinutes % 60;
        newHours += 1;
      }
      
      const newTime = `${newHours.toString().padStart(2, '0')}${newMinutes.toString().padStart(2, '0')}${newSeconds.toString().padStart(2, '0')}`;
      const newKey = `${date}-${newTime}`;
      
      // 새로운 온도값 생성 (이전 값에서 ±0.2 범위 내에서 랜덤하게)
      const lastTemp = lastData[lastKey];
      const randomChange = (Math.random() - 0.5) * 0.4; // -0.2 to 0.2
      const newTemp = Math.round((lastTemp + randomChange) * 10) / 10; // 소수점 첫째자리까지
      
      setData(prevData => [...prevData, { [newKey]: newTemp }]);
    }, 2000);

    return () => clearInterval(interval);
  }, [data]);

  // 데이터가 업데이트될 때마다 스크롤을 오른쪽 끝으로 이동 (자동 스크롤이 활성화된 경우에만)
  useEffect(() => {
    if (scrollViewRef.current && isAutoScrolling) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [data, isAutoScrolling]);

  // 데이터 정규화
  const values = data.map(item => Object.values(item)[0]);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const valueRange = maxValue - minValue;

  // SVG Path 생성
  const createPath = () => {
    const points = data.map((item, index) => {
      const value = Object.values(item)[0];
      const x = (index / (data.length - 1)) * (chartWidth - padding * 2) + padding;
      const y = chartHeight - padding - ((value - minValue) / valueRange) * graphHeight;
      return `${x},${y}`;
    });
    return `M ${points.join(' L ')}`;
  };

  // Y축 레이블 생성
  const yLabels = Array.from({ length: 6 }, (_, i) => {
    const value = minValue + (valueRange * i) / 5;
    return value.toFixed(1);
  });

  return (
    <>
      <Header title="체온 상세" />
      <SafeAreaView style={styles.container}>
        <View style={styles.chart_container}>
          <View style={styles.chart_wrapper}>
            {/* Y축 레이블 */}
            <View style={styles.yAxis}>
              {yLabels.map((label, index) => (
                <Text key={index} style={styles.yAxisLabel}>
                  {label}
                </Text>
              ))}
            </View>
            
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
                    y1={padding + (graphHeight * index) / 5}
                    x2={chartWidth - padding}
                    y2={padding + (graphHeight * index) / 5}
                    stroke="#E0E0E0"
                    strokeWidth="1"
                  />
                ))}
                
                {/* 데이터 라인 */}
                <Path
                  d={createPath()}
                  stroke="#F5B75C"
                  strokeWidth="2"
                  fill="none"
                />
                
                {/* 데이터 포인트 */}
                {data.map((item, index) => {
                  const value = Object.values(item)[0];
                  const x = (index / (data.length - 1)) * (chartWidth - padding * 2) + padding;
                  const y = chartHeight - padding - ((value - minValue) / valueRange) * graphHeight;
                  return (
                    <View key={index}>
                      <View
                        style={[
                          styles.dataPoint,
                          {
                            left: x - 6,
                            top: y - 6,
                          },
                        ]}
                      />
                      {/* X축 레이블 */}
                      <Text
                        style={[
                          styles.xAxisLabel,
                          {
                            position: 'absolute',
                            left: x - 20,
                            top: chartHeight - 20,
                          },
                        ]}
                      >
                        {Object.keys(item)[0].split('-')[1].substring(2, 6).replace(/(\d{2})(\d{2})/, '$1:$2')}
                      </Text>
                    </View>
                  );
                })}
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
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  chart_container: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    margin: 16,
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
    height: 220,
  },
  yAxis: {
    width: 40,
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  yAxisLabel: {
    fontSize: 10,
    color: '#262626',
    textAlign: 'right',
  },
  graphContainer: {
    flex: 1,
  },
  dataPoint: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#F5B75C',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  xAxisLabel: {
    fontSize: 12,
    color: '#262626',
    width: 40,
    textAlign: 'center',
  },
  playButton: {
    backgroundColor: '#F5B75C',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: 16,
  },
  playButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DetailTemp; 