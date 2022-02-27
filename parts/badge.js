import React, {useState} from 'react';
import {View, Text, Alert} from 'react-native';


const Badge = ({destination, mode}) => {

  const [count, setCount] = useState(0);

  const badgeCount = async () => {
    try{
      const response = await fetch('http://192.168.254.105/processes/passenger_count_badge.php', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: destination,
          mode: mode
        })
      });
      const json = await response.json();
      if(json == "error"){
        //Decided to leave it empty.
      }else{
        setCount(json);
      }
    }catch(error){
      //Decided to leave it empty.
    }
  }

  badgeCount();

  return(
    <View style={{
      backgroundColor: "#E74C3C",
      width: 28,
      height: 28,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 5
    }}>
      <Text style={{
        color: "white",
        fontWeight: "bold"
      }}>
        {count}
      </Text>
    </View>
  );
}

export default Badge;
