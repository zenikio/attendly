import React, { useEffect } from 'react';
import { View, Text, Pressable, Switch, ScrollView, Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import CounterInput from '../../components/CounterInput';
import useSubjectFormStore from '../../stores/subjectFormStore';
import { addSubject } from '../../libs/database';
import useThemeColor from '../../hooks/useThemeColor';

const Page = () => {
    const colors = useThemeColor();
    const router = useRouter();
    const {
        classesHeld, setClassesHeld,
        classesAttended, setClassesAttended,
        value, setValue,
        name, setName,
        isFixedTotal, setIsFixedTotal
    } = useSubjectFormStore();

    useEffect(() => {
        if (classesAttended > classesHeld) {
            setClassesAttended(classesHeld);
        }
    }, [classesHeld]);

    const handleBack = () => {
        router.back();
    };

    const resetForm = () => {
        setName(null);
        setValue(1);
        setClassesHeld(0);
        setClassesAttended(0);
        setIsFixedTotal(false);
    };

    const handleNext = async () => {
        if (isFixedTotal && classesHeld === 0) {
            Alert.alert(
                'Total Classes Required',
                'When using Fixed Total Mode, you must set the total number of classes for the semester.'
            );
            return;
        }

        try {
            await addSubject({
                name: name,
                value: value,
                total: classesHeld,
                attended: classesAttended,
                is_fixed_total: isFixedTotal
            });
            resetForm();
            router.push('/add/added');
        } catch (error) {
            console.error('Error adding subject:', error);
            Alert.alert('Error', error.message || 'Failed to add subject. Please try again.');
        }
    };

    const handleSkip = async () => {
        if (isFixedTotal) {
            Alert.alert(
                'Cannot Skip',
                'Total classes are required when Fixed Total Mode is enabled.'
            );
            return;
        }

        try {
            await addSubject({
                name: name,
                value: value,
                total: 0,
                attended: 0,
                is_fixed_total: false
            });
            resetForm();
            router.push('/add/added');
        } catch (error) {
            console.error('Error adding subject:', error);
            Alert.alert('Error', error.message || 'Failed to add subject. Please try again.');
        }
    };

    return (
        <SafeAreaView className="bg-background flex-1">
            <View className="flex-row items-center justify-between px-4 py-3">
                <View className="flex-row items-center">
                    <Pressable
                        onPress={handleBack}
                        className="p-2 -ml-2 rounded-full active:bg-primary/10"
                    >
                        <Ionicons name="arrow-back" size={24} color={colors.primary} />
                    </Pressable>
                    <Text className="text-text text-xl font-outfit-semibold ml-2">
                        Initial Classes
                    </Text>
                </View>
                {!isFixedTotal && (
                    <Pressable
                        onPress={handleSkip}
                        className="px-4 py-2 rounded-full active:bg-primary/10"
                    >
                        <Text className="text-primary font-outfit-semibold">
                            Skip
                        </Text>
                    </Pressable>
                )}
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="px-4">
                    <View className="flex-row items-center mb-6">
                        <View className="w-8 h-8 rounded-full bg-primary/30 items-center justify-center">
                            <Ionicons name="checkmark" size={18} color={colors.primary} />
                        </View>
                        <View className="flex-1 h-1 bg-primary mx-2" />
                        <View className="w-8 h-8 rounded-full bg-primary/30 items-center justify-center">
                            <Ionicons name="checkmark" size={18} color={colors.primary} />
                        </View>
                        <View className="flex-1 h-1 bg-primary mx-2" />
                        <View className="w-8 h-8 rounded-full bg-primary items-center justify-center">
                            <Text className="text-white font-outfit-semibold">3</Text>
                        </View>
                    </View>

                    <View className="bg-card p-4 rounded-2xl border border-border mb-6">
                        <View className="flex-row items-center justify-between">
                            <View className="flex-1 mr-4">
                                <Text className="text-base font-outfit-semibold text-text">
                                    Fixed Total Mode
                                </Text>
                                <Text className="text-sm font-outfit-regular text-muted mt-1 leading-5">
                                    Set total semester classes upfront. Won't auto-increase when marking attendance.
                                </Text>
                            </View>
                            <Switch
                                trackColor={{ false: colors.border, true: colors.primary }}
                                thumbColor="#ffffff"
                                onValueChange={setIsFixedTotal}
                                value={isFixedTotal}
                            />
                        </View>
                    </View>
                </View>

                <CounterInput
                    label={isFixedTotal ? "Total Semester Classes (Required)" : "Classes Held So Far"}
                    value={classesHeld}
                    onValueChange={setClassesHeld}
                    min={isFixedTotal ? 1 : 0}
                />

                <CounterInput
                    label="Classes Attended"
                    value={classesAttended}
                    onValueChange={setClassesAttended}
                    max={classesHeld}
                    min={0}
                />

                {isFixedTotal && classesHeld === 0 && (
                    <View className="mx-4 p-4 bg-warning/10 rounded-2xl border border-warning/30 flex-row items-center">
                        <Ionicons name="alert-circle" size={24} color={colors.warning} />
                        <Text className="text-warning font-outfit-medium text-sm ml-3 flex-1">
                            Please set the total number of classes for the semester.
                        </Text>
                    </View>
                )}

                {!isFixedTotal && classesHeld === 0 && (
                    <View className="mx-4 p-4 bg-card rounded-2xl border border-border flex-row items-center">
                        <Ionicons name="information-circle-outline" size={24} color={colors.primary} />
                        <Text className="text-muted font-outfit-regular text-sm ml-3 flex-1">
                            No classes yet? Just tap "Add Subject" to continue!
                        </Text>
                    </View>
                )}
            </ScrollView>

            <View className="px-4 pb-4">
                <Pressable
                    onPress={handleNext}
                    disabled={isFixedTotal && classesHeld === 0}
                    className={`p-4 rounded-xl flex-row items-center justify-center ${isFixedTotal && classesHeld === 0
                        ? 'bg-muted/50'
                        : 'bg-primary active:opacity-90'
                        }`}
                >
                    <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color={isFixedTotal && classesHeld === 0 ? colors.muted : "#fff"}
                    />
                    <Text className={`font-outfit-semibold text-base ml-2 ${isFixedTotal && classesHeld === 0 ? 'text-muted' : 'text-white'
                        }`}>
                        Add Subject
                    </Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
};

export default Page;