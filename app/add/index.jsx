import { View, Text, Pressable, TextInput } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import useSubjectFormStore from "../../stores/subjectFormStore";
import Toast from 'react-native-toast-message';
import CloseIcon from "../../components/icons/CloseIcon";
import useThemeColor from "../../hooks/useThemeColor";

const Page = () => {
    const colors = useThemeColor();
    const handleBack = () => {
        router.back();
    }

    const { name, setName } = useSubjectFormStore();

    const handleNext = () => {
        if (!name || name.trim() === '') {
            Toast.show({
                type: 'error',
                position: 'bottom',
                text1: 'Subject Required',
                text2: 'Please enter a subject name to continue',
                visibilityTime: 3000,
                autoHide: true,
                topOffset: 30,
                bottomOffset: 40,
            });
            return;
        }
        router.push("/add/value");
    };

    return (
        <SafeAreaView className="bg-background flex-1">
            <View className="flex-row items-center px-4 py-3">
                <Pressable 
                    onPress={handleBack}
                    className="p-2 -ml-2 rounded-full active:bg-primary/10"
                >
                    <CloseIcon size={24} color={colors.primary} />
                </Pressable>
                <Text className="text-text text-xl font-outfit-semibold ml-2">
                    Add Subject
                </Text>
            </View>

            <View className="flex-1 px-4">
                <View className="flex-row items-center mb-6">
                    <View className="w-8 h-8 rounded-full bg-primary items-center justify-center">
                        <Text className="text-white font-outfit-semibold">1</Text>
                    </View>
                    <View className="flex-1 h-1 bg-border mx-2" />
                    <View className="w-8 h-8 rounded-full bg-border items-center justify-center">
                        <Text className="text-muted font-outfit-semibold">2</Text>
                    </View>
                    <View className="flex-1 h-1 bg-border mx-2" />
                    <View className="w-8 h-8 rounded-full bg-border items-center justify-center">
                        <Text className="text-muted font-outfit-semibold">3</Text>
                    </View>
                </View>

                <Text className="text-sm font-outfit-medium text-muted uppercase tracking-wider mb-2">
                    Subject Name
                </Text>
                <TextInput
                    className="bg-card rounded-xl p-4 font-outfit-medium text-lg text-text border border-border"
                    placeholder="e.g., Mathematics, Physics..."
                    placeholderTextColor={colors.muted}
                    cursorColor={colors.primary}
                    onChangeText={(text) => setName(text)}
                    value={name || ''}
                    autoFocus
                />
                <Text className="text-muted text-sm font-outfit-regular mt-2">
                    Enter the name of your subject or course
                </Text>
            </View>

            <View className="px-4 pb-4">
                <Pressable 
                    onPress={handleNext}
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