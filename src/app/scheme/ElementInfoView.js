// components/ElementInfoView.js
import React, { useEffect, useState } from 'react';
import { fetchElementText } from '@/app/actions/Diagram';

const ElementInfoView = ({ element }) => {
    const [additionalText, setAdditionalText] = useState('');

    useEffect(() => {
        const getElementText = async () => {
            if (element) {
                try {
                    const data = await fetchElementText({
                        svgId: element.svgId,
                        elementId: element.id,
                    });
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

    if (!element) {
        return <p>Select an element to see details</p>;
    }

    return (
        <div>
            <h3>Element ID: {element.id}</h3>
            <p>{additionalText}</p>
        </div>
    );
};

export default ElementInfoView;
