import { Text } from 'react-native';

const plural = (n) => `${n} ${n === 1 ? 'class' : 'classes'}`;

const AdviceText = ({ advice, className = '' }) => {
    if (!advice) return null;

    if (advice.type === 'skip') {
        return (
            <Text className={`font-outfit-medium text-success ${className}`}>
                Can miss {plural(advice.count)}
            </Text>
        );
    }
    if (advice.type === 'attend') {
        return (
            <Text className={`font-outfit-medium text-warning ${className}`}>
                Attend {plural(advice.count)} more
            </Text>
        );
    }
    return (
        <Text className={`font-outfit-medium text-muted ${className}`}>
            On track
        </Text>
    );
};

export default AdviceText;
