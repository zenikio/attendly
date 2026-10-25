import { View, Text, Pressable } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import CounterInput from "../../components/CounterInput";
import useSubjectFormStore from "../../stores/subjectFormStore";
import useThemeColor from "../../hooks/useThemeColor";

const Page = () => {
    const colors = useThemeColor();

    const handleBack = () => {
        router.back();
    }

    const { value, setValue } = useSubjectFormStore();

    return (
        <SafeAreaView className="bg-background flex-1">
            <View className="flex-row items-center px-4 py-3">
                <Pressable 
                    onPress={handleBack}
                    className="p-2 -ml-2 rounded-full active:bg-primary/10"
                >
                    <Ionicons name="arrow-back" size={24} color={colors.primary} />
                </Pressable>
                <Text className="text-text text-xl font-outfit-semibold ml-2">
                    Attendance Value
                </Text>
            </View>

            <View className="flex-1 px-4">
                <View className="flex-row items-center mb-6">
                    <View className="w-8 h-8 rounded-full bg-primary/30 items-center justify-center">
                        <Ionicons name="checkmark" size={18} color={colors.primary} />
                    </View>
                    <View className="flex-1 h-1 bg-primary mx-2" />
                    <View className="w-8 h-8 rounded-full bg-primary items-center justify-center">
                        <Text className="text-white font-outfit-semibold">2</Text>
                    </View>
                    <View className="flex-1 h-1 bg-border mx-2" />
                    <View className="w-8 h-8 rounded-full bg-border items-center justify-center">
                        <Text className="text-muted font-outfit-semibold">3</Text>
                    </View>
                </View>

                <View className="bg-card rounded-2xl p-4 border border-border mb-4">
                    <View className="flex-row items-center mb-2">
                        <Ionicons name="information-circle" size={20} color={colors.primary} />
                        <Text className="text-base font-outfit-semibold text-text ml-2">
                            What is this?
                        </Text>
                    </View>
                    <Text className="text-muted text-sm font-outfit-regular leading-5">
                        Some classes count as multiple attendances. For example, a lab might count as 2-4 regular classes. Set the value accordingly.
                    </Text>
                </View>

                <CounterInput
                    label="Attendance per Class"
                    value={value}
                    onValueChange={setValue}
                    min={1}
                />
            </View>

            <View className="px-4 pb-4">
                <Pressable 
                    onPress={() => router.push("/add/ask")}
                    className="bg-primary p-4 rounded-xl flex-row items-center justify-center active:opacity-90"
                >
                    <Text className="text-white font-outfit-semibold text-base mr-2">
                        Continue
                    </Text>
                    <Ionicons name="arrow-forward" size={20} color="#fff" />
                </Pressable>
            </View>
        </SafeAreaView>
    )
}

export default Page;
