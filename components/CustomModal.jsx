import React, { useEffect, useState, useRef } from 'react';
import { View, Modal, Animated, StyleSheet, Pressable } from 'react-native';

const CustomModal = ({ visible, onClose, children }) => {
    const [showModal, setShowModal] = useState(visible);
    const opacity = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(0.95)).current;

    useEffect(() => {
        if (visible) {
            setShowModal(true);
            Animated.parallel([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 90,
                    useNativeDriver: true,
                }),
                Animated.timing(scale, {
                    toValue: 1,
                    duration: 90,
                    useNativeDriver: true,
                })
            ]).start();
        } else {
            Animated.timing(opacity, {
                toValue: 0,
                duration: 60,
                useNativeDriver: true,
            }).start(() => setShowModal(false));
        }
    }, [visible]);

    if (!showModal) return null;

    return (
        <Modal
            transparent
            visible={showModal}
            onRequestClose={onClose}
            animationType="none"
        >
            <View style={styles.overlay}>
                <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
                    <Animated.View style={[styles.backdrop, { opacity }]} />
                </Pressable>
                <Animated.View
                    style={[
                        { opacity, transform: [{ scale }] },
                        styles.contentContainer
                    ]}
                >
                    {children}
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    contentContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'box-none',
    }
});

export default CustomModal;
