import React, { useState } from "react";
import axios from "axios";
import FileUpload from "./components/FileUpload";
import GenerateModel from "./components/GenerateModel";

function App() {
    const [query, setQuery] = useState("");
    const [response, setResponse] = useState("");
    const [uploadedFiles, setUploadedFiles] = useState([]);

    const hasUploadedFiles = uploadedFiles.length > 0;

    const handleQuery = async () => {
        try {
            const res = await axios.get(
                `https://opulent-tribble-grwpw54rx7pc9vgw-8000.app.github.dev/api/query/`,
                { params: { query } }
            );
            setResponse(res.data.response);
        } catch (error) {
            console.error("Error fetching data:", error);
            setResponse("Error retrieving response: " + error.response.data.error);
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-6 pb-20">
            <div className="flex flex-col items-center">
                <h1 className="font-bold p-8 bg-gradient-to-r from-cyan-500 to-blue-500 inline-block text-transparent bg-clip-text">
                    RAG Model Search
                </h1>
            </div>

            <div className="max-w-3xl mx-auto px-6 space-y-8">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center rounded-full h-8 w-8 border border-[#D1D5DB] text-[#1C1C1E] font-medium">
                        1
                    </div>
                    <h2 className="font-semibold text-[#1C1C1E]">
                        Upload File
                    </h2>
                </div>

                <FileUpload uploadedFiles={uploadedFiles} setUploadedFiles={setUploadedFiles} />
                <div className="flex items-center gap-3 mt-6">
                    <div className="flex items-center justify-center rounded-full h-8 w-8 border border-[#D1D5DB] text-[#1C1C1E] font-medium">
                        2
                    </div>
                    <h2 className="font-semibold text-[#1C1C1E]">
                        Generate Model
                    </h2>
                </div>

                <GenerateModel hasUploadedFiles={hasUploadedFiles} />
                <div className="flex items-center gap-3 mt-6">
                    <div className="flex items-center justify-center rounded-full h-8 w-8 border border-[#D1D5DB] text-[#1C1C1E] font-medium">
                        3
                    </div>
                    <h2 className="font-semibold text-[#1C1C1E]">
                        Conversate
                    </h2>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-lg w-full max-w-2xl mx-auto mt-4">
                    <div className="space-y-2">
                        <p className="text-[#1C1C1E] font-medium text-lg">Once the model is ready, use the box below to ask your questions!</p>
                    </div>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Ask a question..."
                        className="w-full mt-6 p-3 border border-[#D1D5DB] rounded-lg bg-white shadow-sm text-[#1C1C1E] focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF] transition"
                    />

                    <button 
                        onClick={handleQuery} 
                        className="w-auto min-w-[180px] mt-4 px-6 py-2 rounded-lg font-medium shadow-md transition bg-[#007AFF] hover:bg-[#005FC5] text-white"
                    >
                        Search
                    </button>

                    <div className="mt-4">
                        <h3 className="text-[#1C1C1E] font-medium text-lg">Response</h3>
                        <p className="text-[#6B7280] text-sm mt-2">{response || "Waiting for input..."}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
