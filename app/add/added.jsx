import { Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import useThemeColor from "../../hooks/useThemeColor";

const Page = () => {
    const colors = useThemeColor();

    const handleOkPress = () => {
        router.replace("/");
    };

    return (
        <SafeAreaView className="flex-1 bg-background">
            <Animatable.View
                className="flex-1 items-center justify-center px-8"
                animation="fadeIn"
                duration={800}
            >
                <Animatable.View
                    animation="bounceIn"
                    duration={1200}
                    delay={300}
                    className="w-24 h-24 rounded-full items-center justify-center mb-8"
                    style={{ backgroundColor: colors.success + '20' }}
                >
                    <Ionicons name="checkmark" size={56} color={colors.success} />
                </Animatable.View>

                <Animatable.Text
                    className="text-3xl font-outfit-bold text-text text-center mb-3"
                    animation="fadeInUp"
                    delay={700}
                    duration={800}
                >
                    Subject Added!
                </Animatable.Text>

                <Animatable.Text
                    className="text-base font-outfit-regular text-muted text-center mb-12 leading-6"
                    animation="fadeInUp"
                    delay={900}
                    duration={800}
                >
                    Your subject has been added successfully.{'\n'}Start tracking your attendance now!
                </Animatable.Text>

                <Animatable.View
                    animation="fadeInUp"
                    delay={1100}
                    duration={800}
                    className="w-full"
                >
                    <Pressable
                        onPress={handleOkPress}
                        className="bg-primary py-4 px-8 rounded-xl w-full active:opacity-90"
                    >
                        <Text className="text-white text-center text-base font-outfit-semibold">
                            Done
                        </Text>
                    </Pressable>
                </Animatable.View>
            </Animatable.View>
        </SafeAreaView>
    );
};

export default Page;