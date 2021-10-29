import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  Button,
  View,
  Image,
  ScrollView,
  ImageBackground,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';
import {MyInput, MyGap, MyButton} from '../../components';
import axios from 'axios';
import LottieView from 'lottie-react-native';
import {getData, storeData} from '../../utils/localStorage';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {showMessage} from 'react-native-flash-message';
import GetLocation from 'react-native-get-location';
import {getDistance, convertDistance} from 'geolib';
export default function Masuk({navigation, route}) {
  const items = route.params;
  // console.log('hasil sebelumya', items);
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const [loading, setLoading] = useState(true);
  const [tipe, setTipe] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [data, setData] = useState({
    nama_lengkap: null,
    email: null,
    password: null,
    tlp: null,
    jarak: '0',
    alamat: null,
  });

  const [kirim, setKirim] = useState({
    jarak: data.jarak,
    foto: null,
    jenis: 'MASUK',
    tipe: null,
  });

  const options = {
    includeBase64: true,
    quality: 0.5,
    maxWidth: 300,
  };

  const getCamera = xyz => {
    launchCamera(options, response => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image Picker Error: ', response.error);
      } else {
        let source = {uri: response.uri};
        switch (xyz) {
          case 1:
            setData({
              ...data,
              foto: `data:${response.type};base64, ${response.base64}`,
            });
            setKirim({
              ...kirim,
              foto: `data:${response.type};base64, ${response.base64}`,
            });
            break;
        }
      }
    });
  };

  const getGallery = xyz => {
    launchImageLibrary(options, response => {
      console.log('All Response = ', response);

      console.log('Ukuran = ', response.fileSize);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image Picker Error: ', response.error);
      } else {
        if (response.fileSize <= 200000) {
          let source = {uri: response.uri};
          switch (xyz) {
            case 1:
              setData({
                ...data,
                foto: `data:${response.type};base64, ${response.base64}`,
              });
              break;
          }
        } else {
          showMessage({
            message: 'Ukuran Foto Terlalu Besar Max 500 KB',
            type: 'danger',
          });
        }
      }
    });
  };

  useEffect(() => {
    getData('user').then(res => {
      setData(res);

      console.log(res);
      GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
      })
        .then(location => {
          console.log(location);
          setLatitude(location.latitude);

          setLongitude(location.longitude);
          setLoading(false);

          const jarak = getDistance(
            {latitude: res.latitude, longitude: res.longitude},
            {latitude: location.latitude, longitude: location.longitude},
            1,
          );

          getData('tipe').then(cc => {
            setTipe(cc);

            setKirim({
              ...kirim,
              tipe: cc,
              jarak: jarak,
              ref_member: res.id,
              latitude: location.latitude,
              longitude: location.longitude,
            });
          });
        })
        .catch(error => {
          setLoading(false);
          const {code, message} = error;
          console.warn(code, message);
        });
    });
  }, []);

  const simpan = () => {
    if (kirim.jarak <= data.max_jarak && tipe == 'WFO') {
      setLoading(true);
      console.log('kirim ke server', kirim);
      axios
        .post('https://zavalabs.com/sigadisbekasi/api/transaksi_add.php', kirim)
        .then(x => {
          setLoading(false);
          alert('Absensi Masuk Berhasil Di Kirim');
          // console.log('respose server', x);
          navigation.navigate('MainApp');
        });
    } else if (kirim.jarak >= data.max_jarak && tipe != 'WFO') {
      setLoading(true);
      console.log('kirim ke server', kirim);
      axios
        .post('https://zavalabs.com/sigadisbekasi/api/transaksi_add.php', kirim)
        .then(x => {
          setLoading(false);
          alert('Absensi Masuk Berhasil Di Kirim');
          // console.log('respose server', x);
          navigation.navigate('MainApp');
        });
    } else {
      alert('Maaf Lokasi Anda Masih Jauh');
    }
  };
  return (
    <SafeAreaView style={styles.page}>
      {/* <Image
        source={require('../../assets/logooren.png')}
        style={styles.image}
      /> */}
      <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
        <View>
          <Text
            style={{
              fontFamily: fonts.secondary[600],
              color: colors.black,
              fontSize: windowWidth / 20,
            }}>
            Latitude
          </Text>
          <Text
            style={{
              fontFamily: fonts.secondary[400],
              color: colors.primary,
              fontSize: windowWidth / 30,
            }}>
            {latitude}
          </Text>
          {/* <Text>{data.latitude}</Text> */}
        </View>
        <View>
          <Text
            style={{
              fontFamily: fonts.secondary[600],
              color: colors.black,
              fontSize: windowWidth / 20,
            }}>
            Longitude
          </Text>
          <Text
            style={{
              fontFamily: fonts.secondary[400],
              color: colors.primary,
              fontSize: windowWidth / 30,
            }}>
            {longitude}
          </Text>
          {/* <Text>{data.longitude}</Text> */}
        </View>
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontFamily: fonts.secondary[600],
            fontSize: windowWidth / 15,
            marginBottom: 5,
          }}>
          ABSEN MASUK
        </Text>
        <Text
          style={{
            fontFamily: fonts.secondary[400],
            fontSize: windowWidth / 20,
            marginBottom: 5,
            textAlign: 'center',
          }}>
          {tipe}
        </Text>

        <View>
          <View
            style={{
              backgroundColor: colors.white,
              width: 300,
              height: 400,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 10,
              overflow: 'hidden',
            }}>
            <Image
              source={{
                uri:
                  data.foto == null
                    ? 'https://zavalabs.com/nogambar.jpg'
                    : data.foto,
              }}
              style={{width: 300, height: 400}}
            />
          </View>
          <MyGap jarak={10} />
          <MyButton
            title="Ambil Foto"
            Icons="camera-outline"
            warna="gray"
            iconColor={colors.white}
            colorText={colors.white}
            onPress={() => getCamera(1)}
          />
        </View>
      </View>

      <Text
        style={{
          fontFamily: fonts.secondary[400],
          fontSize: windowWidth / 20,
          marginBottom: 5,
          textAlign: 'center',
        }}>
        {kirim.jarak} Meter (Dari Sekolah)
      </Text>

      <MyGap jarak={20} />
      <MyButton
        title="SIMPAN"
        Icons="cloud-upload-outline"
        warna={colors.primary}
        iconColor={colors.white}
        colorText={colors.white}
        onPress={simpan}
      />

      {loading && (
        <LottieView
          source={require('../../assets/animation.json')}
          autoPlay
          loop
          style={{
            flex: 1,
            backgroundColor: colors.primary,
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    padding: 10,
  },
  image: {
    width: 620 / 4,
    height: 160 / 4,
  },
});
