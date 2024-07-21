// components/ElementInfo.js
import React, { useEffect, useState } from 'react';
import { fetchElementText, updateElementText } from '@/app/actions/Diagram';

const ElementInfo = ({ element }) => {
    const [elementText, setElementText] = useState('');
    const [additionalText, setAdditionalText] = useState('');

    useEffect(() => {
        const getElementText = async () => {
            if (element) {
                try {
                    const data = await fetchElementText({
                        svgId: element.svgId,
                        elementId: element.id,
                    });
                    console.log(data);
                    if (data.error) {
                        console.error('Error fetching element text:', data.error);
                    } else {
                        setAdditionalText(data.additional_text || '');
                    }
                } catch (error) {
                    console.error('Error fetching element text:', error);
                }
            }
        };

        getElementText();
    }, [element]);

    const handleTextChange = async (event) => {
        const newText = event.target.value;
        setElementText(newText);

        if (element) {
            try {
                const data = await updateElementText({
                    svgId: element.svgId,
                    elementId: element.id,
                    text: newText,
                    additionalText,
                });
                if (data.error) {
                    console.error('Error updating element text:', data.error);
                } else {
                    console.log('Element text updated successfully');
                }
            } catch (error) {
                console.error('Error updating element text:', error);
            }
        }
    };

    const handleAdditionalTextChange = async (event) => {
        const newAdditionalText = event.target.value;
        setAdditionalText(newAdditionalText);

        if (element) {
            try {
                const data = await updateElementText({
                    svgId: element.svgId,
                    elementId: element.id,
                    text: elementText,
                    additionalText: newAdditionalText,
                });
                if (data.error) {
                    console.error('Error updating additional text:', data.error);
                } else {
                    console.log('Additional text updated successfully');
                }
            } catch (error) {
                console.error('Error updating additional text:', error);
            }
        }
    };

    if (!element) {
        return <p>Select an element to see details</p>;
    }

    return (
        <div>
            <h3>Element ID:{element.id}</h3>
            <textarea
                value={additionalText}
                onChange={handleAdditionalTextChange}
                placeholder="Edit additional text here"
            />
        </div>
    );
};

export default ElementInfo;
