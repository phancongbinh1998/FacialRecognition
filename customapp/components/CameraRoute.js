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
import Camera from 'react-native-camera';
import RNFetchBlob from 'react-native-fetch-blob'



import firebase from 'firebase';
require('firebase/firestore');
<script src="https://www.gstatic.com/firebasejs/5.9.0/firebase.js"></script>


  var config = {
    apiKey: "AIzaSyDOabs5e-f1nbFK992-DAjwTngcW_wdNt8",
    authDomain: "facedetection-aa172.firebaseapp.com",
    databaseURL: "https://facedetection-aa172.firebaseio.com",
    projectId: "facedetection-aa172",
    storageBucket: "facedetection-aa172.appspot.com",
    messagingSenderId: "984056088423"
  };
firebase.initializeApp(config);
var firestore = firebase.firestore()

class CameraRoute extends Component {
  constructor(props) {
    super(props);

    this.state = {
      path: null,
    };
  }


  takePicture() {

    this.camera.capture()
      .then((data) => {
        console.log(data);
        this.setState({ path: data.path })
        var date = new Date();
        const imageFile = RNFetchBlob.wrap(data.path);

    // 'path/to/image' is where you wish to put your image in
    // the database, if you would like to put it in the folder
    // 'subfolder' inside 'mainFolder' and name it 'myImage', just
    // replace it with 'mainFolder/subfolder/myImage'
    const ref = firebase.storage().ref('loginPictures/' + 'loginPic');
    const Blob = RNFetchBlob.polyfill.Blob;
    const tempWindowXMLHttpRequest = window.XMLHttpRequest;
    window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
    window.Blob = Blob;

    Blob.build(imageFile, { type: 'image/jpg;' })
        .then((imageBlob) => {


            var task = ref.put(imageBlob, { contentType: 'image/jpg' });



        }).then(() => {
            setTimeout(function () {
                        window.XMLHttpRequest = tempWindowXMLHttpRequest;

                        let cont = new Array();
                                        firestore.collection("loginURLs").onSnapshot(function (querySnapshot) {
                                            querySnapshot.docChanges().forEach(function (change) {
                                                var id = change.doc.id;
                                                cont.push(id);
                                                if (cont.length === 2) {
                                                    firestore.collection("loginURLs").doc(cont[1]).delete();
                                                }

                                            });
                                        });
                        ref.getDownloadURL().then(function (downloadURL) {
                              const docRef = firestore.collection("loginURLs/").doc();
                                   docRef.set({
                                        url: downloadURL,
                                        dateLogin: date
                              });

                          });

                 firestore.collection("afterDetection").onSnapshot(function (querySnapshot) {
                       querySnapshot.docChanges().forEach(function (change) {
                        if(change.doc.data().isDone === 'true'){
                               firestore.collection("afterDetection").onSnapshot(function (querySnapshot) {
                                                  querySnapshot.docChanges().forEach(function (change) {
                                                            var disable = change.doc.data().disable;
                                                            var empID = change.doc.data().empID;
                                                            var isMatch = change.doc.data().isMatch;

                                                            if(isMatch === 'false'){
                                                               alert('Your Face is not Match! Register first or login again!');
                                                            }
                                                            if(disable === 'false' && isMatch ==='true'){

                                                                    var userID;
                                                                    var date = new Date();
                                                                    var scanNumber = '0';
                                                                    var str = '';
                                                                    var strDate = '';

                                                                    firestore.collection("afterDetection").onSnapshot(function (querySnapshot) {
                                                                          querySnapshot.docChanges().forEach(function (change) {
                                                                                  userID = change.doc.data().empID;
                                                                           });
                                                                    });

                                                                    firestore.collection("Employee").onSnapshot(function (querySnapshot) {
                                                                                  querySnapshot.docChanges().forEach(function (change) {
                                                                                          if(change.doc.data().Scan === '1'){
                                                                                             scanNumber = '1';
                                                                                          }


                                                                                   });
                                                                            });
                                                                    setTimeout(function () {
                                                                        var hours = date.getHours();
                                                                        var minutes = date.getMinutes();
                                                                        var seconds = date.getSeconds();
                                                                        var ampm = hours >= 12 ? 'PM' : 'AM';
                                                                        hours = hours % 12;
                                                                        hours = hours ? hours : 12; // the hour '0' should be '12'
                                                                        minutes = minutes < 10 ? '0'+minutes : minutes;
                                                                        var strTime = hours + ':' + minutes + ':' + seconds + ' ' + ampm;

                                                                        if(scanNumber == '1'){
                                                                                    firestore.collection("Employee").onSnapshot(function (querySnapshot) {
                                                                                                       querySnapshot.docChanges().forEach(function (change) {

                                                                                                             if(userID === change.doc.data().EmpID){


                                                                                                                     strDate = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
                                                                                                                     firestore.collection("Employee").doc(change.doc.id).update({
                                                                                                                             ScanOutLocation: 'HR Office: HR2',
                                                                                                                             ScanOut: strTime,
                                                                                                                             AttendanceDate: strDate,
                                                                                                                             Scan: '2'
                                                                                                                     });



                                                                                                             }
                                                                                                        });
                                                                                                 });
                                                                                 }
                                                                                 if(scanNumber == '0'){
                                                                                             firestore.collection("Employee").onSnapshot(function (querySnapshot) {
                                                                                                                querySnapshot.docChanges().forEach(function (change) {

                                                                                                                      if(userID === change.doc.data().EmpID){

                                                                                                                              strDate = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
                                                                                                                              firestore.collection("Employee").doc(change.doc.id).update({
                                                                                                                                      ScanInLocation: 'Main Office: FR',
                                                                                                                                      ScanIn: strTime,
                                                                                                                                      AttendanceDate: strDate,
                                                                                                                                      Scan: '1'
                                                                                                                               });


                                                                                                                      }
                                                                                                                 });
                                                                                                          });
                                                                                          }
                                                                                  let brr = new Array();

                                                                                                  firestore.collection("Match").onSnapshot(function (querySnapshot) {
                                                                                                      querySnapshot.docChanges().forEach(function (change) {
                                                                                                          var id = change.doc.id;
                                                                                                          brr.push(id);
                                                                                                          if (brr.length === 1) {
                                                                                                              firestore.collection("Match").doc(brr[0]).delete();
                                                                                                          }

                                                                                                      });
                                                                                                  });
                                                                                   let crr = new Array();

                                                                                                 firestore.collection("loginURLs").onSnapshot(function (querySnapshot) {
                                                                                                     querySnapshot.docChanges().forEach(function (change) {
                                                                                                         var id = change.doc.id;
                                                                                                         crr.push(id);
                                                                                                         if (crr.length === 1) {
                                                                                                             firestore.collection("loginURLs").doc(crr[0]).delete();
                                                                                                         }

                                                                                                     });
                                                                                                 });
                                                                                   let drr = new Array();

                                                                                            firestore.collection("afterDetection").onSnapshot(function (querySnapshot) {
                                                                                                querySnapshot.docChanges().forEach(function (change) {
                                                                                                    var id = change.doc.id;
                                                                                                    drr.push(id);
                                                                                                    if (drr.length === 1) {
                                                                                                        firestore.collection("afterDetection").doc(drr[0]).delete();
                                                                                                    }

                                                                                                });
                                                                                            });
                                                                    }, 2000);


                                                            }
                                                            if(disable === 'true'){
                                                               alert('Facial Recognition Authentication is Disable!!');
                                                               let brr = new Array();

                                                                             firestore.collection("Match").onSnapshot(function (querySnapshot) {
                                                                                 querySnapshot.docChanges().forEach(function (change) {
                                                                                     var id = change.doc.id;
                                                                                     brr.push(id);
                                                                                     if (brr.length === 1) {
                                                                                         firestore.collection("Match").doc(brr[0]).delete();
                                                                                     }

                                                                                 });
                                                                             });
                                                              let crr = new Array();

                                                                            firestore.collection("loginURLs").onSnapshot(function (querySnapshot) {
                                                                                querySnapshot.docChanges().forEach(function (change) {
                                                                                    var id = change.doc.id;
                                                                                    crr.push(id);
                                                                                    if (crr.length === 1) {
                                                                                        firestore.collection("loginURLs").doc(crr[0]).delete();
                                                                                    }

                                                                                });
                                                                            });
                                                              let drr = new Array();

                                                                       firestore.collection("afterDetection").onSnapshot(function (querySnapshot) {
                                                                           querySnapshot.docChanges().forEach(function (change) {
                                                                               var id = change.doc.id;
                                                                               drr.push(id);
                                                                               if (drr.length === 1) {
                                                                                   firestore.collection("afterDetection").doc(drr[0]).delete();
                                                                               }

                                                                           });
                                                                       });
                                                            }

                                                       });
                                                  });
                        }
                });
                       });



            }, 5000);


         });

    })

}


  renderCamera() {
    return (
      <Camera
        ref={(cam) => {
          this.camera = cam;
        }}
        style={styles.preview}
        aspect={Camera.constants.Aspect.fill}
        type={Camera.constants.Type.front}
        captureTarget={Camera.constants.CaptureTarget.temp}
      >
        <TouchableHighlight
          style={styles.capture}
          onPress={this.takePicture.bind(this)}
          underlayColor="rgba(255, 255, 255, 0.5)"
        >
          <View />
        </TouchableHighlight>
      </Camera>
    );
  }

  renderImage() {
    return (
      <View>
        <Image
          source={{ uri: this.state.path }}
          style={styles.preview}
        />
        <Text
          style={styles.cancel}
          onPress={() => this.setState({ path: null })}
        >Cancel
        </Text>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.path ? this.renderImage() : this.renderCamera()}
      </View>
    );
  }
};

module.exports = CameraRoute;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },
  capture: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 5,
    borderColor: '#FFF',
    marginBottom: 300,
  },
  cancel: {
    position: 'absolute',
    right: 20,
    top: 20,
    backgroundColor: 'transparent',
    color: '#FFF',
    fontWeight: '600',
    fontSize: 17,
  }
});