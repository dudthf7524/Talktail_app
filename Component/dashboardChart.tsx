import React, {useState, useEffect} from "react";
import {SafeAreaView, StyleSheet, Text, View, TouchableOpacity} from "react-native";
import DetailHeart from "./detailHeart";
import DetailTemp from "./detailTemp";

const DashboardChart = ({screen} : {screen: string}) => {
  const [selectedView, setSelectedView] = useState<'heart' | 'temp' | 'both'>(screen === 'LANDSCAPE' ? 'both' : 'heart');
  
  useEffect(() => {
    setSelectedView(screen === 'LANDSCAPE' ? 'both' : 'heart');
  }, [screen]);

  return (
    <>
    {screen === "PORTRAIT" && (
      <SafeAreaView style={styles.portrait_container}>
      <SafeAreaView style={styles.btn_container}>
        <TouchableOpacity 
          style={[styles.view_button, selectedView === 'heart' && styles.selected_button]} 
          onPress={() => setSelectedView('heart')}
        >
          <Text style={[styles.button_text, selectedView === 'heart' && styles.selected_button_text]}>hr</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.view_button, selectedView === 'temp' && styles.selected_button]} 
          onPress={() => setSelectedView('temp')}
        >
          <Text style={[styles.button_text, selectedView === 'temp' && styles.selected_button_text]}>temp</Text>
        </TouchableOpacity>
      </SafeAreaView>
      
        <View style={[styles.chart_container, selectedView === 'both' && styles.split_chart_container]}>
          {selectedView === 'heart' && <DetailHeart hrData={0} screen={screen}/>}
          {selectedView === 'temp' && <DetailTemp tempData={0} screen={screen} />}
        </View>
      </SafeAreaView>
    )}
    {screen === "LANDSCAPE" && (
         <SafeAreaView style={styles.landscape_container}>
         <SafeAreaView style={styles.btn_container}>
          <TouchableOpacity 
              style={[styles.view_button, selectedView === 'both' && styles.selected_button]}
              onPress={() => setSelectedView('both')}
            >
              <Text style={[styles.button_text, selectedView === 'both' && styles.selected_button_text]}>both</Text>
            </TouchableOpacity>
           <TouchableOpacity 
             style={[styles.view_button, selectedView === 'heart' && styles.selected_button]} 
             onPress={() => setSelectedView('heart')}
           >
             <Text style={[styles.button_text, selectedView === 'heart' && styles.selected_button_text]}>hr</Text>
           </TouchableOpacity>
           <TouchableOpacity 
             style={[styles.view_button, selectedView === 'temp' && styles.selected_button]} 
             onPress={() => setSelectedView('temp')}
           >
             <Text style={[styles.button_text, selectedView === 'temp' && styles.selected_button_text]}>temp</Text>
           </TouchableOpacity>
         </SafeAreaView>
           <View style={[styles.chart_container, selectedView === 'both' && styles.split_chart_container]}>
             {selectedView === 'heart' && <DetailHeart hrData={0} screen={screen}/>}
             {selectedView === 'temp' && <DetailTemp tempData={0} screen={screen}/>}
             {selectedView === 'both' && (
               <View style={styles.split_chart_container}>
                 <View style={styles.half_chart}>
                   <DetailHeart hrData={0} screen={screen}/>
                 </View>
                 <View style={styles.half_chart}>
                   <DetailTemp tempData={0} screen={screen}/>
                 </View>
               </View>
             )}
           </View>
         </SafeAreaView>
    )}
    </>
  
  );
};

const styles = StyleSheet.create({
  portrait_container: {
    width: "100%",
    height: "auto", 
  },
  landscape_container : {
    width: "100%",
    height: "auto",
  },
  btn_container: {
    width: 166,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 8,
    marginLeft: 'auto',
  },
  view_button: {
    width: 50,
    height: 20,
    borderRadius: 4,
    backgroundColor: '#F5F5F5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected_button: {
    backgroundColor: '#F5B75C',
  },
  button_text: {
    fontSize: 12,
    color: '#666666',
  },
  selected_button_text: {
    color: '#FFFFFF',
  },
  chart_container: {
    width: '100%',
  },
  split_chart_container: {
    flexDirection: 'row',
    width: '100%',
    height: 270,
    alignSelf: "center",
    marginLeft: "0.5%",
  },
  half_chart: {
    width: '49%',
    height: 270,
    alignSelf: "center",
  },
});

export default DashboardChart;