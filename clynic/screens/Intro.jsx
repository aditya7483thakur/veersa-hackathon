import { StatusBar, View, Text, Image } from 'react-native';
import { Colors } from '../constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Images } from '../constants/Images';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';

const IntroScreen = () => {
    const { authenticated } = useAuth();
    const navigation = useNavigation();

    useEffect(() => {
        setTimeout(() => {
            if (authenticated) {
                navigation.replace("home");
            } else {
                navigation.replace("onboarding");
            }
        }, 1500);
    }, []);


    return (
        <>
            <StatusBar backgroundColor={Colors.black(1)} barStyle={"light-content"} />
            <SafeAreaView
                style={{ backgroundColor: Colors.bgWhite(1) }}
                className="flex-1 items-center justify-center"
            >
                <View>
                    <Image
                        source={Images.logoColor}
                        className="w-24 h-24"
                        resizeMode="contain"
                    />
                    <Text
                        className="text-xl font-bold my-4 tracking-wider"
                        style={{ color: Colors.bgColor(1) }}
                    >
                        Clynic
                    </Text>
                   
                </View>

            </SafeAreaView>
        </>
    );
};

export default IntroScreen;