import React, { useState } from "react";
import axios from "axios";
import FileUpload from "./components/FileUpload";
import GenerateModelButton from "./components/GenerateModelButton";
import ModelStatus from "./components/ModelStatus";

function App() {
    const [query, setQuery] = useState("");
    const [response, setResponse] = useState("");

    const [uploadedFiles, setUploadedFiles] = useState([])

    const hasUploadedFiles = uploadedFiles.length > 0;

    const [generateButtonClicked, setGenerateButtonClicked] = useState(false)

    const handleQuery = async () => {
        try {
            const res = await axios.get(`https://musical-guacamole-xpq4q95pw4526w4g-8000.app.github.dev/api/query/`, {
                params: { query },
            });
            setResponse(res.data.response);
        } catch (error) {
            console.error("Error fetching data:", error);
            setResponse("Error retrieving response: " + error.response.data.error);
        }
    };

    return (
        <div>
            <div className="flex flex-col items-center">
                <h1 className="font-bold p-8 bg-gradient-to-r from-cyan-500 to-blue-500 inline-block text-transparent bg-clip-text">RAG Model Search</h1>
            </div>


            <div className="flex flex-col items-start m-8">

                <div className="title flex items-center gap-3">
                    <div className="flex items-center justify-center rounded-full h-10 w-10 bg-green-600 text-neutral-50">1</div>
                    <h2 className="font-bold bg-gradient-to-r from-[#0099FF] to-[#0066FF] inline-block text-transparent bg-clip-text">Upload File</h2>
                </div>
                <FileUpload uploadedFiles={uploadedFiles} setUploadedFiles={setUploadedFiles}/>

                <div className="title flex items-center gap-3 mt-6">
                    <div className="flex items-center justify-center rounded-full h-10 w-10 bg-green-600 text-neutral-50">2</div>
                    <h2 className="font-bold text-sky-500">Generate Model</h2>
                </div>
                <GenerateModelButton hasUploadedFiles={hasUploadedFiles} setGenerateButtonClicked={setGenerateButtonClicked}/>
                <ModelStatus generateButtonClicked={generateButtonClicked} setGenerateButtonClicked={setGenerateButtonClicked}/>
                
                <div className="title flex items-center gap-3 mt-6">
                    <div className="flex items-center justify-center rounded-full h-10 w-10 bg-green-600 text-neutral-50">3</div>
                    <h2 className="font-bold bg-gradient-to-r from-[#0099FF] to-[#0066FF] inline-block text-transparent bg-clip-text">Conversate</h2>
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask a question..."
                />
                <button onClick={handleQuery}>Search</button>

                <h3>Response</h3>
                <p>{response}</p>
            </div>
            
        </div>
    );
}

export default App;
