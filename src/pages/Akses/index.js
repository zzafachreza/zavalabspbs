import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  Button,
  View,
  Image,
  ScrollView,
  Dimensions,
  ImageBackground,
} from 'react-native';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';
import {MyInput, MyGap, MyButton} from '../../components';
import LottieView from 'lottie-react-native';
import axios from 'axios';
import {storeData, getData} from '../../utils/localStorage';
import {showMessage} from 'react-native-flash-message';

export default function Login({navigation}) {
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');
  const [data, setData] = useState({
    email: null,
    password: null,
  });

  useEffect(() => {
    getData('token').then(res => {
      console.log('data token,', res);
      setToken(res.token);
    });
  }, []);

  // login ok
  const masuk = () => {
    setLoading(true);
    console.log(data);
    setTimeout(() => {
      axios
        .post('https://zavalabs.com/sigadisbekasi/api/akses.php', data)
        .then(res => {
          if (res.data == 'success') {
            navigation.replace('Pemakaian');
          } else {
            showMessage({
              message: 'Maaf Kode Akses Salah !',
              type: 'danger',
            });
          }
          setLoading(false);
        });
    }, 1200);
  };
  return (
    <ImageBackground style={styles.page}>
      <ScrollView
        style={{
          flex: 1,
        }}>
        <View style={{height: 250, flex: 1}}>
          <LottieView
            style={{flex: 1}}
            source={require('../../assets/splash.json')}
            autoPlay
            loop
          />
        </View>
        <View style={styles.page}>
          <Text
            style={{
              fontFamily: fonts.secondary[400],
              fontSize: windowWidth / 20,
              color: colors.black,
              // maxWidth: 230,
            }}>
            Ini adalah Fitur Untuk Admin
            <Text
              style={{
                fontFamily: fonts.secondary[600],
                fontSize: windowWidth / 20,
                color: colors.black,
                // maxWidth: 230,
              }}>
              My Laundry
            </Text>
          </Text>

          <MyGap jarak={20} />
          <MyInput
            label="Masukan Kode Akses"
            iconname="key"
            secureTextEntry
            autoFocus={true}
            onChangeText={value =>
              setData({
                ...data,
                password: value,
              })
            }
          />
          <MyGap jarak={40} />
          <MyButton
            warna={colors.primary}
            title="LANJUT FITUR ADMIN"
            Icons="log-in"
            onPress={masuk}
          />
        </View>
      </ScrollView>
      {loading && (
        <LottieView
          source={require('../../assets/animation.json')}
          autoPlay
          loop
          style={{backgroundColor: colors.primary}}
        />
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  page: {
    // backgroundColor: 'white',
    flex: 1,
    padding: 10,
  },
  image: {
    aspectRatio: 1.5,
    resizeMode: 'contain',
  },
});
