import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';
import { DEFAULT_TARGET } from '../utils/attendance';

const useSettingsStore = create(
    persist(
        (set) => ({
            target: DEFAULT_TARGET,
            showAbsent: false,
            showSubjectAdvice: false,
            setTarget: (target) => set({ target }),
            setShowAbsent: (showAbsent) => set({ showAbsent }),
            setShowSubjectAdvice: (showSubjectAdvice) => set({ showSubjectAdvice }),
        }),
        {
            name: 'attendly-settings-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

export default useSettingsStore;
