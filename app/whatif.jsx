import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import useSubjectsStore from '../stores/subjectsStore';
import CounterInput from '../components/CounterInput';
import useThemeColor from '../hooks/useThemeColor';
import useSettingsStore from '../stores/settingsStore';
import { calculatePercentage, classesCanSkip, getStatusColor, getWeightedTotals } from '../utils/attendance';

export default function WhatIfPage() {
    const colors = useThemeColor();
    const target = useSettingsStore(state => state.target);
    const router = useRouter();
    const subjects = useSubjectsStore(state => state.subjects);
    const [missedClasses, setMissedClasses] = useState(0);

    const { attended: totalAttended, total: totalClasses } = getWeightedTotals(subjects);
    const currentPercentage = calculatePercentage(totalAttended, totalClasses).toFixed(2);
    const newPercentage = calculatePercentage(totalAttended, totalClasses + missedClasses).toFixed(2);
    const statusColor = (percentage) => getStatusColor(parseFloat(percentage), target, colors);

    const handleBack = () => {
        router.back();
    };

    const safeToSkip = classesCanSkip(totalAttended, totalClasses, target);
    const dropAmount = (currentPercentage - newPercentage).toFixed(2);

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
                    What If?
                </Text>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="px-4 pt-4 pb-2">
                    <Text className="text-muted font-outfit-regular text-base">
                        See how missing classes would affect your overall attendance percentage.
                    </Text>
                </View>

                {subjects.length > 0 ? (
                    <>
                        <CounterInput
                            label="Classes to Miss"
                            value={missedClasses}
                            onValueChange={setMissedClasses}
                            min={0}
                        />

                        <View className="mx-4 mb-4 bg-card rounded-2xl border border-border overflow-hidden">
                            <View className="flex-row">
                                <View className="flex-1 p-5 items-center border-r border-border">
                                    <Text className="text-sm font-outfit-medium text-muted uppercase tracking-wider mb-3">
                                        Current
                                    </Text>
                                    <Text
                                        className="text-4xl font-outfit-extrabold"
                                        style={{ color: statusColor(currentPercentage) }}
                                    >
                                        {currentPercentage}%
                                    </Text>
                                    <Text className="text-xs font-outfit-regular text-muted mt-2">
                                        {totalAttended} / {totalClasses}
                                    </Text>
                                </View>

                                <View className="flex-1 p-5 items-center">
                                    <Text className="text-sm font-outfit-medium text-muted uppercase tracking-wider mb-3">
                                        After Missing
                                    </Text>
                                    <Text
                                        className="text-4xl font-outfit-extrabold"
                                        style={{ color: statusColor(newPercentage) }}
                                    >
                                        {newPercentage}%
                                    </Text>
                                    <Text className="text-xs font-outfit-regular text-muted mt-2">
                                        {totalAttended} / {totalClasses + missedClasses}
                                    </Text>
                                </View>
                            </View>

                            {missedClasses > 0 && (
                                <View className="bg-border/30 p-4 flex-row items-center justify-center">
                                    <Ionicons name="trending-down" size={20} color={colors.danger} />
                                    <Text className="text-base font-outfit-semibold ml-2" style={{ color: colors.danger }}>
                                        {dropAmount}% drop
                                    </Text>
                                </View>
                            )}
                        </View>

                        {safeToSkip > 0 ? (
                            <View
                                className="mx-4 mb-4 p-4 rounded-2xl flex-row items-center"
                                style={{ backgroundColor: colors.success + '15' }}
                            >
                                <View
                                    className="w-10 h-10 rounded-full items-center justify-center mr-3"
                                    style={{ backgroundColor: colors.success + '20' }}
                                >
                                    <Ionicons name="shield-checkmark" size={20} color={colors.success} />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-base font-outfit-semibold text-text">
                                        You can safely miss {safeToSkip} more {safeToSkip === 1 ? 'class' : 'classes'}
                                    </Text>
                                    <Text className="text-sm font-outfit-regular text-muted mt-0.5">
                                        And still maintain {target}% attendance
                                    </Text>
                                </View>
                            </View>
                        ) : totalClasses > 0 && (
                            <View
                                className="mx-4 mb-4 p-4 rounded-2xl flex-row items-center"
                                style={{ backgroundColor: colors.warning + '15' }}
                            >
                                <View
                                    className="w-10 h-10 rounded-full items-center justify-center mr-3"
                                    style={{ backgroundColor: colors.warning + '20' }}
                                >
                                    <Ionicons name="alert-circle" size={20} color={colors.warning} />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-base font-outfit-semibold text-text">
                                        No room to miss classes
                                    </Text>
                                    <Text className="text-sm font-outfit-regular text-muted mt-0.5">
                                        Attend more classes to build a buffer
                                    </Text>
                                </View>
                            </View>
                        )}
                    </>
                ) : (
                    <View className="flex-1 justify-center items-center py-16 px-8">
                        <View className="w-16 h-16 rounded-full bg-primary/10 items-center justify-center mb-4">
                            <Ionicons name="bulb-outline" size={32} color={colors.primary} />
                        </View>
                        <Text className="text-text text-lg font-outfit-semibold text-center mb-2">
                            No subjects yet
                        </Text>
                        <Text className="text-muted text-sm font-outfit-regular text-center">
                            Add subjects to calculate potential attendance changes
                        </Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}