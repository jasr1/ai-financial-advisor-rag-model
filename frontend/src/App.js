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
        <div style={{ padding: "20px" }}>
            <h1>RAG Model Search</h1>
            <FileUpload uploadedFiles={uploadedFiles} setUploadedFiles={setUploadedFiles}/>
            <GenerateModelButton hasUploadedFiles={hasUploadedFiles} setGenerateButtonClicked={setGenerateButtonClicked}/>
            <ModelStatus generateButtonClicked={generateButtonClicked} setGenerateButtonClicked={setGenerateButtonClicked}/>
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
    );
}

export default App;
