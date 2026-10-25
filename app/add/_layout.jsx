import { Stack } from "expo-router";
import { View } from "react-native";

export default function AddLayout() {
    return (
        <View className="flex-1 bg-background">
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: 'transparent' },
                }}
            >
                <Stack.Screen name="index" options={{
                    headerShown: false,
                }} />
                <Stack.Screen name="value" options={{
                    headerShown: false,
                    animation: "slide_from_right"
                }} />
                <Stack.Screen name="ask" options={{
                    headerShown: false,
                    animation: "slide_from_right"
                }} />
                <Stack.Screen name="added" options={{
                    headerShown: false,
                    animation: "slide_from_right"
                }} />
            </Stack>
        </View>
    )
}