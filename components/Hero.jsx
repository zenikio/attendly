import React, { useMemo } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import useSubjectsStore from '../stores/subjectsStore';
import useThemeColor from '../hooks/useThemeColor';
import useSettingsStore from '../stores/settingsStore';
import { calculatePercentage, getAdvice, getStatus, getWeightedTotals } from '../utils/attendance';

const { width } = Dimensions.get('window');

export default function Hero() {
    const subjects = useSubjectsStore(state => state.subjects);
    const colors = useThemeColor();
    const target = useSettingsStore(state => state.target);

    const { overallPercentage, message, statusType } = useMemo(() => {
        if (!subjects.length) {
            return {
                overallPercentage: 0,
                message: 'Add subjects to track attendance!',
                statusType: 'neutral'
            };
        }

        const { attended: totalAttended, total: totalClasses } = getWeightedTotals(subjects);

        if (totalClasses === 0) {
            return {
                overallPercentage: 0,
                message: 'Time to attend your first class!',
                statusType: 'neutral'
            };
        }

        const percentage = calculatePercentage(totalAttended, totalClasses);
        const status = getStatus(percentage, target);
        const advice = getAdvice({
            attended: totalAttended,
            total: totalClasses,
            isFixed: subjects.every(s => s.is_fixed_total),
            target,
        });
        const plural = (n) => `${n} ${n === 1 ? 'class' : 'classes'}`;
        let msg = "You're on track! Keep it up.";
        if (advice?.type === 'skip') msg = `You can safely miss ${plural(advice.count)} more.`;
        if (advice?.type === 'attend') msg = `Attend ${plural(advice.count)} more to hit ${target}%.`;

        return {
            overallPercentage: percentage,
            message: msg,
            statusType: status
        };
    }, [subjects, target]);

    const getGradientColors = () => {
        if (colors.isDark) {
            if (statusType === 'success') {
                return ['#166534', '#4c1d95'];
            } else if (statusType === 'warning') {
                return ['#9a3412', '#4c1d95'];
            }
            return ['#991b1b', '#4c1d95'];
        }

        if (statusType === 'success') {
            return [colors.success, colors.primary];
        } else if (statusType === 'warning') {
            return [colors.warning, colors.primary];
        }
        return [colors.danger, colors.primary];
    };

    const wholeNumber = Math.floor(overallPercentage);
    const decimal = (overallPercentage % 1).toFixed(2).substring(2);

    return (
        <View className="mx-4 my-3">
            <LinearGradient
                colors={getGradientColors()}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ borderRadius: 24, overflow: "hidden" }}
            >
                <View className="p-6 flex-row justify-between items-center" style={{ minHeight: width * 0.38 }}>
                    <View className="flex-1 space-y-1 pr-4">
                        <Text className="font-outfit-medium text-sm text-white/80 uppercase tracking-wider">
                            Overall Attendance
                        </Text>
                        <View className="flex-row items-baseline">
                            <Text className="text-white font-outfit-extrabold text-6xl">
                                {wholeNumber}
                            </Text>
                            <Text className="text-white/90 font-outfit-semibold text-2xl">
                                .{decimal}%
                            </Text>
                        </View>
                        <Text className="text-white/80 font-outfit-regular text-sm mt-2">
                            {message}
                        </Text>
                    </View>
                    <View className="items-center justify-center opacity-30">
                        <Ionicons
                            name="stats-chart"
                            size={width * 0.18}
                            color="#ffffff"
                        />
                    </View>
                </View>
            </LinearGradient>
        </View>
    );
}
