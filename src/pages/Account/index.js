import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  ScrollView,
} from 'react-native';
import { windowWidth, fonts } from '../../utils/fonts';
import { getData, storeData } from '../../utils/localStorage';
import { colors } from '../../utils/colors';
import { MyButton, MyGap, MyInput } from '../../components';
import { Icon } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';

export default function Account({ navigation, route }) {
  const [user, setUser] = useState({});
  const [pass, setPass] = useState('');
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

  const simpan = () => {
    axios
      .post('https://zavalabs.com/pbs/api/pass.php', {
        password: pass,
        kode_cabang: user.kode_cabang,
      })
      .then(res => {
        console.log(res);
        alert(res.data);
        setPass('');

        // console.log(err[0]);
      });
  };
  return (
    <SafeAreaView>
      <ScrollView style={{ padding: 10 }}>
        {/* data detail */}
        <View>

          {user.nip !== null && (
            <>
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
                  NIP
                </Text>
                <Text
                  style={{
                    fontFamily: fonts.secondary[400],
                  }}>
                  {user.nip}
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
                  Nama
                </Text>
                <Text
                  style={{
                    fontFamily: fonts.secondary[400],
                  }}>
                  {user.nama_pegawai}
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
                  Jabatan
                </Text>
                <Text
                  style={{
                    fontFamily: fonts.secondary[400],
                  }}>
                  {user.jabatan}
                </Text>
              </View>
            </>
          )}


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
              Kode Cabang
            </Text>
            <Text
              style={{
                fontFamily: fonts.secondary[400],
              }}>
              {user.kode_cabang}
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
              Nama Cabang
            </Text>
            <Text
              style={{
                fontFamily: fonts.secondary[400],
              }}>
              {user.nama_cabang}
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
              Area
            </Text>
            <Text
              style={{
                fontFamily: fonts.secondary[400],
              }}>
              {user.area}
            </Text>
          </View>
        </View>

        <MyGap jarak={20} />
        {/* button */}

        <MyButton
          onPress={btnKeluar}
          title="Keluar"
          warna={colors.primary}
          Icons="log-out-outline"
        />
        <MyGap jarak={20} />

        <View
          style={{
            padding: 30,
          }}>
          <MyInput
            iconname="key"
            secureTextEntry
            value={pass}
            onChangeText={val => setPass(val)}
            label="Masukan Password Baru"
          />
          <MyGap jarak={10} />
          <MyButton
            onPress={simpan}
            title="Ubah Password"
            colorText={colors.white}
            iconColor={colors.white}
            warna={colors.secondary}
            Icons="create-outline"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
