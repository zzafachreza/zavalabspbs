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
  SafeAreaView,
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
  const [valid, setValid] = useState(true);

  const [token, setToken] = useState('');
  const [data, setData] = useState({
    nik: '',
    password: '',
  });

  useEffect(() => {
    getData('token').then(res => {
      console.log('data token,', res);
      setToken(res.token);
    });
  }, []);

  // login ok
  const masuk = () => {
    if (data.nik.length === 0 && data.password.length === 0) {
      showMessage({
        message: 'Maaf nik dan Password masih kosong !',
      });
    } else if (data.nik.length === 0) {
      showMessage({
        message: 'Maaf nik masih kosong !',
      });
    } else if (data.password.length === 0) {
      showMessage({
        message: 'Maaf Password masih kosong !',
      });
    } else {
      setLoading(true);
      console.log(data);
      setTimeout(() => {
        axios.post('https://zavalabs.com/pbs/api/login.php', data).then(res => {
          console.log(res.data);
          setLoading(false);
          if (res.data.kode == 50) {
            showMessage({
              type: 'danger',
              message: res.data.msg,
            });
          } else {
            storeData('user', res.data);
            axios
              .post('https://zavalabs.com/pbs/api/update_token.php', {
                id_member: res.data.id,
                token: token,
              })
              .then(res => {
                console.log('update token', res);
              });

            navigation.replace('MainApp');
          }
        });
      }, 1200);
    }
  };
  return (
    <ImageBackground
      source={require('../../assets/back.jpeg')}
      style={styles.page}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          flex: 1,
          marginTop: 20,
        }}>
        <View
          style={{
            height: 220,
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',

            padding: 10,
            borderRadius: 10,
          }}>
          {/* <LottieView
            style={{flex: 1}}
            source={require('../../assets/getstarted.json')}
            autoPlay
            loop
          /> */}
          <Image
            source={require('../../assets/logo.png')}
            style={{
              resizeMode: 'contain',
              aspectRatio: 2,
            }}
          />
        </View>
        <View style={styles.page}>
          <Text
            style={{
              fontFamily: fonts.secondary[400],
              fontSize: windowWidth / 20,
              color: colors.black,
              // maxWidth: 230,
              textAlign: 'center',
            }}>
            Silahkan login untuk masuk ke aplikasi
          </Text>

          <MyGap jarak={20} />
          <MyInput
            label="Kode Cabang"
            iconname="card"
            value={data.nama_lengkap}
            onChangeText={value =>
              setData({
                ...data,
                nik: value,
              })
            }
          />

          <MyGap jarak={20} />
          <MyInput
            label="Password"
            iconname="key"
            secureTextEntry
            onChangeText={value =>
              setData({
                ...data,
                password: value,
              })
            }
          />
          <MyGap jarak={40} />
          {valid && (
            <MyButton
              warna={colors.primary}
              title="LOGIN"
              Icons="log-in"
              onPress={masuk}
            />
          )}
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
    flex: 1,
    padding: 10,
  },
  image: {
    aspectRatio: 1.5,
    resizeMode: 'contain',
  },
});
