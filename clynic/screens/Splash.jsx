import { StatusBar, View, Text, Image } from 'react-native';
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
            navigation.replace("intro");
        }, 2000);
    }, []);

    useFocusEffect(() => {
        // 2 seconds load screen
        setTimeout(() => {
            navigation.replace("intro");
        }, 2000);
    }, [navigation]);

    return (
    <>
        <StatusBar backgroundColor={Colors.black(1)} barStyle={"light-content"} />
        <SafeAreaView
            style={{ backgroundColor: Colors.bgColor(0.7)  }}
            className="flex-1 items-center justify-center"
        >
            <Image 
                source={Images.logo}
                className="w-48 h-48"
                resizeMode="contain"
            />
            <Text
                className="text-3xl font-bold my-4 text-white tracking-wider"
            >
                Clynic
            </Text>
            <Text
                className="text-white my-5"
            >
                Your Health, Our Priority
            </Text>
        </SafeAreaView> 
    </>
    );
};

export default SplashScreen;