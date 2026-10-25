import React, { useRef } from "react"
import { Animated, Pressable, Text, View } from "react-native"
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable"
import { Link } from "expo-router"
import { getAllSubjects, markAttendance } from "../libs/database"
import useSubjectsStore from "../stores/subjectsStore"
import useThemeColor from "../hooks/useThemeColor"
import useSettingsStore from "../stores/settingsStore"
import { calculatePercentage, getAdvice, getStatusColor } from "../utils/attendance"
import AdviceText from "./AdviceText"
import SwipeAction from "./SwipeAction"

const CourseCard = ({ subject }) => {
    const { id, name, total, attended, is_fixed_total } = subject
    const target = useSettingsStore(state => state.target)
    const showAbsent = useSettingsStore(state => state.showAbsent)
    const colors = useThemeColor()
    const swipeableRef = useRef(null)

    const update = async (isPresent) => {
        try {
            await markAttendance(id, isPresent)
            useSubjectsStore.getState().setSubjects(await getAllSubjects())
        } catch (error) {
            console.error("Error updating attendance: ", error)
            useSubjectsStore.getState().setError('Failed to update attendance. Please try again.')
        }
    }

    const percentage = calculatePercentage(attended, total)
    const attendancePercentage = percentage.toFixed(2)
    const statusColor = total === 0 ? colors.muted : getStatusColor(percentage, target, colors)

    const renderLeftActions = (progress, translation) => (
        <SwipeAction
            translation={translation}
            side="left"
            icon="checkmark-circle"
            label="Present"
            backgroundColor={colors.success}
        />
    )

    const renderRightActions = (progress, translation) => (
        <SwipeAction
            translation={translation}
            side="right"
            icon="close-circle"
            label="Absent"
            backgroundColor={colors.danger}
        />
    )

    const handleSwipeOpen = (direction) => {
        update(direction === 'right')
        setTimeout(() => swipeableRef.current?.close(), 100)
    }

    return (
        <Swipeable
            ref={swipeableRef}
            renderLeftActions={renderLeftActions}
            renderRightActions={renderRightActions}
            onSwipeableOpen={handleSwipeOpen}
            friction={2}
            leftThreshold={60}
            rightThreshold={60}
            overshootLeft={false}
            overshootRight={false}
        >
            <View className="rounded-2xl mx-4 my-1.5 overflow-hidden bg-card border border-border">
                <Link
                    href={{
                        pathname: '/detail',
                        params: { subject: JSON.stringify(subject) }
                    }}
                    asChild
                >
                    <Pressable className="px-4 py-3 active:bg-primary/5">
                        <View className="flex-row items-center">
                            <View className="flex-1 mr-3">
                                <Text
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                    className="text-base font-outfit-semibold text-text mb-2"
                                >
                                    {name}
                                </Text>
                                <View className="flex-row items-center">
                                    <View className="flex-1 h-2 bg-border/50 rounded-full overflow-hidden">
                                        <Animated.View
                                            className="h-full rounded-full"
                                            style={{
                                                width: `${Math.min(percentage, 100)}%`,
                                                backgroundColor: statusColor
                                            }}
                                        />
                                    </View>
                                    <Text
                                        className="ml-3 text-sm font-outfit-bold min-w-[48px] text-right"
                                        style={{ color: statusColor }}
                                    >
                                        {attendancePercentage}%
                                    </Text>
                                </View>
                                <AdviceText
                                    className="mt-1.5 text-xs"
                                    advice={getAdvice({ attended, total, isFixed: is_fixed_total === 1, target })}
                                />
                            </View>
                            <View className="items-center bg-primary/10 rounded-xl px-3 py-2 min-w-[56px]">
                                <Text className="text-xl font-outfit-extrabold text-primary">
                                    {showAbsent && !is_fixed_total ? total - attended : attended}
                                </Text>
                                <Text className="text-[10px] font-outfit-medium text-muted">
                                    {showAbsent && !is_fixed_total ? "absent" : `/ ${total}`}
                                </Text>
                            </View>
                        </View>
                    </Pressable>
                </Link>
            </View>
        </Swipeable>
    )
}

export default CourseCard