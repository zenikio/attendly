import { Text, View, Pressable } from "react-native"
import { useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import useThemeColor from "../hooks/useThemeColor";

const Empty = () => {
    const colors = useThemeColor();
    const router = useRouter();

    return (
        <View className="flex-1 py-12 items-center justify-center px-8">
            <View className="w-20 h-20 rounded-full bg-primary/10 items-center justify-center mb-6">
                <Ionicons name="checkmark-done" size={40} color={colors.primary} />
            </View>
            <Text className="text-text text-2xl text-center font-outfit-semibold mb-2">
                No subjects yet
            </Text>
            <Text className="text-muted text-base font-outfit-regular text-center mb-6 leading-6">
                Add your first subject to start tracking your attendance
            </Text>
            <Pressable
                onPress={() => router.push('/add')}
                className="bg-primary py-3 px-8 rounded-full active:opacity-90"
            >
                <Text className="text-white font-outfit-semibold text-base">
                    Add Subject
                </Text>
            </Pressable>
        </View>
    )
}

export default Empty;