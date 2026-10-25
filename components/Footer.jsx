import React from 'react'
import { View, Text, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons';
import useThemeColor from '../hooks/useThemeColor';

export default function Footer() {
    const colors = useThemeColor();
    const router = useRouter();

    const navItems = [
        { route: '/add', icon: 'add-circle-outline', label: 'Add' },
        { route: '/history', icon: 'time-outline', label: 'History' },
        { route: '/whatif', icon: 'bulb-outline', label: 'What If?' },
        { route: '/settings', icon: 'settings-outline', label: 'Settings' },
    ];

    return (
        <View className="bg-card border-t border-border">
            <View className="flex-row justify-around py-2">
                {navItems.map((item) => (
                    <Pressable
                        key={item.route}
                        onPress={() => item.route === '/add' ? router.push(item.route) : router.navigate(item.route)}
                        className="items-center px-4 py-3 rounded-xl flex-1 active:bg-primary/10"
                    >
                        <Ionicons name={item.icon} size={24} color={colors.primary} />
                        <Text className="text-xs font-outfit-medium mt-1 text-primary">
                            {item.label}
                        </Text>
                    </Pressable>
                ))}
            </View>
        </View>
    )
}