import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";

export default function ModelStatus({ generateButtonClicked, setGenerateButtonClicked }) {
    const [response, setResponse] = useState("");
    const [timeEstimate, setTimeEstimate] = useState(null);

    const intervalRef = useRef(null);
    const timeoutRef = useRef(null);

    const checkModelStatus = useCallback(async () => {
        try {
            const res = await axios.get(`https://musical-guacamole-xpq4q95pw4526w4g-8000.app.github.dev/api/check-gen-status/`);
            setResponse(res.data.message);
            setTimeEstimate(res.data.time_estimate);
    
            if (res.data.message === 'ready' || res.data.message === 'error') {
                setGenerateButtonClicked(false);
                clearInterval(intervalRef.current);
            }
    
            return res.data;
        } catch (error) {
            console.error("Error fetching data:", error);
            setGenerateButtonClicked(false);
            clearInterval(intervalRef.current);
            return { message: "error" };
        }
    }, [setGenerateButtonClicked]);
    

    useEffect(() => {
        const initiatePolling = () => {
            intervalRef.current = setInterval(async () => {
                const data = await checkModelStatus();
    
                if (data.message === 'processing' && data.time_estimate > 0) {
                    clearInterval(intervalRef.current);
                    setResponse(data.message);
                    setTimeEstimate(data.time_estimate);
    
                    timeoutRef.current = setTimeout(() => {
                        initiatePolling();
                    }, data.time_estimate * 60 * 1000);
                }
            }, 5000);
        };
    
        if (generateButtonClicked) {
            checkModelStatus();
            initiatePolling();
        }
    
        return () => {
            clearInterval(intervalRef.current);
            clearTimeout(timeoutRef.current);
        };
    }, [generateButtonClicked, setGenerateButtonClicked, checkModelStatus]);
    

    return (
        <div className="model-status">
            <p>Model Status: {response}</p>
            <p>Time Estimate: {timeEstimate}</p>
        </div>
    );
}
