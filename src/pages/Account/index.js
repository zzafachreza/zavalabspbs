import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, SafeAreaView, Image} from 'react-native';
import {windowWidth, fonts} from '../../utils/fonts';
import {getData, storeData} from '../../utils/localStorage';
import {colors} from '../../utils/colors';
import {MyButton, MyGap} from '../../components';
import {Icon} from 'react-native-elements';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useIsFocused} from '@react-navigation/native';

export default function Account({navigation, route}) {
  const [user, setUser] = useState({});
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      getData('user').then(res => {
        setUser(res);
        // console.log(user);
      });
    }
  }, [isFocused]);

  const btnKeluar = () => {
    storeData('user', null);

    navigation.replace('GetStarted');
  };

  return (
    <SafeAreaView>
      <View style={{padding: 10}}>
        {/* data detail */}
        <View>
          <View
            style={{
              marginVertical: 10,
              padding: 10,
              backgroundColor: colors.white,
              borderRadius: 10,
            }}>
            <Text
              style={{
                fontFamily: fonts.secondary[600],
              }}>
              Nama Lengkap
            </Text>
            <Text
              style={{
                fontFamily: fonts.secondary[400],
              }}>
              {user.nama_lengkap}
            </Text>
          </View>
          <View
            style={{
              marginVertical: 10,
              padding: 10,
              backgroundColor: colors.white,
              borderRadius: 10,
            }}>
            <Text
              style={{
                fontFamily: fonts.secondary[600],
              }}>
              Nomor Telepon / HP
            </Text>
            <Text
              style={{
                fontFamily: fonts.secondary[400],
              }}>
              {user.tlp}
            </Text>
          </View>
          <View
            style={{
              marginVertical: 10,
              padding: 10,
              backgroundColor: colors.white,
              borderRadius: 10,
            }}>
            <Text
              style={{
                fontFamily: fonts.secondary[600],
              }}>
              NIK
            </Text>
            <Text
              style={{
                fontFamily: fonts.secondary[400],
              }}>
              {user.nik}
            </Text>
          </View>
          <View
            style={{
              marginVertical: 10,
              padding: 10,
              backgroundColor: colors.white,
              borderRadius: 10,
            }}>
            <Text
              style={{
                fontFamily: fonts.secondary[600],
              }}>
              Alamat
            </Text>
            <Text
              style={{
                fontFamily: fonts.secondary[400],
              }}>
              {user.alamat}
            </Text>
          </View>
        </View>

        {/* <MyButton
          onPress={() => navigation.navigate('EditProfile', user)}
          title="Edit Profile"
          colorText={colors.white}
          iconColor={colors.white}
          warna={colors.primary}
          Icons="create-outline"
        /> */}

        <MyGap jarak={20} />
        {/* button */}

        <MyButton
          onPress={btnKeluar}
          title="Keluar"
          warna={colors.primary}
          Icons="log-out-outline"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
