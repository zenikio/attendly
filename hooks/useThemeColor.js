import { useColorScheme } from "nativewind";

const colors = {
    light: {
        primary: "#7c3aed",
        background: "#fafafa",
        text: "#111827",
        card: "#ffffff",
        border: "#e5e7eb",
        success: "#16a34a",
        warning: "#ea580c",
        danger: "#dc2626",
        muted: "#6b7280",
    },
    dark: {
        primary: "#a78bfa",
        background: "#030712",
        text: "#f1f5f9",
        card: "#0f172a",
        border: "#1e293b",
        success: "#22c55e",
        warning: "#fb923c",
        danger: "#f87171",
        muted: "#94a3b8",
    },
};

const useThemeColor = () => {
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';
    return {
        ...colors[isDark ? 'dark' : 'light'],
        isDark,
    };
};

export default useThemeColor;
