import React, { useState, useEffect } from 'react';
import { getAllSvgs, fetchSVGElements, updateElementAdditionalText, getSVGElementsCount } from '@/app/actions/Diagram';
import styles from './SchemeContentEditor.module.css';

export const SchemeContentEditor = () => {
    const [svgs, setSvgs] = useState([]);
    const [selectedSvgId, setSelectedSvgId] = useState(null);
    const [elements, setElements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchAllSvgs = async () => {
            setLoading(true);
            try {
                const svgsResponse = await getAllSvgs();
                setSvgs(svgsResponse);
                setError(null);
            } catch (error) {
                setError('Error fetching SVGs');
                console.error('Error fetching SVGs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllSvgs();
    }, []);

    useEffect(() => {
        if (selectedSvgId) {
            const fetchElements = async () => {
                setLoading(true);
                try {
                    const elementsResponse = await fetchSVGElements({ svgId: selectedSvgId, page: currentPage });
                    setElements(elementsResponse);

                    const count = await getSVGElementsCount(selectedSvgId);
                    setTotalPages(Math.ceil(count / 10));

                    setError(null);
                } catch (error) {
                    setError('Error fetching SVG elements');
                    console.error('Error fetching SVG elements:', error);
                } finally {
                    setLoading(false);
                }
            };

            fetchElements();
        }
    }, [selectedSvgId, currentPage]);

    const handleTextChange = async (id, newText) => {
        try {
            await updateElementAdditionalText(id, newText); // Обновите значение additional_text
            setElements(prevElements => prevElements.map(el =>
                el.id === id ? { ...el, additional_text: newText } : el
            ));
            console.log('Additional text updated successfully');
        } catch (error) {
            console.error('Error updating additional text:', error);
            setError('Error updating additional text');
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p>Ошибка: {error}</p>;

    return (
        <div className={styles.container}>
            <h1>Редактирование SVG Элементов Текстов</h1>
            <div className={styles.svgSelector}>
                <h2>Выберите SVG</h2>
                <select
                    onChange={(e) => setSelectedSvgId(e.target.value)}
                    value={selectedSvgId || ''}
                >
                    <option value="">Выберите SVG</option>
                    {svgs.map(svg => (
                        <option key={svg.id} value={svg.id}>
                            {svg.title || `SVG ${svg.id}`}
                        </option>
                    ))}
                </select>
            </div>
            {selectedSvgId && (
                <>
                    <table className={styles.elementsTable}>
                        <thead>
                        <tr>
                            <th>Element ID</th>
                            <th>Дополнительный Текст</th>
                        </tr>
                        </thead>
                        <tbody>
                        {elements.map(element => (
                            <tr key={element.id}>
                                <td>{element.id}</td>
                                <td>
                                    <textarea
                                        value={element.additional_text || ''}
                                        onChange={(e) => handleTextChange(element.id, e.target.value)}
                                        className={styles.textarea}
                                        placeholder="Редактируйте дополнительный текст тут"
                                    />
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <div className={styles.pagination}>
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Предыдущая
                        </button>
                        <span>Страница {currentPage} из {totalPages}</span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Следующая
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};
