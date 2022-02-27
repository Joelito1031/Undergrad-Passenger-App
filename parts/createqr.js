import React, {useState, useEffect, useRef} from 'react';
import { ActivityIndicator, FlatList, View, Text, SafeAreaView, TouchableOpacity, TextInput, Dimensions, StyleSheet, Alert, ScrollView, Image, ImageBackground} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImageModal from 'react-native-image-modal';
import { Input, Icon, Button, Card} from 'react-native-elements';
import {Picker} from '@react-native-picker/picker';
import RNQRGenerator from 'rn-qr-generator';
import {launchImageLibrary} from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BottomSheet } from 'react-native-btr';

const QRs = ({item, index, remove}) => (
  <View
    style={{
      borderRadius: 5,
      justifyContent: "center",
      alignItems: "center",
      marginVertical: 5,
      marginHorizontal: 10,
      position: 'relative',
      overflow: 'hidden',
      flex: 1,
    }}
  >
  <ImageBackground
    source={require('../assets/qr_card_background.jpg')}
    style={{flex: 1, height: '100%', width: '100%', position: 'absolute', opacity: 0.7}}>
  </ImageBackground>
  <TouchableOpacity
    style={{
      alignSelf: 'flex-end'
    }}
    onPress={() => {
      Alert.alert("Delete QR?", "QR will be unregistered and will be remove in this device", [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Ok",
          onPress: () => {
            remove(index, item.code);
          }
        }
      ]);
    }}
    delayLongPress={1000}
  >
    <Ionicons name="remove-circle" size={40} color="#C0392B"/>
  </TouchableOpacity>
  <View>
  <ImageModal
     resizeMode="contain"
     imageBackgroundColor="#000000"
     style={{
       width: 300,
       height: 300,
       borderRadius: 5
     }}
     source={{
       uri: item.uri,
     }}
   />
  </View>
    <View style={{
      marginTop: 20,
      marginBottom: 20,
      textAlign: 'center',
    }}>
    <Text style={{
      alignSelf: "center",
      fontSize: 23,
      fontWeight: "bold",
      color: 'white'
    }}>
    {item.fullname}
    </Text>
    </View>
  </View>
)

const CreateQR = ({navigation, route}) => {

const [fname, setFname] = useState('');
const [mname, setMname] = useState('');
const [lname, setLname] = useState('');
const [cnum, setCnum] = useState('');
const [qrval, setQRVal] = useState('');
const [imageuri, setImageUri] = useState('');
const [qruri, setQRURI] = useState([]);
const [visible, setVisible] = useState(false);
const [loading, setLoading] = useState('none');
const [name, setName] = useState(true);

useEffect(() => {
  getData();
},[]);

const makeItCorrect = (value) => {
  let name = value.trim().toLowerCase();
  let tempName = '';
  let repoName = '';
  let finalName = '';
  name = name + ' ';
  let nameLength = name.length;
  for(let i = 0; i < nameLength; i++){
    if(name[i] == ' '){
      if(tempName != ''){
        repoName = tempName.charAt(0).toUpperCase() + tempName.slice(1) + ' ';
        finalName = finalName + repoName;
        tempName = '';
      }
    }else{
      tempName = tempName + name[i];
    }
  }
  return finalName.trim();
}

const getData = async() => {
  try{
    const value = await AsyncStorage.getItem('@qr_uri');
    if(value != null){
      setQRURI(JSON.parse(value));
    }
  }catch(e){
    Alert.alert("Something went wrong", "Encountered an error retrieving your registered QR")
  }
}


const storeData = async(value, bool) => {
  try{
    if(bool){
      qruri.push(value);
    }
    await AsyncStorage.setItem('@qr_uri', JSON.stringify(qruri));
  }catch(e){
    Alert.alert("Something went wrong", "Encountered an error saving the qr image")
  }
}

navigation.addListener('focus', () => {
  if(route.params != null){
    setQRVal(route.params.QRdata);
    route.params = null;
    setVisible(true);
  }
},[]);

const remove = async (i, code) => {
  try{
    const response = await fetch('http://192.168.254.105/processes/passenger_unregister_qr.php', {
      method: 'POST',
      headers:{
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        qrcode: code
      })
    });
    const json = await response.json();
    if(json == 'success'){
      qruri.splice(i, 1);
      storeData('', false);
      getData();
      Alert.alert("QR was successfully removed", "Please be careful on clearing the application's data without ensuring that QRs are properly removed using the application. Once QR is not properly removed using the application, it will not be registered again because the data is still stored in the database. We restrict the retrieval of stored data because it violates privacy and security of the user.")
    }else if(json == 'notfound'){
      Alert.alert("Something is wrong", "You have the QR on you phone but not in our database");
    }else if(json == 'error'){
      Alert.alert("Something went wrong", "This is maybe in our side, we are going to work on it");
    }else{
      Alert.alert("Something went wrong", "This is maybe in our side, we are going to work on it");
    }
  }catch(error){
    Alert.alert("Something went wrong", "This is maybe in our side, we are going to work on it");
  }
}


const checkInfo = async () => {
  if(qruri.length < 3){
    if (fname.trim() === '' || mname.trim() === '' || lname.trim() === '' || cnum.trim() === '') {
      Alert.alert("Missing fields", "Please fill all the field", [{text: "Ok", onPress: () => setLoading('none')}]);
    }else if(cnum.trim().length != 11){
      setLoading('none');
      Alert.alert("Invalid input", "Contact number dit not meet the amount of numbers required", [{text: "Ok", onPress: () => setLoading('none')}]);
    }else if(qrval == ''){
      Alert.alert("Error", "No QR code scanned", [{text: "Ok", onPress: () => setLoading('none')}]);
    }else{
      let invalid_char = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;
      if(invalid_char.test(fname.trim()) || invalid_char.test(mname.trim()) || invalid_char.test(lname.trim())){
        Alert.alert("Invalid input", "Special characters are not allowed e.g. (dot, comma, numbers, etc.)", [{text: "Ok", onPress: () => setLoading('none')}]);
      }else{
        let invalid_str = /\d/;
        if(invalid_str.test(fname.trim()) || invalid_str.test(mname.trim()) || invalid_str.test(lname.trim())){
          Alert.alert("Invalid input", "Special characters are not allowed e.g. (dot, comma, numbers, etc.)", [{text: "Ok", onPress: () => setLoading('none')}]);
        }else{
          let fullname = fname.trim() + ' ' + mname.trim() + ' ' + lname.trim();
          let contact = cnum;
          try{
            const response = await fetch('http://192.168.254.105/processes/passenger_register_qr.php', {
              method: 'POST',
              headers:{
                Accept: 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                fullname: makeItCorrect(fullname),
                contact: contact,
                qr: qrval
              })
            });
            const json = await response.json();
            if(json == 'success'){
              RNQRGenerator.generate({
                value: qrval,
                height: 100,
                width: 100,
              }).then(response => {
                const {uri} = response;
                storeData({uri: uri, fullname: makeItCorrect(fullname), code: qrval}, true);
                setVisible(false);
                setFname('');
                setMname('');
                setLname('');
                setCnum('');
                setLoading('none');
              }).catch(error => {
                Alert.alert("Error saving QR", "QR cannot be stored but is successfully registered", [{text: "Ok", onPress: () => setLoading('none')}])
              });
            }else if(json == 'registered'){
              Alert.alert("QR is already registered", "You might have not properly removed this QR. You can still use the digital or physical QR code if you still have it.", [{text: "Ok", onPress: () => setLoading('none')}])
            }else if(json == 'error'){
              Alert.alert("Something went wrong", "This is maybe in our side, we are going to work on it", [{text: "Ok", onPress: () => setLoading('none')}]);
            }else{
              Alert.alert("Something went wrong", "This is maybe in our side, we are going to work on it", [{text: "Ok", onPress: () => setLoading('none')}]);
            }
          }catch(error){
            Alert.alert("Something went wrong", "This is maybe in our side, we are going to work on it", [{text: "Ok", onPress: () => setLoading('none')}]);
          }
        }
      }
    }
  }else{
    Alert.alert("QR limit exceed", "You are only allowed to register three QR codes in one device", [{text: "Ok", onPress: () => setLoading('none')}]);
  }
}

const scanImage = () => {
  launchImageLibrary({}, response => {
    if(!response.didCancel){
      const {assets} = response;
      const [items] = assets;
      const {uri} = items;
      RNQRGenerator.detect({
        uri: uri
      }).then(response => {
        const {values} = response;
        const [qrvalue] = values;
        if(qrvalue == null){
          Alert.alert("Invalid file", "File is not recognized");
        }
        else{
          if(qrvalue.match(/ORMOC/) == null){
              Alert.alert("Invalid QR", "QR code is not valid");
          }
          else{
            setQRVal(qrvalue);
            setVisible(true);
          }
        }
      }).catch(error => Alert.alert("Something went wrong", "An unexpected error was encountered while scanning the QR image"));
    }
  })
}

const renderQR = ({item, index}) => {
  return(
    <QRs
      item={item}
      index={index}
      remove={remove}
    />
  );
}

return (
  <SafeAreaView style={{
    flex: 1
  }}>
    <ImageBackground
      source={require('../assets/gradient_bg.png')}
      style={{flex: 1}}
    >
      <View style={{flex: 1}}>
        <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
        {qruri.length > 0 ?
            <FlatList
              style={{
                flex: 1,
                width: '100%',
              }}
              data={qruri}
              renderItem={renderQR}
              extraData={qruri}
            />

          :
            <Text style={{opacity: 0.5}}>
              Register your QR code using the options below
            </Text>

        }
        </View>
        <View style={{flexDirection: 'row', height: 70}}>
        <TouchableOpacity
          onPress={() => {navigation.navigate('Scan QR')}}
          style={{
            width: '50%',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#5af0e1'
          }}
        >
          <Ionicons name='camera-outline' size={32} color='#566573'/>
          <Text style={{color: '#566573'}}>
            SCAN QR
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={scanImage}
          style={{
            width: '50%',
            borderLeftWidth: 1,
            borderColor: '#1eb7bd',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#45ddd1'
          }}
        >
          <Ionicons name="ios-qr-code-outline" size={32} color='#566573'/>
          <Text style={{color: '#566573'}}>
            SCAN IMAGE
          </Text>
        </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
    <BottomSheet visible={visible}>
    <View style={{
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      overflow: 'hidden',
      height: 400,
      position: 'relative',
    }}>
    <View style={{
      display: loading,
      position: 'absolute',
      height: '100%',
      zIndex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      backgroundColor: 'black',
      opacity: 0.5,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    }}>
      <ActivityIndicator size="large"/>
    </View>
    <ImageBackground
      source={require('../assets/gradient_bg.png')}
      style={{
        height: 400,
        paddingRight: 5,
        paddingLeft: 5,
        paddingTop: 10,
        paddingBottom: 20,
      }}>
      <TouchableOpacity
        onPress={() => setVisible(false)}
        style={{
          width: 40,
          height: 40,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <Image source={require('../assets/back.png')}/>
      </TouchableOpacity>
        <ScrollView>
        <Input
          leftIcon={
            <Icon
              name='user'
              type='feather'
              size={22}
              color='black'
            />
          }
          placeholder = "First Name"
          returnKeyType = "next"
          onChangeText={setFname}
          value={fname}
          style={{
            fontSize: 16
          }}
        />
        <Input
          leftIcon={
            <Icon
              name='user'
              type='feather'
              size={22}
              color='black'
            />
          }
          placeholder = "Middle Name"
          returnKeyType = "next"
          onChangeText={setMname}
          value={mname}
          style={{
            fontSize: 16
          }}
        />
        <Input
          leftIcon={
            <Icon
              name='user'
              type='feather'
              size={22}
              color='black'
            />
          }
          placeholder = "Last Name (Include suffix here if there is)"
          returnKeyType = "next"
          onChangeText={setLname}
          value={lname}
          style={{
            fontSize: 16
          }}
        />
        <Input
          leftIcon={
            <Icon
              name='hash'
              type='feather'
              size={22}
              color='black'
            />
          }
          placeholder = "Mobile No. (e.g. 09306319388)"
          keyboardType = "number-pad"
          returnKeyType = "next"
          onChangeText={setCnum}
          value={cnum}
          style={{
            fontSize: 16
          }}
        />
          <Button
            buttonStyle={{
              borderRadius: 2,
              marginLeft: 20,
              marginRight: 20,
              backgroundColor: '#f7dc6f',
            }}
            title='REGISTER'
            titleStyle={{ color: 'black' }}
            onPress = {() => {
              checkInfo();
              setLoading('flex');
            }}
          />
        </ScrollView>
    </ImageBackground>
    </View>
    </BottomSheet>
  </SafeAreaView>
  )
}

export default CreateQR;
