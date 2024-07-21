'use client';

import React, { useEffect, useState } from 'react';
import { getAllPages } from '@/app/actions/pageActions';
import styles from './ServicePage.module.css';

export default function ServicePage() {
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const pagesData = await getAllPages();
                const activePages = pagesData.filter(page => page.active === 1);
                setPages(activePages);
            } catch (error) {
                console.error('Failed to fetch pages', error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    function truncateHTML(html, maxLength) {
        const div = document.createElement('div');
        div.innerHTML = html;

        let text = div.textContent || div.innerText || '';
        if (text.length > maxLength) {
            text = text.substring(0, maxLength) + '...';
        }

        div.textContent = text;
        return div.innerHTML;
    }

    if (loading) return <div className={styles.loading}>Loading...</div>;

    return (
        <div className={styles.container}>
            <h1 className={styles.header}>All Service</h1>
            <ul className={styles.pageList}>
                {pages.length > 0 ? (
                    pages.map(page => (
                        <li key={page.id} className={styles.pageItem}>
                            <a href={`/pages/${page.id}`} className={styles.pageLink}>
                                <h2 className={styles.pageTitle}>{page.title}</h2>
                                <p className={styles.pageContent}>{truncateHTML(page.content, 150)}</p>
                            </a>
                        </li>
                    ))
                ) : (
                    <p>No active pages available.</p>
                )}
            </ul>
        </div>
    );
}
