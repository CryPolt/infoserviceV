"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getPageById } from '@/app/actions/pageActions'; 
import styles from './pageid.module.css'; 

export default function PageViewer({ params }) {
    const { id } = params;
    const [loading, setLoading] = useState(true);
    const [pageData, setPageData] = useState({ title: '', content: '', svg_id: '' });
    const router = useRouter();

    useEffect(() => {
        async function fetchData() {
            console.log(`Fetching page data for ID: ${id}`);
            try {
                const data = await getPageById(id); 
                console.log('Page data fetched:', data);
                setPageData(data);
            } catch (error) {
                console.error('Failed to fetch page data', error);
            } finally {
                setLoading(false);
                console.log('Data loading complete.');
            }
        }

        fetchData();
    }, [id]);

    const handleViewSvg = () => {
        if (pageData.svg_id) {
            console.log(`Navigating to SVG viewer for SVG ID: ${pageData.svg_id}`);
            router.push(`/scheme/${pageData.svg_id}`);
        } else {
            console.log('No SVG associated with this page. Showing alert.');
            alert('No SVG associated with this page.');
        }
    };

    if (loading) {
        console.log('Loading data...');
        return <div className={styles.loading}>Loading...</div>;
    }

    console.log('Rendering page viewer');
    return (
        <div className={styles.pageContainer}>
            <h1 className={styles.pageTitle}>{pageData.title}</h1>
            <div className={styles.pageContent} dangerouslySetInnerHTML={{ __html: pageData.content }} />

            {pageData.svg_id && (
                <button onClick={handleViewSvg} className={styles.viewSvgButton}>
                    View SVG
                </button>
            )}
            <button onClick={() => router.push('/')} className={styles.backButton}>Back to Home</button>
        </div>
    );
}
