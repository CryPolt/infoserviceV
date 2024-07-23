import React, { useEffect, useState } from 'react';
import { fetchElementText, updateElementText, synchronizeElementTexts } from '@/app/actions/Diagram';
import styles from './ElementInfo.module.css'; // Импортируем CSS-модуль

const ElementInfo = ({ element }) => {
    const [elementText, setElementText] = useState('');
    const [additionalText, setAdditionalText] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                        if (data.error === 'Text not found or element_id does not match') {
                            // Если текст не найден, синхронизировать элементы
                            const syncResponse = await synchronizeElementTexts(element.svgId);
                            if (syncResponse.success) {
                                // Попробовать снова получить текст элемента после синхронизации
                                const retryData = await fetchElementText({
                                    svgId: element.svgId,
                                    elementId: element.id,
                                });
                                if (retryData.error) {
                                    setError(retryData.error);
                                } else {
                                    setElementText(retryData.text || '');
                                    setAdditionalText(retryData.additional_text || '');
                                    setError(null);
                                }
                            } else {
                                setError(syncResponse.error);
                            }
                        } else {
                            setError(data.error);
                        }
                        console.error('Error fetching element text:', data.error);
                    } else {
                        setElementText(data.text || '');
                        setAdditionalText(data.additional_text || '');
                        setError(null);
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
        return <p className={styles.error}>Select an element to see details</p>;
    }

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>Element ID: {element.id}</h3>
            {loading && <p className={styles.loading}>Loading...</p>}
            {error && !loading && <p className={styles.error}>Error: {error}</p>}
            {!loading && !error && (
                <div>
                    <textarea
                        className={styles.textarea}
                        value={elementText}
                        onChange={handleTextChange}
                        placeholder="Edit element text here"
                    />
                    <textarea
                        className={styles.textarea}
                        value={additionalText}
                        onChange={handleAdditionalTextChange}
                        placeholder="Edit additional text here"
                    />
                </div>
            )}
        </div>
    );
};

export default ElementInfo;
