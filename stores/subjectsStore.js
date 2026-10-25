import { create } from "zustand";
import { getAllSubjects } from "../libs/database";

const useSubjectsStore = create((set) => ({
    subjects: [],
    isLoading: false,
    error: null,

    fetchSubjects: async () => {
        set({ isLoading: true, error: null });
        try {
            const subjects = await getAllSubjects();
            set({ subjects, error: null });
        } catch (error) {
            set({ error: error.message });
            console.error('Error fetching subjects: ', error);
        } finally {
            set({ isLoading: false });
        }
    },

    setSubjects: (subjects) => set({ subjects }),

    setError: (error) => set({ error }),

    clearError: () => set({ error: null }),
}));

export default useSubjectsStore;