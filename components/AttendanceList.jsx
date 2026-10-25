import React, { useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import Hero from "./Hero";
import CourseCard from "./CourseCard";
import Empty from "./Empty";
import useSubjectsStore from "../stores/subjectsStore";
import useThemeColor from "../hooks/useThemeColor";

const AttendanceList = () => {
    const subjects = useSubjectsStore(state => state.subjects);
    const isLoading = useSubjectsStore(state => state.isLoading);
    const error = useSubjectsStore(state => state.error);
    const colors = useThemeColor();

    useFocusEffect(
        useCallback(() => {
            useSubjectsStore.getState().fetchSubjects();
        }, [])
    );

    const ListFooter = () => (
        subjects.length > 0 ? (
            <View className="items-center py-6 px-8">
                <Text className="text-sm font-outfit-regular text-muted text-center">
                    Swipe right to mark present • Swipe left to mark absent
                </Text>
            </View>
        ) : null
    );

    if (isLoading && subjects.length === 0) {
        return (
            <View className="flex-1 justify-center items-center bg-background">
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 justify-center items-center p-6 bg-background">
                <Text className="text-danger font-outfit-medium text-base text-center">
                    {error}
                </Text>
            </View>
        );
    }

    return (
        <FlatList
            data={subjects}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <CourseCard subject={item} />
            )}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={Hero}
            ListFooterComponent={ListFooter}
            ListEmptyComponent={Empty}
            contentContainerStyle={{ flexGrow: 1 }}
        />
    );
};

export default AttendanceList;
