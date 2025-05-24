import { StatusBar, Text, Image } from 'react-native';
import { Colors } from '../constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Images } from '../constants/Images';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';

const SplashScreen = () => {
    const navigation = useNavigation();

    useEffect(() => {
        // 2 seconds load screen
        setTimeout(() => {
            navigation.replace("auth-wrapper", {
                screen: "intro"
            });
        }, 2000);
    }, []);

    useFocusEffect(() => {
        // 2 seconds load screen
        setTimeout(() => {
            navigation.replace("auth-wrapper", {
                screen: "intro"
            });
        }, 2000);
    });

    return (
    <>
        <StatusBar 
            backgroundColor="transparent"
            barStyle="light-content"
            translucent
        />
        <SafeAreaView
            style={{ backgroundColor: Colors.bgColor(0.7), flex: 1, alignItems: "center", justifyContent: "center"  }}
            className="flex-1 items-center justify-center"
        >
            <Image 
                source={Images.logo}
                className="w-48 h-48"
                resizeMode="contain"
            />
            <Text
                className="text-3xl font-bold my-5 text-white tracking-wider"
            >
                CLYNIC
            </Text>
            <Text
                className="text-white font-bold my-10"
            >
                Your Health, Our Priority
            </Text>
        </SafeAreaView> 
    </>
    );
};

export default SplashScreen;