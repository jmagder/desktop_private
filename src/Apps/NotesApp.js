import React, {useState} from "react";

const NotesApp = ({name, timestamp}) => {
    const APP_PERSIST_KEY = `${name}-${timestamp}`;
    const deserializedState = localStorage.getItem(APP_PERSIST_KEY);
    const [textContent, setTextContent] = useState(deserializedState || "");

    const handleChange = (event) => {
        const text = event.target.value;
        localStorage.setItem(APP_PERSIST_KEY, text);
        setTextContent(text);
    }
    return (
        <textarea placeholder="Enter some notes..." value={textContent} onChange={handleChange}/>
    )
}

export default NotesApp;