import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  Image,
  Text,
  Platform,
} from 'react-native';
import firebase from 'firebase';
require('firebase/firestore');
<script src="https://www.gstatic.com/firebasejs/5.9.0/firebase.js"></script>


var firestore = firebase.firestore();

class check extends Component {
   get(){

        const ref = firebase.storage().ref('loginPictures/' + 'loginPic');
        ref.getDownloadURL().then(function (downloadURL) {
                          const docRef = firestore.collection("loginURLs/").doc();
                                            docRef.set({
                                                url: downloadURL,
                                                date: 'a'

                                            }).then(function () {
                                                alert("Status save!");
                                            });
                                        });
   }
  render() {
    return (
    this.get(),
      <View style={{flex: 1, backgroundColor: "pink"}}>

      </View>
    );
  }
};

module.exports = check;