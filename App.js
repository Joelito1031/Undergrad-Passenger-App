import React, {useState} from 'react';
import { View, Text, Image, FlatList, SafeAreaView, TouchableOpacity, Alert, Dimensions, ImageBackground } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CreateQR from './parts/createqr';
import QueuingPUVs from './parts/showpuv';
import ReturningPUV from './parts/returningpuv';
import Scanner from './parts/scanner';
import Badge from './parts/badge';

const App = () => {

  const TopTab = createMaterialTopTabNavigator();
  const Tab = createBottomTabNavigator();
  const Stack = createNativeStackNavigator();
  const [qrlist, setQRlist] = useState([]);
  const [bool, setBool] = useState(false);
  const width = Dimensions.get('screen').width;
  const height = Dimensions.get('screen').height;

  setTimeout(() => {
    setBool(true)
  }, 2000);

  const bgTheme = {
    colors: {
      background: '#21add4',
      card: '#00a2e8',
      text: '#566573',
    },
  };

  const valencia = ({navigation}) => {
    return(
      <QueuingPUVs
        destination = 'valencia'
        navigation = {navigation}
      />
    );
  }

  const puertobello = ({navigation}) => {
    return(
      <QueuingPUVs
        destination = 'puertobello'
        navigation = {navigation}
      />
    );
  }

  const albuera = ({navigation}) => {
    return(
      <QueuingPUVs
        destination = 'albuera'
        navigation = {navigation}
      />
    );
  }

  const sabangbao = ({navigation}) => {
    return(
      <QueuingPUVs
        destination = 'sabangbao'
        navigation = {navigation}
      />
    );
  }

  const returningValencia = ({navigation}) => {
    return(
      <ReturningPUV
        destination = 'valencia'
        navigation = {navigation}
      />
    );
  }

  const returningPuertobello = ({navigation}) => {
    return(
      <ReturningPUV
        destination = 'puertobello'
        navigation = {navigation}
      />
    );
  }

  const returningAlbuera = ({navigation}) => {
    return(
      <ReturningPUV
        destination = 'albuera'
        navigation = {navigation}
      />
    );
  }

  const returningSabangBao = ({navigation}) => {
    return(
      <ReturningPUV
        destination = 'sabangbao'
        navigation = {navigation}
      />
    );
  }

  const createQRmain = ({navigation, route}) => {
    return(
      <CreateQR
        navigation={navigation}
        route={route}
      />
    );
  }

  const scanQR = ({navigation}) => {
    return(
      <Scanner
        navigation={navigation}
      />
    );
  }

  const createQr = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="QRs"
          component={createQRmain}
          options={{
            headerStyle: {
              backgroundColor: '#21add4'
            }
          }}
        />
        <Stack.Screen
          name="Scan QR"
          component={scanQR}
          options={{
            headerStyle: {
              backgroundColor: '#21add4'
            }
          }}
        />
      </Stack.Navigator>
    );
  }

  const Intro = () => (
    <View
      style={{
        flex: 1,
      }}
    >
    <ImageBackground
      source={require('./assets/gradient_bg.png')}
      resizeMode='cover'
      position='relative'
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
     <Image
       source={require('./assets/applogo.png')}
       style={{
         width: 120,
         height: 120,
       }}
     />
     <Text
       style={{
         fontSize: 30,
         fontWeight: 'bold',
         color: '#566573'
       }}
     >
       Q R M O C
     </Text>
     <Text
      style={{
        color: '#566573',
        position: 'absolute',
        bottom: 20,
      }}
     >
      1 CORINTHIANS 10:31
     </Text>
    </ImageBackground>
    </View>
  );

  const queuingPUVList = () => {
    return (
      <TopTab.Navigator
        screenOptions = {{
          tabBarLabelStyle: {fontSize: 15, padding: 5, borderRadius: 10, backgroundColor: "#7FB3D5", fontWeight: "bold", width: 120},
          tabBarActiveTintColor: '#f7dc6f',
          tabBarInactiveTintColor: 'white',
          tabBarScrollEnabled: true,
          tabBarStyle: {elevation: 0},
          tabBarPressColor: "#00a2e8",
          tabBarContentContainerStyle: {backgroundColor: '#21add4'}
        }}
      >
        <TopTab.Screen name="Valencia" component={valencia} options={{tabBarBadge: () => {return <Badge destination="valencia" mode="queuing"/>}}}/>
        <TopTab.Screen name="Puertobello" component={puertobello} options={{tabBarBadge: () => {return <Badge destination="puertobello" mode="queuing"/>}}}/>
        <TopTab.Screen name="Albuera" component={albuera} options={{tabBarBadge: () => {return <Badge destination="albuera" mode="queuing"/>}}}/>
        <TopTab.Screen name="Sabangbao" component={sabangbao} options={{tabBarBadge: () => {return <Badge destination="sabangbao" mode="queuing"/>}}}/>
      </TopTab.Navigator>
    );
  }

  const returningPUVList = () => {
    return(
      <TopTab.Navigator
        screenOptions = {{
          tabBarLabelStyle: {fontSize: 15, padding: 5, borderRadius: 10, backgroundColor: "#7FB3D5", fontWeight: "bold", width: 120},
          tabBarActiveTintColor: '#f7dc6f',
          tabBarInactiveTintColor: 'white',
          tabBarScrollEnabled: true,
          tabBarStyle: {elevation: 0},
          tabBarPressColor: "#00a2e8",
          tabBarContentContainerStyle: {backgroundColor: '#21add4'}
        }}
      >
        <TopTab.Screen name="Valencia" component={returningValencia} options={{tabBarBadge: () => {return <Badge destination="valencia" mode="returning"/>}}}/>
        <TopTab.Screen name="Puertobello" component={returningPuertobello} options={{tabBarBadge: () => {return <Badge destination="puertobello" mode="returning"/>}}}/>
        <TopTab.Screen name="Albuera" component={returningAlbuera} options={{tabBarBadge: () => {return <Badge destination="albuera" mode="returning"/>}}}/>
        <TopTab.Screen name="Sabangbao" component={returningSabangBao} options={{tabBarBadge: () => {return <Badge destination="sabangbao" mode="returning"/>}}}/>
      </TopTab.Navigator>
    );
  }

  return(
    bool ?
    <NavigationContainer theme={bgTheme}>
      <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
          backgroundColor: '#D5D8DC',
          height: 56,
          borderColor: '#D5D8DC',
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'QR') {
            iconName = 'create';
          } else if (route.name === 'Queuing PUVs') {
            iconName = 'bus';
          } else if (route.name === 'Returning PUVs') {
            iconName = 'return-down-back';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#21add4',
          tabBarInactiveTintColor: '#707B7C',
        }
      )
    }
      >
        <Tab.Screen
          name = "QR"
          component = {createQr}
          options = {{
            tabBarHideOnKeyboard: true,
            headerShown: false,
          }}
        />
        <Tab.Screen
          name = "Queuing PUVs"
          component = {queuingPUVList}
          options={{
            headerStyle: {
              backgroundColor: '#21add4',
              elevation: 0
            }
          }}
        />
        <Tab.Screen
          name = "Returning PUVs"
          component = {returningPUVList}
          options={{
            headerStyle: {
              backgroundColor: '#21add4',
              elevation: 0
            }
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
    :
    <Intro/>
  );
}

export default App;
