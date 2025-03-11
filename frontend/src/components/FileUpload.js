import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function FileUpload() {
    const [file, setFile] = useState(null);
    const [response, setResponse] = useState("");
    const [uploadedfiles, setUploadedfiles] = useState([])

    //technically I could use a dom selector method and directly target the input and make its value ""
    //but it is best practice to create a reference to the input itself and modify that instead.
    const fileInputRef = useRef(null);

    const handleSubmit = async () => {
        if (!file) {
            setResponse("Please select a file first.");
            return;
        }

        //in order to send the file i have to append it as a FormData object.
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await axios.post(
                `https://musical-guacamole-xpq4q95pw4526w4g-8000.app.github.dev/api/file-upload/`, 
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            setResponse(res.data.message);
            setFile(null);
            if (fileInputRef.current){
                fileInputRef.current.value = "";
            }

            fetchFiles();

        } catch (error) {
            console.error("Error uploading file:", error);
            setResponse("Error uploading file: " + (error.response?.data?.error || "Unknown error"));
        }
    };

    const fetchFiles = async () => {
        try {
            const res = await axios.get(`https://musical-guacamole-xpq4q95pw4526w4g-8000.app.github.dev/api/file-list/`);
            setUploadedfiles(res.data.files);
        } catch (error) {
            console.error("Error fetching data:", error);
            setUploadedfiles([])
        }
    };

    useEffect(() => {
        fetchFiles();
    }, [])

    return (
        <div className="upload-box">
            <h2>Upload File</h2>
            <div className="upload-buttons">
                <input 
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => setFile(e.target.files[0])}
                />
                <button onClick={handleSubmit}>Upload</button>
            </div>
            <div className="upload-messages">
                <p>{response}</p>
            </div>
            <div className="uploaded-files">
                <h3>Uploaded Files</h3>
                <ul>
                    {uploadedfiles.map((file) => (
                        <li key={file.file_name}>{file.file_name} (Uploaded: {file.upload_time})</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
