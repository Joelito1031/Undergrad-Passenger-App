import React, {useState, useEffect} from 'react';
import {ActivityIndicator, View, SafeAreaView, Text, Alert, FlatList, TouchableOpacity, Image, ImageBackground} from 'react-native';

const shadowOpacity = 0.1;
const shadowRadius = 0;

const PUVList = ({puv, capacity, passengers}) => (

  <View style={{
     height: 60,
     borderColor: "#AEB6BF",
     marginVertical: 2,
     padding: 10,
     position: "relative",
    }}
  >
    <Text style={{
      position: "absolute",
      fontWeight: "bold",
      color: "#566573",
      fontSize: 20,
      top: 10,
      left: 10,
      padding: 7,
    }}>
      {puv}
    </Text>
    <Text style={{
      position: "absolute",
      fontSize: 15,
      fontWeight: "bold",
      right: 10,
      backgroundColor: "#F7DC6F",
      padding: 7,
      color: "#566573",
      borderRadius: 3,
      top: 12
    }}>
      Onboard: {passengers} / {capacity}
    </Text>
  </View>
)


const QueuingPUVs = ({destination, navigation}) => {
  const [puvList, setPUVList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ref, setRef] = useState(false);

  const getPUVList = async () => {
    try{
      const response = await fetch('http://192.168.254.105/processes/get_queuing_vehicles.php',{
                              method: 'POST',
                              headers: {
                                Accept: 'application/json',
                                'Content-Type': 'application/json'
                              },
                              body: JSON.stringify({
                                data: destination
                              })
                            });
                            const json = await response.json();
                            setPUVList(JSON.parse(json));
    }catch(error){
      Alert.alert('Error loading PUVs', 'Please check your internet connection and try again');
    }finally{
      setLoading(false);
    }
  }

useEffect(() => {
  const retrieveV = navigation.addListener('focus', () => {
    getPUVList();
  });
  return retrieveV;
}, [navigation]);


  const callFunc = () => {
    getPUVList();
    setRef(false);
  }

  const onRefFunc = () => {
    setRef(true);
    callFunc();
  }

  const refPressed = () => {
    setLoading(true);
    getPUVList();
  }

  const renderItem = ({item}) => {
    return(
      <PUVList
        puv = {item.Vehicle}
        capacity = {item.Capacity}
        passengers = {item.Passengers}
      />
    );
  }

  return(
    loading ?
    <SafeAreaView style={{
      flex: 1,
    }}
    >
    <ImageBackground
      source={require('../assets/gradient_bg.png')}
      style={{
        flex: 1,
        width: '100%',
        justifyContent: "center",
        alignItems: "center"
      }}
    >
    <ActivityIndicator size="large" color="green"/>
    </ImageBackground>
    </SafeAreaView>
    :
    puvList.length > 0 ?
    <SafeAreaView style={{
      flex: 1,
    }}>
    <ImageBackground
      source={require('../assets/gradient_bg.png')}
      style={{
        flex: 1,
        width: '100%',
        marginVertical: 2
      }}
    >
      <FlatList
        data = {puvList}
        renderItem = {renderItem}
        extraData = {puvList}
        refreshing = {ref}
        onRefresh = {onRefFunc}
      />
    </ImageBackground>
    </SafeAreaView>
    :
    <SafeAreaView style={{
      flex: 1,
    }}>
    <ImageBackground
      source={require('../assets/gradient_bg.png')}
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: '100%'
      }}
    >
      <Text>
        No queuing PUV at this time.
      </Text>
      <TouchableOpacity
        onPress = {refPressed}
      >
        <Image style = {{
          margin: 20,
          width: 40,
          height: 40
        }}
          source = {require('../assets/reload.png')}
        />
      </TouchableOpacity>
      </ImageBackground>
    </SafeAreaView>
  );
}

export default QueuingPUVs;
