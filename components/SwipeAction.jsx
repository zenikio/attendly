import { Text } from 'react-native';
import Animated, { Extrapolation, interpolate, useAnimatedStyle } from 'react-native-reanimated';
import Ionicons from '@expo/vector-icons/Ionicons';

const SwipeAction = ({ translation, side, icon, label, backgroundColor }) => {
    const contentStyle = useAnimatedStyle(() => ({
        opacity: interpolate(Math.abs(translation.value), [0, 60, 100], [0, 0.6, 1], Extrapolation.CLAMP),
        transform: [{ scale: interpolate(Math.abs(translation.value), [0, 100], [0.6, 1], Extrapolation.CLAMP) }],
    }));

    const isLeft = side === 'left';

    return (
        <Animated.View
            style={{
                width: 112,
                marginVertical: 6,
                marginLeft: isLeft ? 16 : 0,
                marginRight: isLeft ? 0 : 16,
                borderRadius: 16,
                backgroundColor,
                justifyContent: 'center',
                alignItems: isLeft ? 'flex-start' : 'flex-end',
                paddingHorizontal: 24,
            }}
        >
            <Animated.View style={[{ alignItems: 'center' }, contentStyle]}>
                <Ionicons name={icon} size={28} color="#ffffff" />
                <Text className="text-white text-xs font-outfit-semibold mt-1">{label}</Text>
            </Animated.View>
        </Animated.View>
    );
};

export default SwipeAction;
