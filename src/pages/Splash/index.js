import React, {useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ImageBackground,
  SafeAreaView,
  Image,
  Animated,
} from 'react-native';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';
import {color, asin} from 'react-native-reanimated';
import {getData, storeData} from '../../utils/localStorage';
import {PermissionsAndroid} from 'react-native';
import LottieView from 'lottie-react-native';
import axios from 'axios';

export default function Splash({navigation}) {
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const scaleLogo = new Animated.Value(0.1);
  const scaleText = new Animated.Value(100);

  Animated.timing(scaleLogo, {
    toValue: 0.2,
    duration: 1000,
  }).start();

  Animated.timing(scaleText, {
    toValue: 0.2,
    duration: 1000,
  }).start();

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Izinkan Untuk Akses Lokasi',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use Location');
      } else {
        console.log('Location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    requestCameraPermission();
    getDataCompany();

    const unsubscribe = getData('user').then(res => {
      // console.log(res);
      if (!res) {
        // console.log('beum login');

        setTimeout(() => {
          navigation.replace('GetStarted');
        }, 1500);
      } else {
        console.log('sudah login logon');

        setTimeout(() => {
          navigation.replace('MainApp');
        }, 1500);
      }
    });
  }, []);

  const getDataCompany = () => {
    axios
      .get('https://zavalabs.com/sigadisbekasi/api/company.php')
      .then(res => {
        console.log(res.data);
        storeData('company', res.data);
      });
  };

  return (
    <ImageBackground
      source={require('../../assets/back.jpeg')}
      style={styles.page}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          // paddingBottom: windowHeight / 4,
        }}>
        <Animated.Image
          source={require('../../assets/logo.png')}
          style={{
            resizeMode: 'contain',
            aspectRatio: scaleLogo,
          }}
        />
        {/* <Animated.View
          style={{
            top: scaleText,
          }}>
          <Text
            style={{
              fontFamily: fonts.secondary[800],
              fontSize: windowWidth / 7,
              color: colors.white,
            }}>
            WANDHA
          </Text>
          <Text
            style={{
              fontFamily: fonts.secondary[600],
              fontSize: windowWidth / 9,
              color: colors.secondary,
            }}>
            ELEKTRONIK
          </Text>
        </Animated.View> */}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  image: {
    aspectRatio: 1,
    width: 250,
    height: 250,
  },
});
