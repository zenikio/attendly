import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView } from "react-native-safe-area-context"
import { View, Text, Pressable, FlatList } from "react-native"
import { Ionicons } from '@expo/vector-icons'
import DateTimePickerModal from "react-native-modal-datetime-picker"
import HistoryCard from '../components/HistoryCard'
import { useRouter } from 'expo-router'
import { getAttendanceHistory } from '../libs/database'
import useThemeColor from '../hooks/useThemeColor'

export default function HistoryPage() {
    const router = useRouter();
    const colors = useThemeColor();
    const [history, setHistory] = useState([])
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [selectedDate, setSelectedDate] = useState(new Date())

    const handleDateConfirm = (date) => {
        setSelectedDate(date)
        setIsModalVisible(false)
    }

    const loadHistory = useCallback(async () => {
        try {
            const historyData = await getAttendanceHistory(selectedDate)
            setHistory(historyData)
        } catch (error) {
            console.error('Error loading history:', error)
        }
    }, [selectedDate])

    useEffect(() => {
        loadHistory()
    }, [loadHistory])

    const handleBack = () => {
        router.back()
    }

    const renderItem = ({ item }) => (
        <HistoryCard
            name={item.subject_name}
            isPresent={item.is_present}
        />
    )

    const EmptyListComponent = () => (
        <View className="flex-1 justify-center items-center py-16 px-8">
            <View className="w-16 h-16 rounded-full bg-primary/10 items-center justify-center mb-4">
                <Ionicons name="calendar-outline" size={32} color={colors.primary} />
            </View>
            <Text className="text-text text-lg font-outfit-semibold text-center mb-2">
                No records found
            </Text>
            <Text className="text-muted text-sm font-outfit-regular text-center">
                No attendance was recorded for this date
            </Text>
        </View>
    )

    const formatDate = (date) => {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        }
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
        });
    }

    return (
        <SafeAreaView className="bg-background flex-1">
            <View className="flex-row items-center px-4 py-3 border-b border-border">
                <Pressable
                    onPress={handleBack}
                    className="p-2 -ml-2 rounded-full active:bg-primary/10"
                >
                    <Ionicons name="arrow-back" size={24} color={colors.primary} />
                </Pressable>
                <Text className="text-text text-xl font-outfit-semibold ml-2 flex-1">
                    History
                </Text>
                <Pressable
                    onPress={() => setIsModalVisible(true)}
                    className="flex-row items-center bg-primary/10 px-4 py-2 rounded-full active:bg-primary/20"
                >
                    <Ionicons name="calendar-outline" size={18} color={colors.primary} />
                    <Text className="text-primary font-outfit-medium ml-2">
                        {formatDate(selectedDate)}
                    </Text>
                </Pressable>
            </View>

            <View className="flex-row items-center px-4 py-2 bg-primary/5">
                <Ionicons name="information-circle-outline" size={16} color={colors.muted} />
                <Text className="flex-1 ml-2 text-xs font-outfit-regular text-muted">
                    To remove an entry, open the subject and delete it from Recent History.
                </Text>
            </View>

            <FlatList
                data={history}
                renderItem={renderItem}
                keyExtractor={(item) => item.history_id.toString()}
                ListEmptyComponent={EmptyListComponent}
                contentContainerStyle={{ flexGrow: 1, padding: 16 }}
                showsVerticalScrollIndicator={false}
            />

            <DateTimePickerModal
                isVisible={isModalVisible}
                mode="date"
                onConfirm={handleDateConfirm}
                onCancel={() => setIsModalVisible(false)}
                date={selectedDate}
                maximumDate={new Date()}
                isDarkModeEnabled={colors.isDark}
            />
        </SafeAreaView>
    )
}