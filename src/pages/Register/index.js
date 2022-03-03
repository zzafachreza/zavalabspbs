import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  Button,
  View,
  Image,
  ScrollView,
  ImageBackground,
  Dimensions,
  Switch,
  SafeAreaView,
} from 'react-native';
import { colors } from '../../utils/colors';
import { fonts } from '../../utils/fonts';
import { MyInput, MyGap, MyButton, MyPicker } from '../../components';
import axios from 'axios';
import { showMessage } from 'react-native-flash-message';
import LottieView from 'lottie-react-native';

export default function Register({ navigation }) {
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const [loading, setLoading] = useState(false);
  const [valid, setValid] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const [area, setArea] = useState([]);
  const [cabang, setCabang] = useState([]);

  useEffect(() => {
    getArea();
  }, [])


  const getArea = () => {
    axios.post('https://zavalabs.com/pbs/api/data_area.php').then(res => {
      // console.warn(res.data);
      setArea(res.data);
    })
  }

  const getCabang = (x) => {

    axios.post('https://zavalabs.com/pbs/api/data_unit_kerja.php', {
      area: x
    }).then(res => {
      console.warn(res.data);
      setCabang(res.data);
    })
  }

  const validate = text => {
    // console.log(text);
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(text) === false) {
      // console.log('Email is Not Correct');
      setData({ ...data, email: text });
      setValid(false);
      return false;
    } else {
      setData({ ...data, email: text });
      setValid(true);
      // console.log('Email is Correct');
    }
  };

  const [data, setData] = useState({
    nama_pegawai: '',
    area_pegawai: '',
    unit_kerja: '',
    jabatan: '',
    nip: '',
  });

  const simpan = () => {
    if (
      data.nama_pegawai.length === 0 &&
      data.nip.length === 0 &&
      data.area_pegawai.length === 0 &&
      data.unit_kerja.length === 0 &&
      data.jabatan.length === 0
    ) {
      showMessage({
        message: 'Maaf Semua Field Harus Di isi !',
      });
    } else if (data.nama_pegawai.length === 0) {
      showMessage({
        message: 'Maaf Nama masih kosong !',
      });
    } else if (data.nip.length === 0) {
      showMessage({
        message: 'Maaf nip masih kosong !',
      });
    } else if (data.jabatan.length === 0) {
      showMessage({
        message: 'Maaf jabatan masih kosong !',
      });
    } else {
      setLoading(true);
      console.error(data);
      axios
        .post('https://zavalabs.com/pbs/api/register.php', data)
        .then(res => {
          console.log(res);
          let err = res.data.split('#');

          // console.log(err[0]);
          if (err[0] == 50) {
            setTimeout(() => {
              setLoading(false);
              showMessage({
                message: err[1],
                type: 'danger',
              });
            }, 1200);
          } else {
            setTimeout(() => {
              navigation.replace('Success', {
                messege: res.data,
              });
            }, 1200);
          }
        });
    }
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: isEnabled ? colors.black : colors.white,
      }}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.page}>
        <Text
          style={{
            marginTop: 20,
            fontFamily: fonts.secondary[400],
            fontSize: 16,
            color: colors.black,
            // maxWidth: 230,
          }}>
          Silahkan melakukan pendaftaran terlebih dahulu, sebelum login ke
          aplikasi
        </Text>

        <MyGap jarak={20} />
        <MyInput
          fontColor={isEnabled ? colors.white : colors.black}
          labelColor={isEnabled ? colors.white : colors.primary}
          colorIcon={isEnabled ? colors.white : colors.primary}
          borderColor={isEnabled ? colors.white : colors.primary}
          label="NIP"
          iconname="card"
          value={data.nip}
          onChangeText={value =>
            setData({
              ...data,
              nip: value,
            })
          }
        />
        <MyGap jarak={10} />
        <MyInput
          fontColor={isEnabled ? colors.white : colors.black}
          labelColor={isEnabled ? colors.white : colors.primary}
          colorIcon={isEnabled ? colors.white : colors.primary}
          borderColor={isEnabled ? colors.white : colors.primary}
          label="Nama "
          iconname="person"
          value={data.nama_pegawai}
          onChangeText={value =>
            setData({
              ...data,
              nama_pegawai: value,
            })
          }
        />
        <MyGap jarak={10} />
        <MyPicker iconname="map" label="Area" data={area} onValueChange={val => {
          setData({
            ...data,
            area_pegawai: val
          });

          getCabang(val);

        }} />
        <MyGap jarak={10} />
        <MyPicker iconname="business" label="Unit Kerja" data={cabang} onValueChange={val => {

          setData({
            ...data,
            unit_kerja: val
          });



        }} />
        <MyGap jarak={10} />
        <MyInput
          fontColor={isEnabled ? colors.white : colors.black}
          labelColor={isEnabled ? colors.white : colors.primary}
          colorIcon={isEnabled ? colors.white : colors.primary}
          borderColor={isEnabled ? colors.white : colors.primary}
          label="Jabatan"
          iconname="school"
          value={data.jabatan}
          onChangeText={value =>
            setData({
              ...data,
              jabatan: value,
            })
          }
        />

        <MyGap jarak={20} />

        <MyButton
          warna={colors.primary}
          title="REGISTER"
          Icons="log-in"
          onPress={simpan}
        />

        <MyGap jarak={20} />
      </ScrollView>
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
