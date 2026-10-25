import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';

const useThemeStore = create(
    persist(
        (set) => ({
            theme: 'system',

            setTheme: (newTheme) => {
                set({ theme: newTheme });
            },
        }),
        {
            name: 'attendly-theme-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

export default useThemeStore;
