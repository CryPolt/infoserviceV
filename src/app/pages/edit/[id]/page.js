"use client";

import React, { useRef, useState, useEffect } from 'react';
import { updatePageAndSvg, getAllSvgs, getPageById } from '@/app/actions/pageActions';
import styles from '../EditPage.module.css';
import dynamic from 'next/dynamic';

// Динамический импорт QuillEditor
const QuillEditor = dynamic(() => import('@/app/pages/components/QuillEditor'), { ssr: false });

export default function EditPage({ params }) {
    const titleRef = useRef(null);
    const [svgs, setSvgs] = useState([]);
    const [selectedSvg, setSelectedSvg] = useState('');
    const [error, setError] = useState('');
    const [pageId, setPageId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState('');
    const [additionalInfo, setAdditionalInfo] = useState('');

    useEffect(() => {
        const fetchPageData = async () => {
            setLoading(true);
            try {
                const svgList = await getAllSvgs();
                setSvgs(svgList);
                if (params.id) {
                    const pageData = await getPageById(params.id);
                    console.log('Page Data:', pageData);
                    if (pageData) {
                        if (titleRef.current) {
                            titleRef.current.value = pageData.title || '';
                        }
                        setContent(pageData.content || '');
                        setAdditionalInfo(pageData.additional || '');
                        setSelectedSvg(pageData.svg_id || '');
                        setPageId(params.id);
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to load data.');
            } finally {
                setLoading(false);
            }
        };

        fetchPageData();
    }, [params.id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const title = titleRef.current ? titleRef.current.value : '';

        if (!content) {
            setError('Content is required.');
            return;
        }

        setLoading(true);
        try {
            if (pageId) {
                await updatePageAndSvg({ pageId, svgId: selectedSvg, content, additional: additionalInfo });
                alert('Page and SVG updated successfully!');
            } else {
                setError('Page ID is missing.');
            }
        } catch (error) {
            console.error('Error updating page:', error);
            setError('Failed to update page.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <p className={styles.loading}>Loading...</p>;
    }

    return (
        <div className={styles.container}>
            <h1>{pageId ? 'Edit Page' : 'Create Page'}</h1>
            {error && <p className={styles.error}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="title">Title</label>
                    <input id="title" type="text" ref={titleRef} />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="content">Content</label>
                    <QuillEditor
                        value={content}
                        onChange={setContent}
                        placeholder="Write your content here..."
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="additionalInfo">Additional Info</label>
                    <QuillEditor
                        value={additionalInfo}
                        onChange={setAdditionalInfo}
                        placeholder="Add additional information here..."
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="svg">Select SVG (optional)</label>
                    <select id="svg" value={selectedSvg} onChange={(e) => setSelectedSvg(e.target.value)}>
                        <option value="">Select an SVG (optional)</option>
                        {svgs.map((svg) => (
                            <option key={svg.id} value={svg.id}>{svg.id}</option>
                        ))}
                    </select>
                </div>
                <button type="submit" disabled={loading}>
                    Update Page
                </button>
            </form>
        </div>
    );
}
