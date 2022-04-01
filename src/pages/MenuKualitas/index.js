import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    FlatList,
    SafeAreaView,
    RefreshControl,
    Image,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { storeData, getData } from '../../utils/localStorage';
import axios from 'axios';
import { colors } from '../../utils/colors';
import { windowWidth, fonts } from '../../utils/fonts';
import { Icon } from 'react-native-elements';

import { useIsFocused } from '@react-navigation/native';
import 'intl';
import 'intl/locale-data/jsonp/en';

const wait = timeout => {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
};


export default function ({ navigation, route }) {
    const [refreshing, setRefreshing] = React.useState(false);
    const [data, setData] = useState([]);

    const isFocused = useIsFocused();

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        getDataFromServer();
        wait(2000).then(() => setRefreshing(false));
    }, []);

    useEffect(() => {

        if (isFocused) {
            getDataFromServer();
        }

    }, [isFocused]);

    const getDataFromServer = () => {
        getData('user').then(res => {
            console.error('user', res);
            axios
                .post('https://zavalabs.com/pbs/api/1kualitas.php', {
                    kode_cabang: res.kode_cabang,
                })
                .then(x => {
                    console.log(x.data);
                    setData(x.data);
                });
        });
    };

    const MyList = ({ lab, val }) => {
        return <View style={{ flexDirection: 'row', padding: 5, marginBottom: 1, borderBottomWidth: 1, borderBottomColor: colors.border }}>
            <Text
                style={{
                    flex: 1,
                    fontSize: windowWidth / 30,
                    color: colors.primary,
                    fontFamily: fonts.secondary[600],
                }}>
                {lab}
            </Text>
            <Text
                style={{
                    fontSize: windowWidth / 30,
                    color: colors.black,
                    fontFamily: fonts.secondary[600],
                }}>
                {val}
            </Text>
        </View>
    }

    const TglZVL = (x) => {

        let tgl = x.split('-');
        return tgl[2] + '/' + tgl[1] + '/' + tgl[0];

    }

    const renderItem = ({ item }) => (
        <View
            style={{
                padding: 10,
                margin: 10,
                backgroundColor: 'white',
                elevation: 1,
            }}>

            <MyList lab="Nama" val={item.nama} />
            <MyList lab="Kode Cabang" val={item.kode_cabang} />
            <MyList lab="Nama Cabang" val={item.nama_cabang} />
            <MyList lab="Area" val={item.area} />
            <MyList lab="Produk" val={item.produk} />
            <MyList lab="KOL" val={item.kol} />
            <MyList lab="OS" val={new Intl.NumberFormat().format(item.os)} />
            <MyList lab="Penyebab" val={item.penyebab == "" ? "-" : item.penyebab} />
            <MyList lab="Tanggal Bayar" val={item.tanggal_bayar == "0000-00-00" ? "-" : TglZVL(item.tanggal_bayar)} />
            <MyList lab="Proyeksi Kol" val={item.proyeksi_kol == "" ? "-" : item.proyeksi_kol} />
            <MyList lab="Action Plan" val={item.action_plan == "" ? "-" : item.action_plan} />






            <TouchableOpacity
                onPress={() => {
                    navigation.navigate('MenuKualitasUpdate', item)
                }}
                style={{
                    padding: 10,
                    backgroundColor: colors.secondary,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <Text
                    style={{
                        fontSize: windowWidth / 30,
                        textAlign: 'center',
                        fontFamily: fonts.secondary[600],
                        color: colors.black,
                    }}>
                    EDIT KUALITAS
                </Text>
            </TouchableOpacity>

        </View>
    );

    return (
        <ScrollView
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={[colors.primary]}
                />
            }
            style={{
                padding: 10,
            }}>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({});
