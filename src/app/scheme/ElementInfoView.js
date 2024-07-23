import React, { useEffect, useState } from 'react';
import { fetchElementText } from '@/app/actions/Diagram';

const ElementInfoView = ({ element }) => {
    const [additionalText, setAdditionalText] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getElementText = async () => {
            if (element) {
                setLoading(true);
                try {
                    const data = await fetchElementText({
                        svgId: element.svgId,
                        elementId: element.id,
                    });

                    if (data.error) {
                        setError(data.error);
                        console.error('Error fetching element text:', data.error);
                    } else {
                        setAdditionalText(data.additional_text || '');
                        setError(null); // Очистка ошибки при успешном запросе
                    }
                } catch (error) {
                    setError('Error fetching element text');
                    console.error('Error fetching element text:', error);
                } finally {
                    setLoading(false);
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
            {loading && <p>Loading...</p>}
            {error && !loading && <p style={{ color: 'red' }}>Error: {error}</p>}
            {!loading && !error && (
                <p>
                    Additional Text: {additionalText ? additionalText : 'No additional text available'}
                </p>
            )}
        </div>
    );
};

export default ElementInfoView;
