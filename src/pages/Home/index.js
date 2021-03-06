import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Dimensions,
  ImageBackground,
  SafeAreaView,
  Image,
  TouchableWithoutFeedback,
  ScrollView,
  TouchableOpacity,
  TouchableNativeFeedback,
  Linking,
  StatusBar,
} from 'react-native';
import { colors } from '../../utils/colors';
import { fonts } from '../../utils/fonts';
import { storeData, getData } from '../../utils/localStorage';
import { Icon } from 'react-native-elements';
import MyCarouser from '../../components/MyCarouser';
import MyTerbaik from '../../components/MyTerbaik';
import axios from 'axios';
import messaging from '@react-native-firebase/messaging';
import 'intl';
import 'intl/locale-data/jsonp/en';
import MyTerbaik2 from '../../components/MyTerbaik2';
import MyTerbaik3 from '../../components/MyTerbaik3';
import MyDashboard from '../../components/MyDashboard';

export default function Home({ navigation }) {
  const [user, setUser] = useState([]);
  const [token, setToken] = useState('');
  const [tipe, setTipe] = useState('');
  const [company, setCompany] = useState({});

  messaging().onMessage(async remoteMessage => {
    // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    const json = JSON.stringify(remoteMessage);
    const obj = JSON.parse(json);
    // alert(obj.notification);
    // console.log('list transaksi', obj.notification);
    getData('user').then(res => {
      setUser(res);
      // console.log(res);
      // alert('email' + res.email + ' dan password ' + res.password);

      axios
        .post('https://zavalabs.com/pbs/api/point.php', {
          id_member: res.id,
        })
        .then(respoint => {
          setPoint(respoint.data);
          console.log('get apoint', respoint.data);
        });

      axios
        .post('https://zavalabs.com/pbs/api/get_member.php', {
          email: res.email,
          password: res.password,
        })
        .then(rese => {
          setUser(rese.data);
          storeData('user', rese.data);
        });
    });
  });

  useEffect(() => {
    getData('company').then(res => {
      setCompany(res);
    });

    getData('tipe').then(res => {
      setTipe(res);
    });

    getData('user').then(res => {
      console.log(res);
      setUser(res);

      axios
        .post('https://zavalabs.com/pbs/api/point.php', {
          id_member: res.id,
        })
        .then(respoint => {
          setPoint(respoint.data);
          console.log('get apoint', respoint.data);
        });

      getData('token').then(res => {
        console.log('data token,', res);
        setToken(res.token);
      });
    });

    axios
      .post('https://zavalabs.com/pbs/api/update_token.php', {
        id_member: user.id,
        token: token,
      })
      .then(res => {
        console.log('update token', res);
      });
  }, []);

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const ratio = 192 / 108;
  const _renderItem = ({ item, index }) => {
    return (
      <Image
        resizeMode="contain"
        source={{ uri: item.image }}
        style={{
          width: windowWidth,
          height: Math.round((windowWidth * 9) / 16),
        }}
      />
    );
  };

  const DataKategori = ({ icon, nama, nama2, onPress }) => {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={{
          backgroundColor: colors.white,
          padding: 5,
          borderRadius: 10,
          width: windowWidth / 2.2,
          height: windowHeight / 8.5,
          elevation: 5,
        }}>
        <View>
          <Icon
            type="ionicon"
            name={icon}
            color={colors.secondary}
            size={windowWidth / 10}
          />
        </View>
        <View>
          <Text
            style={{
              fontFamily: fonts.secondary[600],
              color: colors.primary,
              fontSize: windowWidth / 40,
              textAlign: 'center',
              // marginHorizontal: 10,
            }}>
            {nama}
          </Text>
          <Text
            style={{
              fontFamily: fonts.secondary[600],
              color: colors.primary,
              fontSize: windowWidth / 40,
              textAlign: 'center',
              // marginHorizontal: 10,
            }}>
            {nama2}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ImageBackground
      source={require('../../assets/back.jpeg')}
      style={{
        flex: 1,
      }}>
      {/* <StatusBar
        barStyle="dark-content"
        translucent={true}
        backgroundColor={'transparent'}
      /> */}

      <ScrollView>
        {/* bagian untuk point dan redeem */}

        <View
          style={{
            marginHorizontal: 10,
            height: windowHeight / 10,
            marginBottom: 10,
            padding: 10,
            flexDirection: 'row',
          }}>
          <View style={{ flex: 1, paddingTop: 15 }}>
            <Text
              style={{
                fontSize: windowWidth / 30,
                color: colors.black,
                fontFamily: fonts.secondary[400],
              }}>
              {user.kode_cabang}
            </Text>
            <Text
              style={{
                fontSize: windowWidth / 30,
                color: colors.black,
                fontFamily: fonts.secondary[600],
              }}>
              {user.nama_cabang}
            </Text>
            <Text
              style={{
                fontSize: windowWidth / 30,
                color: colors.primary,
                fontFamily: fonts.secondary[600],
              }}>
              {user.area}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
              flex: 1,
            }}>
            <Image
              source={require('../../assets/logo.png')}
              style={{ width: 120, height: 40, resizeMode: 'stretch' }}
            />
          </View>
        </View>

        <MyCarouser />

        {/* <MyDashboard tipe={tipe} /> */}

        <View
          style={{
            padding: 10,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',

            }}>
            <DataKategori
              onPress={() => navigation.navigate('Input')}
              icon="grid"
              nama="INPUT"
              nama2="PROYEKSI"
            />
            <DataKategori
              onPress={() =>
                navigation.navigate('Laporan', {
                  halaman: 'pendanaan',
                })
              }
              icon="analytics"
              nama="PERTUMBUHAN"
              nama2="PENDANAAN"
            />
          </View>
          {/*  */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginTop: 15,
            }}>
            <DataKategori
              onPress={() =>
                navigation.navigate('Laporan', {
                  halaman: 'pencairan',
                })
              }
              icon="server"
              nama="PENCAIRAN"
              nama2="PEMBIAYAAN"
            />
            <DataKategori
              onPress={() =>
                navigation.navigate('Laporan', {
                  halaman: 'npf',
                })
              }
              icon="flag"
              nama="POSISI"
              nama2="NPF"
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginTop: 15,
            }}>
            <DataKategori
              onPress={() =>
                navigation.navigate('Laporan', {
                  halaman: 'kol2',
                })
              }
              icon="bar-chart"
              nama="POSISI"
              nama2="KOL 2"
            />
            <DataKategori
              onPress={() =>
                navigation.navigate('Laporan', {
                  halaman: 'produk',
                })
              }
              icon="cube"
              nama="MENU"
              nama2="PRODUK"
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginTop: 15,
            }}>
            <DataKategori
              onPress={() =>
                navigation.navigate('Input2', user)
              }
              icon="calendar"
              nama="DAILY"
              nama2="ACTIVITY"
            />
            <DataKategori
              onPress={() =>
                navigation.navigate('MenuKualitas', user)
              }
              icon="aperture"
              nama="MENU"
              nama2="KUALITAS"
            />
          </View>
          {/*  */}
        </View>
      </ScrollView>
    </ImageBackground>
  );
}
