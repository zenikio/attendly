import React from "react"
import { Text, View } from "react-native"
import { Ionicons } from '@expo/vector-icons'
import useThemeColor from "../hooks/useThemeColor"

export default function HistoryCard({
    name,
    isPresent,
}) {
    const colors = useThemeColor();
    const isAttended = isPresent === 1;
    
    return (
        <View className="p-4 flex-row items-center bg-card rounded-2xl border border-border mb-2">
            <View 
                className="w-10 h-10 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: isAttended ? colors.success + '20' : colors.danger + '20' }}
            >
                <Ionicons 
                    name={isAttended ? "checkmark" : "close"} 
                    size={20} 
                    color={isAttended ? colors.success : colors.danger} 
                />
            </View>
            <View className="flex-1">
                <Text className="text-base font-outfit-semibold text-text" numberOfLines={1}>
                    {name}
                </Text>
                <Text 
                    className="text-sm font-outfit-regular mt-0.5"
                    style={{ color: isAttended ? colors.success : colors.danger }}
                >
                    {isAttended ? 'Present' : 'Absent'}
                </Text>
            </View>
        </View>
    )
}