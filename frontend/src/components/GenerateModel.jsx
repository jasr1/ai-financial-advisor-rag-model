import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";

export default function GenerateModel({ hasUploadedFiles }) {
    const [generateButtonClicked, setGenerateButtonClicked] = useState(false);
    const [response, setResponse] = useState("");
    const [timeEstimate, setTimeEstimate] = useState(null);

    const intervalRef = useRef(null);
    const timeoutRef = useRef(null);

    const generatemodel = async () => {
        try {
            await axios.get(`https://opulent-tribble-grwpw54rx7pc9vgw-8000.app.github.dev/api/generate-model/`);
            setGenerateButtonClicked(true);
        } catch (error) {
            console.error("Error generating model:", error);
            setGenerateButtonClicked(false);
        }
    };

    const checkModelStatus = useCallback(async () => {
        try {
            const res = await axios.get(`https://opulent-tribble-grwpw54rx7pc9vgw-8000.app.github.dev/api/check-gen-status/`);
            setResponse(res.data.message);
            setTimeEstimate(res.data.time_estimate);

            if (res.data.message === "ready" || res.data.message === "error") {
                setGenerateButtonClicked(false);
                clearInterval(intervalRef.current);
            }

            return res.data;
        } catch (error) {
            console.error("Error fetching model status:", error);
            setGenerateButtonClicked(false);
            clearInterval(intervalRef.current);
            return { message: "error" };
        }
    }, []);

    useEffect(() => {
        const initiatePolling = () => {
            intervalRef.current = setInterval(async () => {
                const data = await checkModelStatus();

                if (data.message === "processing" && data.time_estimate > 0) {
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
    }, [generateButtonClicked, checkModelStatus]);

    return (
        <div className="bg-white rounded-2xl p-6 shadow-lg w-full max-w-2xl mx-auto mt-6">
            <div className="space-y-2">
                <p className="text-[#1C1C1E] font-medium text-lg">Now, to generate your model, confirm you have uploaded the correct files and then click <span className="font-semibold">"Generate Model"</span>.</p>
                <p className="text-[#6B7280] text-sm">Due to the rate limits imposed by Google, creation of this model can take a <span className="font-semibold">few minutes</span>.</p>
            </div>
            <button 
                onClick={generatemodel} 
                disabled={!hasUploadedFiles}
                className={`w-auto min-w-[180px] px-6 py-2 rounded-lg font-medium shadow-md transition mt-6 ${
                    hasUploadedFiles 
                        ? "bg-[#007AFF] hover:bg-[#005FC5] text-white cursor-pointer" 
                        : "bg-[#D1D5DB] text-[#9CA3AF] cursor-not-allowed"
                }`}
            >
                Generate Model
            </button>

            <div className="mt-6">
                <p className="text-[#1C1C1E] font-medium text-lg">Model Status: {response || "Waiting..."}</p>
                <p className="text-[#6B7280] text-sm">Time Estimate: {timeEstimate + " minutes."|| "0 minutes."}</p>
            </div>
        </div>
    );
}
