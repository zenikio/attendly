import { Pressable, Text, View } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import useThemeColor from "../hooks/useThemeColor";

const CounterInput = ({ label, value, onValueChange, max = Infinity, min = 0, disabled = false }) => {
    const colors = useThemeColor();

    const handleDecrease = () => {
        if (!disabled && value > min) {
            onValueChange(value - 1);
        }
    };

    const handleIncrease = () => {
        if (!disabled && value < max) {
            onValueChange(value + 1);
        }
    };

    const isAtMin = value <= min;
    const isAtMax = value >= max;

    return (
        <View className="mx-4 mb-5">
            <Text className="text-muted font-outfit-medium text-sm mb-3 uppercase tracking-wider">
                {label}
            </Text>
            <View className="flex-row items-center justify-between bg-card rounded-2xl p-4 border border-border">
                <Pressable
                    onPress={handleDecrease}
                    disabled={disabled || isAtMin}
                    className={`w-14 h-14 items-center justify-center rounded-xl ${disabled || isAtMin ? 'opacity-30' : 'bg-primary/10 active:bg-primary/20'
                        }`}
                >
                    <Ionicons
                        name="remove"
                        size={28}
                        color={disabled || isAtMin ? colors.muted : colors.primary}
                    />
                </Pressable>

                <View className="flex-1 items-center">
                    <Text className={`text-6xl font-outfit-extrabold ${disabled ? 'text-muted' : 'text-primary'}`}>
                        {value}
                    </Text>
                </View>

                <Pressable
                    onPress={handleIncrease}
                    disabled={disabled || isAtMax}
                    className={`w-14 h-14 items-center justify-center rounded-xl ${disabled || isAtMax ? 'opacity-30' : 'bg-primary/10 active:bg-primary/20'
                        }`}
                >
                    <Ionicons
                        name="add"
                        size={28}
                        color={disabled || isAtMax ? colors.muted : colors.primary}
                    />
                </Pressable>
            </View>
        </View>
    );
};

export default CounterInput;