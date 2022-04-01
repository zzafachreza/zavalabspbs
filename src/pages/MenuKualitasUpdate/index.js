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
import { MyPicker, MyGap, MyInput, MyButton } from '../../components';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function ({ navigation, route }) {
    const item = route.params;
    const [loading, setLoading] = useState(false);
    const TglZVL = (x) => {

        let tgl = x.split('-');
        return tgl[2] + '/' + tgl[1] + '/' + tgl[0];

    }
    const [data, setData] = useState({
        id: item.id,
        tanggal_bayar: TglZVL(item.tanggal_bayar),
        penyebab: item.penyebab,
        proyeksi_kol: item.proyeksi_kol,
        action_plan: item.action_plan
    });

    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [TanggalTarget, setTanggalTarget] = useState('');
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);

        // alert(currentDate);

        const Today = new Date(currentDate);
        const dd = String(Today.getDate()).padStart(2, '0');
        const mm = String(Today.getMonth() + 1).padStart(2, '0'); //January is 0!
        const yyyy = Today.getFullYear();
        const jam = Today.getHours();
        const menit = Today.getMinutes();
        const detik = Today.getUTCSeconds();
        const today = `${dd}/${mm}/${yyyy}`;
        setData({
            ...data,
            id: item.id,
            tanggal_bayar: today,
        });
    };

    const showMode = currentMode => {
        setShow(true);
        setMode(currentMode);
    };

    const hideMode = currentMode => {
        setShow(false);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };



    useEffect(() => {
        const Today = new Date();
        const dd = String(Today.getDate()).padStart(2, '0');
        const mm = String(Today.getMonth() + 1).padStart(2, '0'); //January is 0!
        const yyyy = Today.getFullYear();
        const jam = Today.getHours();
        const menit = Today.getMinutes();
        const detik = Today.getUTCSeconds();
        const today = `${dd}/${mm}/${yyyy}`;

    }, [])


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

    const kirim = () => {
        // setLoading(true);
        console.log(data);

        axios
            .post('https://zavalabs.com/pbs/api/1update_kualitas.php', data)
            .then(x => {
                setLoading(false);

                console.warn('respose server', x.data);

                alert('Data Kualitas Berhasil Di Update !');
                navigation.goBack();
            });
    };

    return (
        <SafeAreaView style={{
            padding: 10,
            flex: 1
        }}>
            <View style={{ flex: 1 }}>
                <ScrollView >
                    <MyList lab="Nama" val={item.nama} />
                    <MyList lab="Kode Cabang" val={item.kode_cabang} />
                    <MyList lab="Nama Cabang" val={item.nama_cabang} />
                    <MyList lab="Area" val={item.area} />
                    <MyList lab="Produk" val={item.produk} />
                    <MyList lab="KOL" val={item.kol} />
                    <MyList lab="OS" val={new Intl.NumberFormat().format(item.os)} />
                    <MyGap jarak={10} />
                    <MyPicker
                        value={data.penyebab}
                        onValueChange={x =>
                            setData({
                                ...data,
                                penyebab: x,
                            })
                        }
                        iconname="list"
                        label="Penyebab"
                        data={[
                            {
                                label: 'Meninggal',
                                value: 'Meninggal',
                            },
                            {
                                label: 'One Obligor 1 CIF',
                                value: 'One Obligor 1 CIF',
                            },
                            {
                                label: 'Usaha Menurun/PHK -Kurang Bayar',
                                value: 'Usaha Menurun/PHK -Kurang Bayar',
                            },
                            {
                                label: 'Nasabah Tidak Kooperatif',
                                value: 'Nasabah Tidak Kooperatif',
                            },
                            {
                                label: 'Belum Gajian',
                                value: 'Belum Gajian',
                            },
                        ]}
                    />
                    {show && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={date}
                            mode={mode}
                            format="YYYY-MM-DD"
                            is24Hour={true}
                            display="default"
                            onChange={onChange}
                        />
                    )}

                    <MyInput
                        value={data.tanggal_bayar}
                        onChangeText={x =>
                            setData({
                                ...data,
                                tanggal_bayar: x,
                            })
                        }
                        label="Tanggal Bayar"
                        iconname="calendar-outline"
                        onFocus={showDatepicker}
                    />

                    <MyPicker
                        value={data.proyeksi_kol}
                        onValueChange={x =>
                            setData({
                                ...data,
                                proyeksi_kol: x,
                            })
                        }
                        iconname="list"
                        label="Proyeksi Kol"
                        data={[
                            {
                                label: '1',
                                value: '1',
                            },
                            {
                                label: '2',
                                value: '2',
                            },
                            {
                                label: '3',
                                value: '3',
                            },
                            {
                                label: '4',
                                value: '4',
                            },
                            {
                                label: '5',
                                value: '5',
                            },

                        ]}
                    />

                    <MyPicker

                        value={data.action_plan}
                        onValueChange={x =>
                            setData({
                                ...data,
                                action_plan: x,
                            })
                        }
                        iconname="list"
                        label="Action Plan"
                        data={[
                            {
                                label: 'Penagihan',
                                value: 'Penagihan',
                            },
                            {
                                label: 'Resturktur',
                                value: 'Resturktur',
                            },
                            {
                                label: 'Lelang',
                                value: 'Lelang',
                            },
                            {
                                label: 'Jual Agunan',
                                value: 'Jual Agunan',
                            },
                            {
                                label: 'Klaim Asuransi',
                                value: 'Klaim Asuransi',
                            },

                        ]}
                    />
                </ScrollView>
            </View>
            <MyButton onPress={kirim} warna={colors.secondary} colorText={colors.black} title="UPDATE KUALITAS" Icons="cloud-upload-outline" iconColor={colors.black} />
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
    )
}

const styles = StyleSheet.create({})