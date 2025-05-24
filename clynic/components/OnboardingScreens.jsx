import { TouchableOpacity, Text, Image, StatusBar, View } from "react-native";
import Onboarding from "react-native-onboarding-swiper";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import { Images } from "../constants/Images";
import { Colors } from "../constants/Colors";
import AntDesign from '@expo/vector-icons/AntDesign';

const OnboardingScreens = () => {
    const navigation = useNavigation();

    const onboardingPages = [
        {
            backgroundColor: "#fff",
            image:  <Image 
                    source={Images.consult} 
                    className="w-80 h-80 rounded-lg"
                    style={{
                        // iOS shadows
                        shadowColor: '#000',
                        shadowOffset: {
                        width: 0,
                        height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        
                        // Android shadow
                        elevation: 5,
                    }} />,
            title: (
                <Text className="text-3xl font-bold text-start w-full p-3" style={{ color: Colors.bgColor(0.8) }} >
                    Consult with a Doctor you trust
                </Text>
            ),
            subtitle: (
                <Text className="font-poppins-small text-gray-500 p-4">
                    Consult with our medical experts and enjoy a seamless appointment
                    booking experience.
                </Text>
            ),
        },
        {
            backgroundColor: "#fff",
            image:  <Image 
                    source={Images.appointment} 
                    className="w-80 h-80 rounded-lg"
                    style={{
                        // iOS shadows
                        shadowColor: '#000',
                        shadowOffset: {
                        width: 0,
                        height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        
                        // Android shadow
                        elevation: 5,
                    }} />,
            title: (
                <Text className="text-3xl font-bold text-start w-full p-3" style={{ color: Colors.bgColor(0.8) }} >
                    Track and manage your appointments
                </Text>
            ),
            subtitle: (
                <Text className="font-poppins-small text-gray-500 p-4">
                    Explore to find your suitable doctor and
                    book an appointment right from their available schedules.
                </Text>
            ),
        }
    ];

    const handleDone = async () => {
        await SecureStore.setItemAsync("onboardingShown", "true");
        navigation.replace("auth");
    };
    
    const doneButton = ({ ...props }) => (
        <TouchableOpacity>
            <Text
                className="font-poppins-regular font-bold"
                style={{ fontSize: 16, color: Colors.bgColor(0.8), padding: 20 }}
                {...props}
            >
                Get Started
            </Text>
        </TouchableOpacity>
    );

    return (
        <>
            <StatusBar 
                backgroundColor="transparent"
                barStyle="dark-content"
                translucent
            />
            <Onboarding
                onSkip={handleDone}
                onDone={handleDone}
                bottombarHighlight={false}
                pages={onboardingPages}
                containerStyles={{ flex: 1, paddingHorizontal: 20 }}
                DoneButtonComponent={doneButton}
                bottomBarColor="#fff"
                nextLabel={
                    <View 
                        style={{ backgroundColor: Colors.bgColor(0.8) }}
                        className="w-12 h-12 rounded-full items-center justify-center"
                    >
                        <AntDesign name="arrowright" size={20} color="#fff" />
                    </View>
                }
                skipLabel={
                    <Text className="font-bold" style={{ color: Colors.bgColor(0.8) }}>
                        Skip
                    </Text>
                }
            />
        </>
    );
};

export default OnboardingScreens;