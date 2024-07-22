"use client";

import React, {useEffect, useState} from 'react';
import {getAllPagesTable, updatePageStatus} from '@/app/actions/pageActions';
import styles from './AdminSettingManager.module.css';

// Function to truncate content
const truncateContent = (content, maxLength = 100) => {
    if (!content) return '';
    return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
};

export default function AdminPageManager() {
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPages = async () => {
            setLoading(true);
            try {
                const allPages = await getAllPagesTable();
                setPages(allPages);
            } catch (error) {
                console.error('Error fetching pages:', error);
                setError('Failed to load pages.');
            } finally {
                setLoading(false);
            }
        };

        fetchPages();
    }, []);

    const handleStatusChange = async (pageId, isActive) => {
        setLoading(true);
        try {
            await updatePageStatus({ pageId, active: isActive ? 1 : 0 });
            setPages((prevPages) =>
                prevPages.map((page) =>
                    page.id === pageId ? { ...page, active: isActive ? 1 : 0 } : page
                )
            );
        } catch (error) {
            console.error('Error updating page status:', error);
            setError('Failed to update page status.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h1>Admin Page Manager</h1>
            {error && <p className={styles.error}>{error}</p>}
            {loading && <p className={styles.loading}>Loading...</p>}
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Content</th>
                        <th>SVG ID</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {pages.map((page) => (
                        <tr key={page.id}>
                            <td>{page.id}</td>
                            <td>{page.title}</td>
                            <td>{truncateContent(page.content, 100)}</td>
                            <td>{page.svg_id || 'null'}</td>
                            <td>
                                <label className={styles.switch}>
                                    <input
                                        type="checkbox"
                                        checked={page.active === 1}
                                        onChange={(e) =>
                                            handleStatusChange(page.id, e.target.checked)
                                        }
                                    />
                                    <span className={styles.slider}></span>
                                </label>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
