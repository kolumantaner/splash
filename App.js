/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity
} from 'react-native';
import  firebase from 'firebase';
import 'firebase/firestore'
import SplashScreen from 'react-native-splash-screen';
import { RNCamera } from 'react-native-camera';
import RNFetchBlob from 'rn-fetch-blob'
type Props = {};
export default class App extends Component<Props> {
  allMedia = [];
  formData=[];
  componentWillMount(){
  var config = {
    apiKey: "AIzaSyAGjwyr0jgJkKvU1um29Hm0guogtS1XIvE",
    authDomain: "deneme-ee063.firebaseapp.com",
    databaseURL: "https://deneme-ee063.firebaseio.com",
    projectId: "deneme-ee063",
    storageBucket: "deneme-ee063.appspot.com",
    messagingSenderId: "970723111336"
  };
  firebase.initializeApp(config);
}
  componentDidMount(){
    SplashScreen.hide();
  }
  render() {
    return (
      <View style={styles.container}>
      <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style = {styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.on}
          permissionDialogTitle={'Permission to use camera'}
          permissionDialogMessage={'We need your permission to use your camera phone'}
      />
      <View style={{flex: 0, flexDirection: 'row', justifyContent: 'center',}}>
      <TouchableOpacity
          onPress={this.takePicture.bind(this)}
          style = {styles.capture}
      >
          <Text style={{fontSize: 14}}> SNAP </Text>
      </TouchableOpacity>
      </View>
    </View>
    );
  }
  cameraPull(){

    const firestore = firebase.firestore();
    const settings = {timestampsInSnapshots: true};
    firestore.settings(settings);
   firestore.collection('image').get().then(image => {
    
  
    image.forEach((im) => {
      console.log(im.data());
     
    });
  
    });
  
  }
  camera() {

    
    
      <View style={styles.container}>
        <RNCamera
            ref={ref => {
              this.camera = ref;
            }}
            style = {styles.preview}
            type={RNCamera.Constants.Type.back}
            flashMode={RNCamera.Constants.FlashMode.on}
            permissionDialogTitle={'Permission to use camera'}
            permissionDialogMessage={'We need your permission to use your camera phone'}
        />
        <View style={{flex: 0, flexDirection: 'row', justifyContent: 'center',}}>
        <TouchableOpacity
            onPress={this.takePicture.bind(this)}
            style = {styles.capture}
        >
            <Text style={{fontSize: 14}}> SNAP </Text>
        </TouchableOpacity>
        </View>
      </View>
  
  }

  takePicture = async function() {
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync(options)
      const firestore = firebase.firestore();
    const settings = {timestampsInSnapshots: true};
    firestore.settings(settings);
     
    const storageRef = firebase.storage().ref();
    const imagesRef = storageRef.child('images/image8');
  console.log(data)
  var metadata = {
    contentType: 'image/jpg'
  };
 var  contentType = 'image/jpg' || '';
  var sliceSize = 1024;
  var byteCharacters = atob(data.base64);
  var bytesLength = byteCharacters.length;
  var slicesCount = Math.ceil(bytesLength / sliceSize);
  var byteArrays = new Array(slicesCount);

  for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
      var begin = sliceIndex * sliceSize;
      var end = Math.min(begin + sliceSize, bytesLength);

      var bytes = new Array(end - begin);
      for (var offset = begin, i = 0 ; offset < end; ++i, ++offset) {
          bytes[i] = byteCharacters[offset].charCodeAt(0);
      }
      byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  var blob=new Blob(byteArrays, { type: contentType })
  console.log(blob)
   var message='data:image/jpeg;base64,'+data.base64;
   
 /* imagesRef.put(blob).then(function(snapshot) {
    console.log('Uploaded a data_url string!');

      snapshot.ref.getDownloadURL().then((url) => {
        this.formData={
         url:url
        }
        firestore.collection('image').add(Object.assign({},  this.formData)).then(() => {
          console.log(1);
        });
      });
    }).catch(error=>{
      console.log(JSON.stringify(error))
    });*/

    imagesRef.putString(data.base64, 'base64',{ contentType: 'image/jpg'}).then(function(snapshot) {
    snapshot.ref.getDownloadURL().then((url) => {
      this.formData={
       url:url
      }
      firestore.collection('image').add(Object.assign({},  this.formData)).then(() => {
        console.log(1);
      });
    });
});
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black'
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20
  }
});
