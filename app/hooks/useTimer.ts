import { redirect, useParams } from "next/navigation";
import { useSession } from "../contexts/SessionContext";

export const useTimer = () => {
    const session = useSession();

    const { sessionId } = useParams<{ sessionId: string }>();

    const getSessionNames = () => {
        const sessionNames: string[] = [];
        session?.sessionNameToId.forEach((value, key) => {
            sessionNames.push(key);
        });
        return sessionNames;
    };

    const getSessionId = (sessionName: string) => {
        const sessionId = session?.sessionNameToId.get(sessionName) || "";
        return sessionId;
    };

    const getSessionName = (sessionId: string) => {
        if (!session) return "";
        const sessionName = session.sessionIdToName.get(sessionId);

        if (!sessionName) {
            const defaultId = session.data[0].sessionId;
            redirect(`/timer/${defaultId}`);
        }
        return sessionName;
    };

    const getCurrentSessionId = () => {
        return sessionId;
    };

    const getSessionTimes = () => {
        if (!session) return [];

        const currentSessionData = session.data.filter(sessionData => {
            return sessionData.sessionId === sessionId;
        });
        if (currentSessionData.length === 0) return [];

        const currentSessionTimes: string[] = [];
        if (currentSessionData) {
            currentSessionData[0].sessionTimes.forEach(time => {
                currentSessionTimes.push(time);
            });
        }
        return currentSessionTimes;
    };

    const getAverageOfFive = () => {
        const currentSessionTimes = getSessionTimes();

        if (currentSessionTimes.length < 5) return "--";

        const lastFiveTimes = [];
        for (let i = 0; i < 5; i++) {
            lastFiveTimes.push(parseFloat(currentSessionTimes[i]));
        }
        lastFiveTimes.sort((a, b) => a - b);
        let sum = 0;
        for (let i = 1; i < 4; i++) {
            sum += lastFiveTimes[i];
        }
        const avg = sum / 3;
        return avg.toFixed(2).toString();
    };

    const getAverageOfTwelve = () => {
        const currentSessionTimes = getSessionTimes();

        if (currentSessionTimes.length < 12) return "--";

        const lastTwelveTimes = [];
        for (let i = 0; i < 12; i++) {
            lastTwelveTimes.push(parseFloat(currentSessionTimes[i]));
        }
        lastTwelveTimes.sort((a, b) => a - b);
        let sum = 0;
        for (let i = 1; i < 11; i++) {
            sum += lastTwelveTimes[i];
        }
        const avg = sum / 10;
        return avg.toFixed(2).toString();
    };

    return {
        getAverageOfFive,
        getAverageOfTwelve,
        getSessionTimes,
        getSessionNames,
        getSessionId,
        getCurrentSessionId,
        getSessionName
    };
};
