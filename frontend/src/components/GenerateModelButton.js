import React from "react";
import axios from "axios";

export default function GenerateModelButton({hasUploadedFiles, setGenerateButtonClicked}) {

    const generatemodel = async () => {
        try {
            await axios.get(`https://musical-guacamole-xpq4q95pw4526w4g-8000.app.github.dev/api/generate-model/`);
            setGenerateButtonClicked(true);
        } catch (error) {
            console.error("Error fetching data:", error);
            setGenerateButtonClicked(false);
        }
    };
    return(
        <div className="generate-model-btn">
            <button onClick={generatemodel} disabled={!hasUploadedFiles}>Generate Model</button>
        </div>
    );
}