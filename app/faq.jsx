import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, LayoutAnimation } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import useThemeColor from '../hooks/useThemeColor';

const faqData = [
    {
        question: "How is the overall attendance percentage calculated?",
        answer: "The overall attendance percentage is a weighted average. It considers the 'attendance per class' value you set for each subject. Subjects with a higher 'attendance per class' value will have a greater impact on the overall percentage."
    },
    {
        question: "What do the colors on the course cards mean?",
        answer: "The colors indicate your attendance status for that subject:\n• Green: at or above your target (safe zone)\n• Yellow/Orange: within 15 points below your target (warning)\n• Red: more than 15 points below your target (needs attention)\nYou can change the target in Settings (default 75%)."
    },
    {
        question: "How do I mark attendance for it to appear in History?",
        answer: "On the main screen, swipe a course card to the right to mark 'Present' or to the left to mark 'Absent' for one class. Only actions performed via swipe gestures are recorded in the attendance history."
    },
    {
        question: "Can I edit subject details after adding them?",
        answer: "Yes! Tap on any course card on the main screen. This will take you to the 'Subject Details' page where you can modify the name, total classes, and classes attended. Note: 'Attendance per Class' value cannot be changed after creation to maintain consistency in calculations."
    },
    {
        question: "Why is my attendance history not getting recorded for some entries?",
        answer: "Attendance history is recorded when you mark attendance by swiping a course card right (Present) or left (Absent) on the main screen. If you update your attendance numbers directly on the 'Subject Details' page, these bulk changes are not logged as individual historical entries."
    },
    {
        question: "How does the 'What If?' feature work?",
        answer: "The 'What If?' feature allows you to see how your overall attendance percentage would change if you were to miss a certain number of additional classes. It also shows you how many classes you can safely miss while maintaining at least your target attendance."
    },
    {
        question: "I marked attendance by mistake. How do I undo it?",
        answer: "Open the subject and tap the x next to the entry under Recent History. Removing an entry also reverses it in your counts: a Present entry lowers attended and total by 1, an Absent entry lowers total by 1. In Fixed Total Mode the total never changes. The confirmation shows exactly what will change."
    },
    {
        question: "How does the 'History' page work?",
        answer: "The 'History' page shows a log of all attendance marked via swipe gestures on the main screen, day by day. You can select a specific date to view the attendance records for that day."
    },
    {
        question: "Where is my data stored?",
        answer: "Your attendance data is stored locally on your device in a SQLite database. It is not uploaded to any server, ensuring your privacy."
    }
];

const FaqItem = ({ item, isLast }) => {
    const [isOpen, setIsOpen] = useState(false);
    const colors = useThemeColor();

    const toggleOpen = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsOpen(!isOpen);
    };

    return (
        <Pressable
            onPress={toggleOpen}
            className={`py-4 ${!isLast ? 'border-b border-border' : ''}`}
        >
            <View className="flex-row items-start">
                <View className="flex-1 pr-3">
                    <Text className="text-base font-outfit-medium text-text leading-6">
                        {item.question}
                    </Text>
                    {isOpen && (
                        <Text className="text-sm font-outfit-regular text-muted mt-3 leading-6">
                            {item.answer}
                        </Text>
                    )}
                </View>
                <View className="w-8 h-8 rounded-full bg-primary/10 items-center justify-center">
                    <Ionicons
                        name={isOpen ? "chevron-up" : "chevron-down"}
                        size={18}
                        color={colors.primary}
                    />
                </View>
            </View>
        </Pressable>
    );
};

export default function FaqPage() {
    const colors = useThemeColor();
    const router = useRouter();

    const handleBack = () => {
        router.back();
    };

    return (
        <SafeAreaView className="bg-background flex-1">
            <View className="flex-row items-center px-4 py-3 border-b border-border">
                <Pressable
                    onPress={handleBack}
                    className="p-2 -ml-2 rounded-full active:bg-primary/10"
                >
                    <Ionicons name="arrow-back" size={24} color={colors.primary} />
                </Pressable>
                <Text className="text-text text-xl font-outfit-semibold ml-2">
                    FAQ
                </Text>
            </View>

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ padding: 16 }}
                showsVerticalScrollIndicator={false}
            >
                <View className="bg-card rounded-2xl border border-border p-4">
                    {faqData.map((item, index) => (
                        <FaqItem
                            key={index}
                            item={item}
                            isLast={index === faqData.length - 1}
                        />
                    ))}
                </View>

                <View className="py-8 items-center">
                    <Text className="text-muted text-sm font-outfit-regular">
                        Made with ❤️ by Zenik
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
