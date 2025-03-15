import React, { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";

export default function FileUpload({uploadedFiles, setUploadedFiles}) {
    const [file, setFile] = useState(null);
    const [response, setResponse] = useState("");
    const [deletedfileresponse, setDeletedfileresponse] = useState("")

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

    const fetchFiles = useCallback(async () => {
        try {
            const res = await axios.get(`https://musical-guacamole-xpq4q95pw4526w4g-8000.app.github.dev/api/file-list/`);
            setUploadedFiles(res.data.files);
        } catch (error) {
            console.error("Error fetching data:", error);
            setUploadedFiles([])
        }
    }, [setUploadedFiles]);

    useEffect(() => {
        fetchFiles();
    }, [fetchFiles])

    const deleteFile = async (name) => {

        const formData = new FormData();
        formData.append("name", name);

        try {
            const res = await axios.post(
                `https://musical-guacamole-xpq4q95pw4526w4g-8000.app.github.dev/api/delete-file/`, 
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            setDeletedfileresponse(res.data.message);
            fetchFiles();

        } catch (error) {
            console.error("Error deleting file:", error);
            setDeletedfileresponse("Error deleting file: " + (error.response?.data?.error || "Unknown error"));
        }
    }

    useEffect(() => {
        //here im making sure both are empty - if they are then no need to run remainder of function.
        if (!deletedfileresponse && !response) return;
        const timeout = setTimeout(() =>{
            setDeletedfileresponse("");
            setResponse("");
        }, 5000);
        return() => {
            clearTimeout(timeout)
        }
    }, [deletedfileresponse, response])


    return (
        <div className="bg-white rounded-2xl p-6 shadow-lg w-full max-w-2xl mx-auto mt-6">

            <div className="space-y-2">
                <p className="text-[#1C1C1E] font-medium text-lg">
                    Start by clicking on <span className="font-semibold">"Choose File"</span> and selecting a PDF document.
                </p>
                <p className="text-[#6B7280] text-sm">
                    Then click <span className="font-semibold">"Upload"</span> to add it to the list of uploaded files.
                </p>
                <p className="text-[#6B7280] text-sm">
                    You can add as many PDFs as you'd like, but individual sizes should be below <span className="font-semibold">20MB</span>.
                </p>
            </div>
    
            <div className="flex flex-col gap-4 mt-6">
                <div className="flex items-center space-x-4">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={(e) => setFile(e.target.files[0])}
                        className="hidden"
                    />
                    <label 
                        className="cursor-pointer bg-[#007AFF] text-white px-6 py-2 rounded-lg font-medium shadow-md hover:bg-[#005FC5] transition"
                        onClick={() => fileInputRef.current.click()}
                    >
                        Choose File
                    </label>
    
                    {file && (
                        <span className="text-[#1C1C1E] text-sm font-medium truncate max-w-[400px]">
                            {file.name}
                        </span>
                    )}
                </div>
    
                <div className="flex items-center gap-4">
                    <button 
                        className="cursor-pointer bg-[#34C759] hover:bg-[#28A745] text-white px-6 py-2 rounded-lg font-medium shadow-md transition w-auto min-w-[180px] text-center"
                        onClick={handleSubmit}
                    >
                        Upload
                    </button>
                </div>

            </div>
    
            {response && (
                <div className="mt-4 text-[#1C1C1E] bg-[#E5E7EB] rounded-md px-4 py-2 text-sm">
                    {response}
                </div>
            )}
    
            <div className="mt-6">
                <h3 className="text-lg font-semibold text-[#1C1C1E]">Uploaded Files</h3>
                <ul className="mt-2 space-y-2">
                    {uploadedFiles.map((file) => (
                        <li 
                            key={file.file_name} 
                            className="flex justify-between items-center bg-[#F8FAFC] px-4 py-2 rounded-lg shadow-sm border border-[#D1D5DB]"
                        >
                            <span className="text-[#1C1C1E] text-sm font-medium truncate max-w-[480px]">
                                {file.file_name}
                            </span>
                            <button 
                                onClick={() => deleteFile(file.file_name)} 
                                className="cursor-pointer text-[#FF3B30] hover:text-[#D11A2A] transition"
                            >
                                ✕
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
    
            {deletedfileresponse && (
                <div className="mt-4 text-[#1C1C1E] bg-[#E5E7EB] rounded-md px-4 py-2 text-sm">
                    {deletedfileresponse}
                </div>
            )}
        </div>
    );
    
}
