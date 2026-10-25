import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AttendanceList from "../components/AttendanceList";
import Footer from "../components/Footer";

const Page = () => {
    return (
        <SafeAreaView className="bg-background h-full">
            <AttendanceList />
            <Footer />
        </SafeAreaView>
    )
}

export default Page;
