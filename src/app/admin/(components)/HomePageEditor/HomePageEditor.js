'use client';

import React, { useState, useEffect } from 'react';
import { getHomePageData, updateHomePageData, deleteButton, toggleButtonVisibility } from '@/app/actions/Home';
import styles from './HomePageEditor.module.css';

const HomePageEditor = () => {
    const [data, setData] = useState({
        title: '',
        description: '',
        buttons: [{ label: '', color: '#ffffff', url: '', isVisible: true }],
        isActive: true
    });

    const [openSection, setOpenSection] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getHomePageData();
                setData(result);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleButtonChange = (index, field, value) => {
        const updatedButtons = [...data.buttons];
        updatedButtons[index] = { ...updatedButtons[index], [field]: value };
        setData((prevData) => ({
            ...prevData,
            buttons: updatedButtons,
        }));
    };

    const addButton = () => {
        setData((prevData) => ({
            ...prevData,
            buttons: [...prevData.buttons, { label: '', color: '#ffffff', url: '', isVisible: true }]
        }));
    };

    const removeButton = async (index) => {
        const buttonId = data.buttons[index]?.id;
        if (buttonId) {
            try {
                await deleteButton(buttonId);
                setData((prevData) => ({
                    ...prevData,
                    buttons: prevData.buttons.filter((_, i) => i !== index)
                }));
            } catch (error) {
                console.error('Error deleting button:', error);
            }
        }
    };

    const toggleVisibility = async (index) => {
        const buttonId = data.buttons[index]?.id;
        const isVisible = !data.buttons[index].isVisible;
        if (buttonId) {
            try {
                await toggleButtonVisibility(buttonId, isVisible);
                setData((prevData) => {
                    const updatedButtons = [...prevData.buttons];
                    updatedButtons[index] = { ...updatedButtons[index], isVisible };
                    return { ...prevData, buttons: updatedButtons };
                });
            } catch (error) {
                console.error('Error toggling button visibility:', error);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateHomePageData(data);
            alert('Data updated successfully!');
        } catch (error) {
            alert('Error updating data.');
        }
    };

    const toggleSection = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    return (
        <div className={styles.container}>
            <h1>Главная страница</h1>
            <form onSubmit={handleSubmit}>
                <div className={styles.section}>
                    <div className={styles.sectionHeader} onClick={() => toggleSection('general')}>
                        Настройки Главной Страницы
                    </div>
                    <div className={`${styles.sectionContent} ${openSection === 'general' ? styles.show : ''}`}>
                        <div className={styles.formGroup}>
                            <label htmlFor="title" className={styles.label}>Заголовок:</label>
                            <input
                                id="title"
                                name="title"
                                type="text"
                                className={styles.inputText}
                                value={data.title}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="description" className={styles.label}>Основная информация:</label>
                            <textarea
                                id="description"
                                name="description"
                                className={styles.textarea}
                                value={data.description}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="isActive" className={styles.label}>Активные:</label>
                            <input
                                id="isActive"
                                name="isActive"
                                type="checkbox"
                                className={styles.checkbox}
                                checked={data.isActive}
                                onChange={(e) => setData(prevData => ({ ...prevData, isActive: e.target.checked }))}
                            />
                        </div>
                    </div>
                </div>

                <div className={styles.section}>
                    <div className={styles.sectionHeader} onClick={() => toggleSection('buttons')}>
                        Настройки кнопок
                    </div>
                    <div className={`${styles.sectionContent} ${openSection === 'buttons' ? styles.show : ''}`}>
                        {data.buttons.map((button, index) => (
                            <div key={index} className={styles.formGroup}>
                                <label htmlFor={`button-label-${index}`} className={styles.label}>Метка кнопки:</label>
                                <input
                                    id={`button-label-${index}`}
                                    type="text"
                                    className={styles.inputText}
                                    value={button.label}
                                    onChange={(e) => handleButtonChange(index, 'label', e.target.value)}
                                />
                                <label htmlFor={`button-color-${index}`} className={styles.label}>Цвет кнопки:</label>
                                <input
                                    id={`button-color-${index}`}
                                    type="color"
                                    className={styles.inputText}
                                    value={button.color}
                                    onChange={(e) => handleButtonChange(index, 'color', e.target.value)}
                                />
                                <label htmlFor={`button-url-${index}`} className={styles.label}>URL кнопки:</label>
                                <input
                                    id={`button-url-${index}`}
                                    type="text"
                                    className={styles.inputText}
                                    value={button.url}
                                    onChange={(e) => handleButtonChange(index, 'url', e.target.value)}
                                />
                                <label htmlFor={`button-visibility-${index}`} className={styles.label}>Видимость:</label>
                                <input
                                    id={`button-visibility-${index}`}
                                    type="checkbox"
                                    className={styles.checkbox}
                                    checked={button.isVisible}
                                    onChange={() => toggleVisibility(index)}
                                />
                                <button type="button" className={styles.removeButton} onClick={() => removeButton(index)}>Удалить</button>
                            </div>
                        ))}
                        <button type="button" className={styles.addButton} onClick={addButton}>Добавить кнопку</button>

                        <div className={styles.previewContainer}>
                            <h3 className={styles.previewTitle}>Предварительный просмотр кнопок</h3>
                            <div className={styles.main}>
                                <div className={styles.introSection}>
                                    <h2 className={styles.title}>{data.title}</h2>
                                    <p className={styles.description}>{data.description}</p>
                                    <div className={styles.buttons}>
                                        {data.buttons.map((button, index) => (
                                            button.isVisible && (
                                                <a
                                                    key={index}
                                                    href={button.url}
                                                    className={styles.button}
                                                    style={{ backgroundColor: button.color }}
                                                >
                                                    {button.label}
                                                </a>
                                            )
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <button type="submit" className={styles.button}>Сохранить изменения</button>
            </form>
        </div>
    );
};

export default HomePageEditor;
