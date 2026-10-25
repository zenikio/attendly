import React from 'react';
import { View, Text, Pressable, ScrollView, Linking, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import useThemeStore from '../stores/themeStore';
import useThemeColor from '../hooks/useThemeColor';
import useSettingsStore from '../stores/settingsStore';
import CounterInput from '../components/CounterInput';
import { applyTheme } from '../utils/theme';

const GITHUB_URL = 'https://github.com/zenikio/attendly';
const SUPPORT_URL = 'https://razorpay.me/@zenik';

const Settings = () => {
    const { theme, setTheme } = useThemeStore();
    const colors = useThemeColor();
    const { target, setTarget, showAbsent, setShowAbsent } = useSettingsStore();
    const router = useRouter();

    const handleThemeChange = (newTheme) => {
        setTheme(newTheme);
        applyTheme(newTheme);
    };

    const themes = [
        { key: 'system', id: 'system', name: 'System', icon: 'phone-portrait-outline', description: 'Follow device settings' },
        { key: 'light', id: 'light', name: 'Light', icon: 'sunny-outline', description: 'Always use light mode' },
        { key: 'dark', id: 'dark', name: 'Dark', icon: 'moon-outline', description: 'Always use dark mode' },
    ];

    const handleBack = () => {
        router.back();
    };

    return (
        <SafeAreaView className="flex-1 bg-background">
            <View className="flex-row items-center px-4 py-3 border-b border-border">
                <Pressable
                    onPress={handleBack}
                    className="p-2 -ml-2 rounded-full active:bg-primary/10"
                >
                    <Ionicons name="arrow-back" size={24} color={colors.primary} />
                </Pressable>
                <Text className="text-text text-xl font-outfit-semibold ml-2">
                    Settings
                </Text>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="px-4 pt-6 pb-2">
                    <Text className="text-sm font-outfit-medium text-muted uppercase tracking-wider">
                        Appearance
                    </Text>
                </View>
                <View className="mx-4 bg-card rounded-2xl overflow-hidden border border-border">
                    {themes.map((t, index) => (
                        <Pressable
                            key={t.key}
                            onPress={() => handleThemeChange(t.id)}
                            className={`flex-row items-center p-4 active:bg-primary/5 ${index !== themes.length - 1 ? 'border-b border-border' : ''
                                }`}
                        >
                            <View className={`w-10 h-10 rounded-full items-center justify-center ${theme === t.id ? 'bg-primary/15' : 'bg-border/50'
                                }`}>
                                <Ionicons
                                    name={t.icon}
                                    size={20}
                                    color={theme === t.id ? colors.primary : colors.muted}
                                />
                            </View>
                            <View className="flex-1 ml-3">
                                <Text className={`text-base font-outfit-medium ${theme === t.id ? 'text-primary' : 'text-text'
                                    }`}>
                                    {t.name}
                                </Text>
                                <Text className="text-sm font-outfit-regular text-muted">
                                    {t.description}
                                </Text>
                            </View>
                            {theme === t.id && (
                                <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                            )}
                        </Pressable>
                    ))}
                </View>

                <View className="px-4 pt-8 pb-2">
                    <Text className="text-sm font-outfit-medium text-muted uppercase tracking-wider">
                        Attendance
                    </Text>
                </View>
                <CounterInput label="Target Percentage" value={target} onValueChange={setTarget} min={1} max={100} />
                <View className="mx-4 mb-2 p-4 bg-card rounded-2xl border border-border flex-row items-center justify-between">
                    <View className="flex-1 mr-4">
                        <Text className="text-base font-outfit-semibold text-text">
                            Show absent count
                        </Text>
                        <Text className="text-sm font-outfit-regular text-muted mt-1 leading-5">
                            Show classes missed on each subject card instead of attended / total.
                        </Text>
                    </View>
                    <Switch
                        trackColor={{ false: colors.border, true: colors.primary }}
                        thumbColor="#ffffff"
                        onValueChange={setShowAbsent}
                        value={showAbsent}
                    />
                </View>

                <View className="px-4 pt-4 pb-2">
                    <Text className="text-sm font-outfit-medium text-muted uppercase tracking-wider">
                        Help & Support
                    </Text>
                </View>
                <View className="mx-4 bg-card rounded-2xl overflow-hidden border border-border">
                    <Pressable
                        onPress={() => router.push('/faq')}
                        className="flex-row items-center p-4 active:bg-primary/5"
                    >
                        <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center">
                            <Ionicons name="help-circle-outline" size={20} color={colors.primary} />
                        </View>
                        <Text className="ml-3 text-base font-outfit-medium text-text flex-1">
                            Frequently Asked Questions
                        </Text>
                        <Ionicons name="chevron-forward" size={20} color={colors.primary} />
                    </Pressable>
                </View>

                <View className="px-4 pt-8 pb-2">
                    <Text className="text-sm font-outfit-medium text-muted uppercase tracking-wider">
                        Rate Us
                    </Text>
                </View>
                <View className="mx-4 bg-card rounded-2xl p-5 border border-border">
                    <View className="flex-row items-start mb-4">
                        <Ionicons name="star" size={24} color={colors.warning} />
                        <View className="flex-1 ml-3">
                            <Text className="text-base font-outfit-medium text-text mb-1">
                                Enjoying Attendly?
                            </Text>
                            <Text className="text-sm font-outfit-regular text-muted leading-5">
                                Please take a moment to rate us on the Play Store. It helps us a lot!
                            </Text>
                        </View>
                    </View>
                    <Pressable
                        className="bg-primary p-4 rounded-xl flex-row justify-center items-center active:opacity-90"
                        onPress={() => Linking.openURL('https://play.google.com/store/apps/details?id=com.unico.attendly')}
                    >
                        <Ionicons name="logo-google-playstore" size={20} color="#fff" />
                        <Text className="text-white font-outfit-semibold ml-2 text-base">
                            Rate on Play Store
                        </Text>
                    </Pressable>
                </View>

                <View className="px-4 pt-8 pb-2">
                    <Text className="text-sm font-outfit-medium text-muted uppercase tracking-wider">
                        Open Source
                    </Text>
                </View>
                <View className="mx-4 bg-card rounded-2xl p-5 border border-border">
                    <Text className="text-sm font-outfit-regular text-muted leading-5 mb-4">
                        Attendly is free, ad-free and open source. Star the repo, report a bug, or chip in to keep it going.
                    </Text>
                    <Pressable
                        className="bg-primary p-4 rounded-xl flex-row justify-center items-center active:opacity-90"
                        onPress={() => Linking.openURL(GITHUB_URL)}
                    >
                        <Ionicons name="logo-github" size={20} color="#fff" />
                        <Text className="text-white font-outfit-semibold ml-2 text-base">
                            Star on GitHub
                        </Text>
                    </Pressable>
                    <Pressable
                        className="mt-3 p-4 rounded-xl flex-row justify-center items-center border border-border active:opacity-90"
                        onPress={() => Linking.openURL(`${GITHUB_URL}/issues`)}
                    >
                        <Ionicons name="bug-outline" size={20} color={colors.primary} />
                        <Text className="text-text font-outfit-semibold ml-2 text-base">
                            Report an Issue
                        </Text>
                    </Pressable>
                    <Pressable
                        className="mt-3 p-4 rounded-xl flex-row justify-center items-center border border-border active:opacity-90"
                        onPress={() => Linking.openURL(SUPPORT_URL)}
                    >
                        <Ionicons name="heart-outline" size={20} color={colors.danger} />
                        <Text className="text-text font-outfit-semibold ml-2 text-base">
                            Support the Developer
                        </Text>
                    </Pressable>
                </View>

                <View className="py-8 items-center">
                    <Text className="text-muted text-sm font-outfit-regular mt-1">
                        Made with ❤️ by Zenik
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Settings;
