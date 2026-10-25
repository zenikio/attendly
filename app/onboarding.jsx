import React, { useRef, useState } from 'react';
import { View, Text, FlatList, Dimensions, Pressable, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import useOnboardingStore from '../stores/onboardingStore';
import useThemeColor from '../hooks/useThemeColor';

const { width } = Dimensions.get('window');

const slides = [
    {
        id: '1',
        title: 'Welcome to Attendly',
        subtitle: 'Track your attendance effortlessly and never fall behind again.',
        icon: 'checkmark-done',
    },
    {
        id: '2',
        title: 'Swipe to Mark',
        subtitle: 'Simply swipe right for Present and left for Absent. It\'s that easy!',
        icon: 'swap-horizontal',
    },
    {
        id: '3',
        title: 'Stay on Track',
        subtitle: 'Smart predictions tell you exactly how many classes you can safely miss.',
        icon: 'analytics',
    },
    {
        id: '4',
        title: 'You\'re All Set!',
        subtitle: 'Add your first subject to begin your journey to better attendance.',
        icon: 'rocket',
    },
];

const Slide = ({ item }) => {
    const colors = useThemeColor();

    return (
        <View style={{ width, alignItems: 'center', padding: 20 }}>
            <View className="flex-1 justify-center items-center">
                <View
                    className="w-64 h-64 rounded-full justify-center items-center mb-10"
                    style={{ backgroundColor: colors.primary + '20' }}
                >
                    <Ionicons name={item.icon} size={100} color={colors.primary} />
                </View>
                <Text className="text-3xl font-outfit-bold text-center mb-4 text-text">
                    {item.title}
                </Text>
                <Text className="text-lg font-outfit-regular text-center text-muted px-4 leading-6">
                    {item.subtitle}
                </Text>
            </View>
        </View>
    );
};

export default function OnboardingScreen() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;
    const slidesRef = useRef(null);
    const { completeOnboarding } = useOnboardingStore();
    const colors = useThemeColor();

    const viewableItemsChanged = useRef(({ viewableItems }) => {
        if (viewableItems && viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;

    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    const scrollTo = () => {
        if (currentIndex < slides.length - 1) {
            slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
        } else {
            finishOnboarding();
        }
    };

    const finishOnboarding = async () => {
        completeOnboarding();
    };

    return (
        <SafeAreaView className="flex-1 bg-background">
            <View className="flex-1">
                <FlatList
                    data={slides}
                    renderItem={({ item }) => <Slide item={item} />}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    bounces={false}
                    keyExtractor={(item) => item.id}
                    onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
                        useNativeDriver: false,
                    })}
                    scrollEventThrottle={32}
                    onViewableItemsChanged={viewableItemsChanged}
                    viewabilityConfig={viewConfig}
                    ref={slidesRef}
                />
            </View>

            <View className="h-40 justify-between items-center px-5 pb-10">
                <View className="flex-row h-16">
                    {slides.map((_, i) => {
                        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
                        const dotWidth = scrollX.interpolate({
                            inputRange,
                            outputRange: [10, 20, 10],
                            extrapolate: 'clamp',
                        });
                        const opacity = scrollX.interpolate({
                            inputRange,
                            outputRange: [0.3, 1, 0.3],
                            extrapolate: 'clamp',
                        });

                        return (
                            <Animated.View
                                key={i.toString()}
                                style={{
                                    width: dotWidth,
                                    opacity,
                                    backgroundColor: colors.primary,
                                }}
                                className="h-2.5 rounded-full mx-1"
                            />
                        );
                    })}
                </View>

                <View className="w-full flex-row justify-between items-center">
                    {currentIndex < slides.length - 1 ? (
                        <>
                            <Pressable onPress={finishOnboarding} className="p-4">
                                <Text className="text-base font-outfit-medium text-muted">Skip</Text>
                            </Pressable>
                            <Pressable
                                onPress={scrollTo}
                                className="bg-primary px-8 py-4 rounded-2xl"
                            >
                                <Text className="text-white text-base font-outfit-bold">Next</Text>
                            </Pressable>
                        </>
                    ) : (
                        <Pressable
                            onPress={finishOnboarding}
                            className="bg-primary w-full py-4 rounded-2xl items-center"
                        >
                            <Text className="text-white text-lg font-outfit-bold">Get Started</Text>
                        </Pressable>
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
}
