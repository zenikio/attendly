import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, Pressable, ScrollView, TextInput, Alert, Switch } from "react-native";
import CustomModal from "../components/CustomModal";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams, useRouter } from "expo-router";
import CounterInput from "../components/CounterInput";
import useSubjectsStore from "../stores/subjectsStore";
import { updateSubject, deleteSubject, deleteHistoryEntry, getSubjectHistory } from "../libs/database";
import useThemeColor from "../hooks/useThemeColor";
import { format } from 'date-fns';
import useSettingsStore from '../stores/settingsStore';
import { calculatePercentage, describeHistoryRemoval, getAdvice, getStatus, getStatusColor } from '../utils/attendance';
import AdviceText from '../components/AdviceText';

const STATUS_STYLES = {
    muted: { badge: 'bg-muted/10', text: 'text-muted' },
    success: { badge: 'bg-success/10', text: 'text-success' },
    warning: { badge: 'bg-warning/10', text: 'text-warning' },
    danger: { badge: 'bg-danger/10', text: 'text-danger' },
};

const SubjectDetail = () => {
    const params = useLocalSearchParams();
    const router = useRouter();
    const colors = useThemeColor();
    const target = useSettingsStore(state => state.target);
    const initialSubject = useMemo(() => {
        try {
            return params.subject ? JSON.parse(params.subject) : null;
        } catch {
            return null;
        }
    }, [params.subject]);
    const fetchSubjects = useSubjectsStore(state => state.fetchSubjects);

    const [subject, setSubject] = useState(initialSubject?.name || "");
    const [attendancePerClass, setAttendancePerClass] = useState(initialSubject?.value || 1);
    const [totalClasses, setTotalClasses] = useState(initialSubject?.total || 0);
    const [classesAttended, setClassesAttended] = useState(initialSubject?.attended || 0);
    const [isFixedTotal, setIsFixedTotal] = useState(initialSubject?.is_fixed_total === 1);

    const [history, setHistory] = useState([]);
    const [hasChanges, setHasChanges] = useState(false);
    const [entryToRemove, setEntryToRemove] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showUnsavedModal, setShowUnsavedModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!initialSubject) {
            Alert.alert("Error", "Subject data not found");
            router.back();
            return;
        }
        fetchHistory();
    }, [initialSubject]);

    const fetchHistory = async () => {
        if (initialSubject?.id) {
            try {
                const historyData = await getSubjectHistory(initialSubject.id);
                setHistory(historyData);
            } catch (error) {
                console.error("Failed to fetch history", error);
            }
        }
    };

    useEffect(() => {
        if (!initialSubject) return;
        setSubject(initialSubject.name);
        setAttendancePerClass(initialSubject.value);
        setTotalClasses(initialSubject.total);
        setClassesAttended(initialSubject.attended);
        setIsFixedTotal(initialSubject.is_fixed_total === 1);
    }, [initialSubject]);

    useEffect(() => {
        const hasAnyChanges =
            subject !== initialSubject?.name ||
            attendancePerClass !== initialSubject?.value ||
            totalClasses !== initialSubject?.total ||
            classesAttended !== initialSubject?.attended ||
            isFixedTotal !== (initialSubject?.is_fixed_total === 1);

        setHasChanges(hasAnyChanges);
    }, [subject, attendancePerClass, totalClasses, classesAttended, isFixedTotal, initialSubject]);

    const handleBack = () => {
        if (hasChanges) {
            setShowUnsavedModal(true);
        } else {
            router.back();
        }
    };

    const saveChanges = async () => {
        if (!initialSubject?.id) return;

        if (!subject || subject.trim() === '') {
            Alert.alert("Error", "Subject name cannot be empty");
            return;
        }

        if (isFixedTotal && totalClasses === 0) {
            Alert.alert("Error", "Total classes cannot be 0 in Fixed Total Mode");
            return;
        }

        try {
            setIsLoading(true);
            await updateSubject(initialSubject.id, {
                name: subject,
                value: attendancePerClass,
                total: totalClasses,
                attended: classesAttended,
                is_fixed_total: isFixedTotal
            });

            await fetchSubjects();
            setHasChanges(false);
            setShowUnsavedModal(false);
            router.back();
        } catch (error) {
            console.error("Error saving changes:", error);
            Alert.alert("Error", error.message || "Failed to save changes. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const requestEntryRemoval = (entry) => {
        if (hasChanges) {
            Alert.alert("Unsaved changes", "Save or discard your changes before removing a history entry.");
            return;
        }
        setEntryToRemove(entry);
    };

    const handleRemoveEntry = async () => {
        if (!entryToRemove) return;

        try {
            setIsLoading(true);
            const updated = await deleteHistoryEntry(entryToRemove.id);
            setEntryToRemove(null);
            if (updated) {
                router.setParams({ subject: JSON.stringify(updated) });
            }
            await fetchSubjects();
        } catch (error) {
            console.error("Error removing history entry:", error);
            Alert.alert("Error", "Failed to remove entry. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!initialSubject?.id) return;

        try {
            setIsLoading(true);
            await deleteSubject(initialSubject.id);
            await fetchSubjects();
            setShowDeleteModal(false);
            router.back();
        } catch (error) {
            console.error("Error deleting subject:", error);
            Alert.alert("Error", "Failed to delete subject. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAttendancePerClassChange = (value) => {
        setAttendancePerClass(value);
    };

    const handleTotalClassesChange = (value) => {
        setTotalClasses(value);
        if (value < classesAttended) {
            setClassesAttended(value);
        }
    };

    const handleClassesAttendedChange = (value) => {
        if (value <= totalClasses) {
            setClassesAttended(value);
        }
    };

    const percentage = calculatePercentage(classesAttended, totalClasses);
    const attendancePercentage = percentage.toFixed(2);
    const status = totalClasses === 0 ? 'muted' : getStatus(percentage, target);

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
                    Subject Details
                </Text>
                {hasChanges && (
                    <View className="w-2 h-2 rounded-full bg-warning" />
                )}
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="px-4 pt-6 pb-2">
                    <Text className="text-xs font-outfit-bold text-muted uppercase tracking-wider mb-3 ml-1">
                        Subject Details
                    </Text>
                    <TextInput
                        value={subject}
                        onChangeText={setSubject}
                        className="text-3xl font-outfit-bold text-text bg-transparent p-0 mb-1"
                        placeholder="Enter subject name"
                        placeholderTextColor={colors.muted}
                        cursorColor={colors.primary}
                    />
                    <View className="h-[1px] bg-border w-full" />
                </View>

                <View className="mx-4 mt-4 mb-6 p-6 bg-card rounded-3xl border border-border shadow-sm">
                    <View className="flex-row justify-between items-start">
                        <View>
                            <Text className="text-sm font-outfit-medium text-muted uppercase tracking-wider mb-1">
                                Current Status
                            </Text>
                            <Text className="text-base font-outfit-medium text-text">
                                {classesAttended} / {totalClasses} classes
                            </Text>
                        </View>
                        <View className={`px-3 py-1 rounded-full ${STATUS_STYLES[status].badge}`}>
                            <Text className={`text-sm font-outfit-bold ${STATUS_STYLES[status].text}`}>
                                {totalClasses === 0 ? 'Not Started' : status === 'success' ? 'On Track' : 'At Risk'}
                            </Text>
                        </View>
                    </View>

                    <View className="items-center justify-center py-8">
                        <Text
                            className="text-7xl font-outfit-black"
                            style={{ color: getStatusColor(percentage, target, colors) }}
                        >
                            {attendancePercentage}%
                        </Text>
                        <AdviceText
                            className="mt-2 text-base"
                            advice={getAdvice({ attended: classesAttended, total: totalClasses, isFixed: isFixedTotal, target })}
                        />
                    </View>
                </View>

                <View className="mx-4 mb-4 p-4 bg-card rounded-2xl border border-border flex-row items-center justify-between">
                    <View className="flex-1 mr-4">
                        <Text className="text-base font-outfit-semibold text-text">
                            Fixed Total Mode
                        </Text>
                        <Text className="text-sm font-outfit-regular text-muted mt-1 leading-5">
                            Total classes won't auto-increase when marking attendance.
                        </Text>
                    </View>
                    <Switch
                        trackColor={{ false: colors.border, true: colors.primary }}
                        thumbColor="#ffffff"
                        onValueChange={setIsFixedTotal}
                        value={isFixedTotal}
                    />
                </View>

                <CounterInput
                    label="Attendance per Class"
                    value={attendancePerClass}
                    disabled={true}
                    min={1}
                    onValueChange={handleAttendancePerClassChange}
                />

                <CounterInput
                    label={isFixedTotal ? "Total Semester Classes" : "Classes Held So Far"}
                    value={totalClasses}
                    onValueChange={handleTotalClassesChange}
                    disabled={isLoading}
                />

                <CounterInput
                    label="Classes Attended"
                    value={classesAttended}
                    onValueChange={handleClassesAttendedChange}
                    max={totalClasses}
                    disabled={isLoading}
                />

                <View className="mx-4 mt-6 mb-4">
                    <Text className="text-sm font-outfit-medium text-muted uppercase tracking-wider mb-3">
                        Recent History
                    </Text>
                    <Text className="text-muted font-outfit-regular text-sm -mt-1 mb-3">
                        Removing an entry also reverses it in your attendance counts.
                    </Text>
                    {history.length > 0 ? (
                        <View className="bg-card rounded-2xl border border-border overflow-hidden">
                            {history.map((item, index) => (
                                <View
                                    key={item.id}
                                    className={`p-4 flex-row items-center justify-between ${index !== history.length - 1 ? 'border-b border-border' : ''
                                        }`}
                                >
                                    <View className="flex-row items-center">
                                        <View className={`w-2 h-2 rounded-full mr-3 ${item.is_present ? 'bg-success' : 'bg-danger'
                                            }`} />
                                        <Text className="text-text font-outfit-medium text-base">
                                            {item.is_present ? 'Present' : 'Absent'}
                                        </Text>
                                    </View>
                                    <View className="flex-row items-center">
                                        <Text className="text-muted font-outfit-regular text-sm">
                                            {format(new Date(item.date), 'MMM d, yyyy • h:mm a')}
                                        </Text>
                                        <Pressable
                                            onPress={() => requestEntryRemoval(item)}
                                            hitSlop={8}
                                            className="ml-3 p-1 rounded-full active:bg-danger/10"
                                        >
                                            <Ionicons name="close-circle-outline" size={20} color={colors.muted} />
                                        </Pressable>
                                    </View>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <View className="bg-card p-6 rounded-2xl border border-border items-center">
                            <Ionicons name="time-outline" size={32} color={colors.primary} />
                            <Text className="text-muted font-outfit-regular text-center mt-2">
                                No attendance history yet
                            </Text>
                        </View>
                    )}
                </View>

                <View className="h-24" />
            </ScrollView>

            <View className="absolute bottom-0 left-0 right-0 bg-card border-t border-border p-4">
                {hasChanges ? (
                    <View className="flex-row gap-3">
                        <Pressable
                            onPress={saveChanges}
                            disabled={isLoading}
                            className="flex-1 bg-primary p-4 rounded-xl active:opacity-90"
                            style={{ opacity: isLoading ? 0.7 : 1 }}
                        >
                            <Text className="text-white text-base text-center font-outfit-semibold">
                                {isLoading ? "Saving..." : "Save Changes"}
                            </Text>
                        </Pressable>
                        <Pressable
                            onPress={() => setShowDeleteModal(true)}
                            disabled={isLoading}
                            className="w-14 items-center justify-center rounded-xl border border-danger/30 bg-danger/10 active:bg-danger/20"
                        >
                            <Ionicons name="trash-outline" size={22} color={colors.danger} />
                        </Pressable>
                    </View>
                ) : (
                    <Pressable
                        className="flex-row justify-center items-center p-4 rounded-xl bg-danger/10 active:bg-danger/20"
                        onPress={() => setShowDeleteModal(true)}
                        disabled={isLoading}
                    >
                        <Ionicons name="trash-outline" size={20} color={colors.danger} />
                        <Text className="ml-2 font-outfit-medium" style={{ color: colors.danger }}>
                            Delete Subject
                        </Text>
                    </Pressable>
                )}
            </View>
            <CustomModal
                visible={showUnsavedModal}
                onClose={() => setShowUnsavedModal(false)}
            >
                <View className="bg-card p-6 rounded-2xl w-[85%] max-w-sm border border-border">
                    <View className="w-12 h-12 rounded-full bg-warning/20 items-center justify-center mb-4">
                        <Ionicons name="warning" size={24} color={colors.warning} />
                    </View>
                    <Text className="text-xl font-outfit-semibold mb-2 text-text">
                        Unsaved Changes
                    </Text>
                    <Text className="text-base font-outfit-regular mb-6 text-muted leading-6">
                        You have unsaved changes. Would you like to save them before leaving?
                    </Text>
                    <View className="flex-row gap-3">
                        <Pressable
                            onPress={() => {
                                setShowUnsavedModal(false);
                                router.back();
                            }}
                            className="flex-1 p-3 rounded-xl border border-border active:bg-border/50"
                        >
                            <Text className="text-text font-outfit-medium text-center">Discard</Text>
                        </Pressable>
                        <Pressable
                            onPress={saveChanges}
                            disabled={isLoading}
                            className="flex-1 bg-primary p-3 rounded-xl active:opacity-90"
                        >
                            <Text className="text-white font-outfit-semibold text-center">
                                {isLoading ? "Saving..." : "Save"}
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </CustomModal>

            <CustomModal
                visible={entryToRemove !== null}
                onClose={() => setEntryToRemove(null)}
            >
                <View className="bg-card p-6 rounded-2xl w-[85%] max-w-sm border border-border">
                    <View className="w-12 h-12 rounded-full bg-danger/20 items-center justify-center mb-4">
                        <Ionicons name="time" size={24} color={colors.danger} />
                    </View>
                    <Text className="text-xl font-outfit-semibold mb-2 text-text">
                        Remove History Entry
                    </Text>
                    <Text className="text-base font-outfit-regular mb-2 text-muted leading-6">
                        Remove this {entryToRemove?.is_present ? 'Present' : 'Absent'} entry
                        {entryToRemove ? ` from ${format(new Date(entryToRemove.date), 'MMM d, h:mm a')}` : ''}?
                    </Text>
                    <Text className="text-base font-outfit-medium mb-6 text-text leading-6">
                        {entryToRemove ? describeHistoryRemoval(entryToRemove.is_present === 1, isFixedTotal) : ''}
                    </Text>
                    <View className="flex-row gap-3">
                        <Pressable
                            onPress={() => setEntryToRemove(null)}
                            className="flex-1 p-3 rounded-xl border border-border active:bg-border/50"
                        >
                            <Text className="text-text font-outfit-medium text-center">Cancel</Text>
                        </Pressable>
                        <Pressable
                            onPress={handleRemoveEntry}
                            className="flex-1 p-3 rounded-xl active:opacity-90"
                            style={{ backgroundColor: colors.danger }}
                            disabled={isLoading}
                        >
                            <Text className="text-white font-outfit-semibold text-center">
                                {isLoading ? "Removing..." : "Remove"}
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </CustomModal>

            <CustomModal
                visible={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
            >
                <View className="bg-card p-6 rounded-2xl w-[85%] max-w-sm border border-border">
                    <View className="w-12 h-12 rounded-full bg-danger/20 items-center justify-center mb-4">
                        <Ionicons name="trash" size={24} color={colors.danger} />
                    </View>
                    <Text className="text-xl font-outfit-semibold mb-2 text-text">
                        Delete Subject
                    </Text>
                    <Text className="text-base font-outfit-regular mb-6 text-muted leading-6">
                        Are you sure you want to delete "{subject}"? This action cannot be undone.
                    </Text>
                    <View className="flex-row gap-3">
                        <Pressable
                            onPress={() => setShowDeleteModal(false)}
                            className="flex-1 p-3 rounded-xl border border-border active:bg-border/50"
                        >
                            <Text className="text-text font-outfit-medium text-center">Cancel</Text>
                        </Pressable>
                        <Pressable
                            onPress={handleDelete}
                            className="flex-1 p-3 rounded-xl active:opacity-90"
                            style={{ backgroundColor: colors.danger }}
                            disabled={isLoading}
                        >
                            <Text className="text-white font-outfit-semibold text-center">
                                {isLoading ? "Deleting..." : "Delete"}
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </CustomModal>
        </SafeAreaView>
    );
};

export default SubjectDetail;