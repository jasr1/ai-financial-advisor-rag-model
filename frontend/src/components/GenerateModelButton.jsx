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
    return (
        <div className="bg-white rounded-2xl p-6 shadow-lg w-full max-w-lg mx-auto">
            <button 
                onClick={generatemodel} 
                disabled={!hasUploadedFiles}
                className={`px-6 py-2 rounded-lg font-medium shadow-md transition ${
                    hasUploadedFiles 
                        ? "bg-[#007AFF] hover:bg-[#005FC5] text-white cursor-pointer" 
                        : "bg-[#D1D5DB] text-[#9CA3AF] cursor-not-allowed"
                }`}
            >
                Generate Model
            </button>
        </div>
    );
}