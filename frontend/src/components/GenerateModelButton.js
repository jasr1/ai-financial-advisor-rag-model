import React from "react";
import axios from "axios";

export default function GenerateModelButton({hasUploadedFiles}) {

    const generatemodel = async () => {
        try {
            await axios.get(`https://musical-guacamole-xpq4q95pw4526w4g-8000.app.github.dev/api/generate-model/`);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    return(
        <div className="generate-model-btn">
            <button onClick={generatemodel} disabled={!hasUploadedFiles}>Generate Model</button>
        </div>
    );
}