import React, {useState} from 'react';
import {Alert, Button, View, Text, SafeAreaView, TouchableOpacity, ImageBackground} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {Icon} from 'react-native-elements';

const Scanner = ({navigation}) => {

  const [rescan, setReScan] = useState(false);
  const [bgcolor, setBgColor] = useState('black');

  const reScan = () => {
    if(rescan == true){
      scanner.reactivate();
      setReScan(false);
      setBgColor('black');
    }
  }

  const retrievedData = (e) => {
    if(e.data.match(/ORMOC/) == null){
      Alert.alert("QR is not recognized", "Please use a valid QR image");
      setReScan(true);
      setBgColor('white');
    }
    else{
      navigation.navigate('QRs', {QRdata: e.data});
    }
  }

  return(
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
        <QRCodeScanner
          cameraStyle={{
            height: '100%'
          }}
          onRead={retrievedData}
          ref={(node) => {scanner = node}}
          bottomContent={
            <View style={{position: 'relative', width: '100%', height: 350, background: 'green'}}>
              <View style={{paddingTop: 20, position: 'absolute', height: 350, width: '100%', zIndex: 1, alignItems: 'center'}}>
                <Text style={{fontWeight: 'bold', fontSize: 18}}>
                </Text>
                <TouchableOpacity
                  style={{
                    zIndex: 2,
                    width: 80,
                    height: 80,
                    borderRadius: 50,
                    justifyContent: 'center',
                    overflow: 'hidden'
                  }}
                  onPress={reScan}
                >
                  <View style={{flex: 1, justifyContent: 'center'}}>
                    <Ionicons name='ios-radio-button-on' size={84} color={bgcolor}/>
                  </View>
                </TouchableOpacity>
              </View>
              <ImageBackground
                style={{flex: 1, opacity: 0.5, zIndex: 0}}
                source={require('../assets/gradient_bg.png')}
              >
              </ImageBackground>
            </View>
          }
        />
    </SafeAreaView>
  )
}

export default Scanner;
