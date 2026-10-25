import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useOnboardingStore = create(
    persist(
        (set) => ({
            hasCompletedOnboarding: false,
            hasHydrated: false,
            completeOnboarding: () => set({ hasCompletedOnboarding: true }),
            resetOnboarding: () => set({ hasCompletedOnboarding: false }),
            setHasHydrated: (state) => set({ hasHydrated: state }),
        }),
        {
            name: 'attendly-onboarding-storage',
            storage: createJSONStorage(() => AsyncStorage),
            onRehydrateStorage: () => (state) => {
                state.setHasHydrated(true);
            },
        }
    )
);

export default useOnboardingStore;
