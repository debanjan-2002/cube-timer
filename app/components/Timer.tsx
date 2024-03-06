"use client";

import React, { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useSession } from "../contexts/SessionContext";
import { useTimer } from "../hooks/useTimer";
import { useParams } from "next/navigation";

const Timer = () => {
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const [miliseconds, setMiliseconds] = useState(0);

    const session = useSession();
    const { sessionId } = useParams<{ sessionId: string }>();
    const { getAverageOfFive, getAverageOfTwelve } = useTimer();

    // TODO: Have to figure out the type
    const milisecondsRef = useRef<any>(null);

    if (miliseconds === 1000) {
        setMiliseconds(0);
        setSeconds(prev => prev + 1);
    }

    const keyDownHandler = (e: KeyboardEvent) => {
        if (e.repeat) return;
        if (e.code !== "Space") return;
        if (isTimerRunning) {
            clearInterval(milisecondsRef.current);
            setIsTimerRunning(false);

            const time = `${seconds}.${miliseconds.toString().slice(0, 2)}`;
            session?.addTimeToCurrentSession(sessionId, time);
        } else {
            setSeconds(0);
            setMiliseconds(0);
            setIsTimerRunning(true);

            milisecondsRef.current = setInterval(() => {
                setMiliseconds(prev => prev + 10);
            }, 10);
        }
    };
    useEffect(() => {
        window.addEventListener("keydown", keyDownHandler);

        return () => {
            window.removeEventListener("keydown", keyDownHandler);
        };
    });

    return (
        <div className="p-4 flex-1 flex justify-center items-center bg-late-100 flex-col gap-5">
            <div className="text-[12rem]">
                {seconds}.{miliseconds.toString().slice(0, 2)}
            </div>
            <div className="flex flex-col gap-3">
                <Badge
                    className="text-4xl min-w-28 flex justify-center p-2 px-4"
                    variant={"secondary"}
                >
                    ao5: {getAverageOfFive()}
                </Badge>
                <Badge
                    className="text-4xl min-w-28 flex justify-center p-2 px-4"
                    variant={"secondary"}
                >
                    ao12: {getAverageOfTwelve()}
                </Badge>
            </div>
        </div>
    );
};

export default Timer;
