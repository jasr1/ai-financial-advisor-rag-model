import React, { useState } from "react";
import axios from "axios";

function App() {
    const [query, setQuery] = useState("");
    const [response, setResponse] = useState("");

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
