import { useFonts } from "expo-font";
import { Stack, useSegments, Redirect } from "expo-router";
import React, { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import Toast from "react-native-toast-message";
import { useColorScheme } from "nativewind";
import "../global.css";
import useThemeStore from "../stores/themeStore";
import useOnboardingStore from "../stores/onboardingStore";
import { applyTheme } from "../utils/theme";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const { theme } = useThemeStore();
    const { colorScheme } = useColorScheme();
    const { hasCompletedOnboarding, hasHydrated } = useOnboardingStore();
    const segments = useSegments();

    const [fontsLoaded, error] = useFonts({
        "Outfit-Black": require("../assets/fonts/Outfit-Black.ttf"),
        "Outfit-Bold": require("../assets/fonts/Outfit-Bold.ttf"),
        "Outfit-ExtraBold": require("../assets/fonts/Outfit-ExtraBold.ttf"),
        "Outfit-ExtraLight": require("../assets/fonts/Outfit-ExtraLight.ttf"),
        "Outfit-Light": require("../assets/fonts/Outfit-Light.ttf"),
        "Outfit-Medium": require("../assets/fonts/Outfit-Medium.ttf"),
        "Outfit-Regular": require("../assets/fonts/Outfit-Regular.ttf"),
        "Outfit-SemiBold": require("../assets/fonts/Outfit-SemiBold.ttf"),
        "Outfit-Thin": require("../assets/fonts/Outfit-Thin.ttf"),
    });

    useEffect(() => {
        if (error) throw error;

        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded, error]);

    useEffect(() => {
        if (theme) {
            applyTheme(theme);
        }
    }, [theme]);

    const isDark = colorScheme === 'dark';

    if ((!fontsLoaded && !error) || !hasHydrated) {
        return null;
    }

    const inOnboardingGroup = segments[0] === 'onboarding';

    if (!hasCompletedOnboarding && !inOnboardingGroup) {
        return <Redirect href="/onboarding" />;
    }

    if (hasCompletedOnboarding && inOnboardingGroup) {
        return <Redirect href="/" />;
    }

    return (
        <GestureHandlerRootView className="flex-1 bg-background">
            <StatusBar style={isDark ? 'light' : 'dark'} />
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: {
                        backgroundColor: 'transparent',
                    },
                }}
            >
                <Stack.Screen name="index" options={{
                    headerShown: false,
                    animation: "fade"
                }} />
                <Stack.Screen name="onboarding" options={{
                    headerShown: false,
                    animation: "fade",
                    gestureEnabled: false
                }} />
                <Stack.Screen name="add" options={{
                    headerShown: false,
                    animation: "slide_from_bottom"
                }} />
                <Stack.Screen name="detail" options={{
                    headerShown: false,
                    animation: "slide_from_right"
                }} />
                <Stack.Screen name="history" options={{
                    headerShown: false,
                    animation: "slide_from_bottom"
                }} />
                <Stack.Screen name="whatif" options={{
                    headerShown: false,
                    animation: "slide_from_bottom"
                }} />
                <Stack.Screen name="faq" options={{
                    headerShown: false,
                    animation: "slide_from_right"
                }} />
                <Stack.Screen name="settings" options={{
                    headerShown: false,
                    animation: "slide_from_right"
                }} />
            </Stack>
            <Toast />
        </GestureHandlerRootView>
    )
}
