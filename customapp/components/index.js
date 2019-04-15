import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  Image,
  Text,
  Platform,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';

console.disableYellowBox = true;
class index extends Component {
scanIn() {
        this.props.navigator.push({
                    component: require('./ScanIn')
                })
      }
scanOut() {
        this.props.navigator.push({
                    component: require('./ScanOut')
                })
      }

  render() {
    return (

      <ImageBackground source={require('./muahoaanhdaonhatban-lichnohoaanhdaonhatban(1).jpg')} style={{width: '100%', height: '100%'}}>
        <Text style={styles.text}>Attendance Scanning App</Text>
        <Text style={styles.text1}>Choose Option to Scan</Text>
        <TouchableOpacity style={styles.button} onPress={() => {this.scanIn()}}>
                        <Text style={styles.scan}>SCAN IN</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button1} onPress={() => {this.scanOut()}}>
                                <Text style={styles.scan}>SCAN OUT</Text>
         </TouchableOpacity>
      </ImageBackground>
    );
  }
};

module.exports = index;

const styles = StyleSheet.create({
  text: {
    fontSize: 40,
    textAlign: 'center',
    marginTop: 100,
    fontWeight: 'bold',
    color: 'red'
  },
  text1: {
      fontSize: 20,
      textAlign: 'center',
      marginTop: 100,
      fontWeight: 'bold',
      color: 'red'
    },
  scan: {
         fontSize: 20,
         textAlign: 'center',
         marginTop: 10,
         color: 'black',
         fontWeight: 'bold',
       },

  button: {
          borderRadius: 5,
          borderColor: 'whitesmoke',
          borderWidth: 1,
          marginTop: 100,
          marginLeft: 55,
          alignItems: 'center',
          backgroundColor: 'whitesmoke',
          width:250,
          height: 50,
          opacity: 0.7,
        },
  button1: {
            borderRadius: 5,
            borderColor: 'whitesmoke',
            borderWidth: 1,
            marginTop: 20,
            marginLeft: 55,
            alignItems: 'center',
            backgroundColor: 'whitesmoke',
            width:250,
            height: 50,
            opacity: 0.7,
          }


});