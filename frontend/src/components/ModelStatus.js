import React, {useState, useEffect} from "react";
import axios from "axios";

export default function ModelStatus({generateButtonClicked, setGenerateButtonClicked}) {

    const [response, setResponse] = useState("");
    const [timeEstimate, setTimeEstimate] = useState(null);

    const checkModelStatus = async () => {
        try {
            const res = await axios.get(`https://musical-guacamole-xpq4q95pw4526w4g-8000.app.github.dev/api/check-gen-status/`);
            setResponse(res.data.message);
            setTimeEstimate(res.data.time_estimate);

            if (res.data.message === 'ready' || res.data.message === 'error') {
                setGenerateButtonClicked(false)
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setGenerateButtonClicked(false)
        }
    };

    useEffect(() => {
        let interval = null;

        if (generateButtonClicked) {
            checkModelStatus();
            interval = setInterval(checkModelStatus, 5000)
        }

        return () => {
            if (interval) clearInterval(interval);
        };


        }, [generateButtonClicked, response, setGenerateButtonClicked])

    return (
        <div className="model-status">
            <p>Model Status: {response}</p>
            <p>Time Estimate: {timeEstimate}</p>
        </div>
    );
}