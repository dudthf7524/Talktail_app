import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, StyleSheet, Text, View, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native';
import Svg, { Path, Line } from 'react-native-svg';

type IRDataPoint = {
  timestamp: number;
  value: number;
};

const DetailHeart = ({ screen }: { screen: string }) => {
  const [data, setData] = useState<IRDataPoint[]>([]);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);

  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const isLandscape = screenWidth > screenHeight;
  const pointsPerView = 50;
  const pointWidth = screenWidth / pointsPerView;
  const chartWidth = Math.max(screenWidth, pointsPerView * pointWidth);
  const chartHeight = isLandscape ? screenHeight * 0.6 : 200;
  const padding = 0;
  const graphHeight = chartHeight - 40;

  // 초당 50개의 데이터 추가
  useEffect(() => {
    if (!isAutoScrolling) return;

    const interval = setInterval(() => {
      const newDataPoints: IRDataPoint[] = Array.from({ length: 50 }, (_, i) => ({
        timestamp: Date.now() + i * 20,
        value: Math.random() * 20000 + 100000,
      }));

      setData(prevData => {
        const updatedData = [...prevData, ...newDataPoints];
        return updatedData.slice(-1000);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isAutoScrolling]);

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
      const x = index * pointWidth;
      const y = chartHeight - padding - ((item.value - 100000) / 20000) * graphHeight;
      return `${x},${y}`;
    });
    return `M ${points.join(' L ')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text>Screen: {screen}</Text>
      <Text>Width: {screenWidth}</Text>
      <Text>Height: {screenHeight}</Text>
      <View style={[styles.chart_container, isLandscape && { height: chartHeight }]}>
        <View style={styles.chart_wrapper}>
          <ScrollView 
            ref={scrollViewRef}
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={[styles.graphContainer, isLandscape ? { height: chartHeight } : {}]}
          >
            <Svg width={chartWidth} height={chartHeight}>
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
    width: '100%',
    backgroundColor: '#ffffff',
    alignSelf: 'center',
  },
  chart_container: {
    paddingHorizontal: 0,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
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
