'use client';
import React, { useState } from 'react';
import { saveSvg, fetchElementText } from '@/app/actions/Diagram'; // Updated import
import styles from '../scheme.module.css';

const UploadPage = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [elementData, setElementData] = useState([]);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleFileUpload = async () => {
        if (!file) {
            setMessage('Please select a file first.');
            return;
        }

        try {
            const reader = new FileReader();
            reader.onload = async (event) => {
                const svgContent = event.target.result;
                const modifiedSvg = addIdsToSvg(svgContent);

                try {
                    const newId = await saveSvg({ content: modifiedSvg });
                    setMessage(`SVG uploaded and saved with ID: ${newId}`);

                    // Fetch all texts for elements after saving the SVG
                    const texts = await fetchElementText(newId);

                    if (texts.error) {
                        setMessage('Error fetching element texts.');
                    } else {
                        // Format data
                        const data = texts.map(({ element_id, text }) => ({
                            id: element_id,
                            text
                        }));

                        setElementData(data);
                    }
                } catch (error) {
                    console.error('Error saving SVG:', error);
                    setMessage('Failed to save SVG.');
                }
            };

            reader.readAsText(file);
        } catch (error) {
            console.error('Error uploading file:', error);
            setMessage('Failed to upload SVG.');
        }
    };

    const addIdsToSvg = (svgText) => {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
        const elements = svgDoc.querySelectorAll('*');

        elements.forEach((element, index) => {
            if (!element.id) {
                element.id = `element-${index}`;
            }
        });

        const serializer = new XMLSerializer();
        return serializer.serializeToString(svgDoc);
    };

    return (
        <div className={styles.container}>
            <h1>Upload SVG</h1>
            <input type="file" accept=".svg" onChange={handleFileChange} />
            <button className={styles.button} onClick={handleFileUpload}>
                Upload
            </button>
            {message && <p>{message}</p>}
            {elementData.length > 0 && (
                <div>
                    <h2>Element Data:</h2>
                    <table>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Text</th>
                        </tr>
                        </thead>
                        <tbody>
                        {elementData.map(({ id, text }) => (
                            <tr key={id}>
                                <td>{id}</td>
                                <td>{text}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default UploadPage;
