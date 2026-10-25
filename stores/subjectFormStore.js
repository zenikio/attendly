import { create } from 'zustand'

const useSubjectFormStore = create((set) => ({
    name: null,
    value: 1,
    classesHeld: 0,
    classesAttended: 0,
    isFixedTotal: false,

    setName: (name) => set({ name: name }),
    setValue: (value) => set({ value: value }),
    setClassesHeld: (value) => set({ classesHeld: value }),
    setClassesAttended: (value) => set({ classesAttended: value }),
    setIsFixedTotal: (value) => set({ isFixedTotal: value }),

    resetForm: () => set({
        name: null,
        value: 1,
        classesHeld: 0,
        classesAttended: 0,
        isFixedTotal: false,
    }),
}))

export default useSubjectFormStore;