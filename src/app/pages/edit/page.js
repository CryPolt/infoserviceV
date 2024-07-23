// components/EditPage.js
"use client";

import React, { useRef, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { createPage, getAllSvgs, updatePageAndSvg } from '@/app/actions/pageActions';
import styles from './EditPage.module.css';
import TinyMCEEditor from '@/app/pages/components/QuillEditor';


const EditPage = () => {
    const titleRef = useRef(null);
    const contentRef = useRef(null);
    const additionalRef = useRef(null);
    const [svgs, setSvgs] = useState([]);
    const [selectedSvg, setSelectedSvg] = useState('');
    const [error, setError] = useState('');
    const [pageId, setPageId] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchSvgs = async () => {
            setLoading(true);
            try {
                const svgList = await getAllSvgs();
                setSvgs(svgList);
            } catch (error) {
                console.error('Error fetching SVGs:', error);
                setError('Failed to load SVGs.');
            } finally {
                setLoading(false);
            }
        };

        fetchSvgs();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!titleRef.current || !contentRef.current || !additionalRef.current) {
            setError('Editor references are not initialized.');
            return;
        }

        const title = titleRef.current.getContent();
        const content = contentRef.current.getContent();
        const additional = additionalRef.current.getContent();

        if (!title.trim() || !content.trim()) {
            setError('Title and content are required.');
            return;
        }

        setLoading(true);
        try {
            if (pageId) {
                await updatePageAndSvg({ pageId, svgId: selectedSvg, content, additional });
                alert('Page and SVG updated successfully!');
            } else {
                const newPageId = await createPage({ title, content, svgId: selectedSvg, additional });
                setPageId(newPageId);
                alert('Page created successfully!');
                titleRef.current.setContent('');
                contentRef.current.setContent('');
                additionalRef.current.setContent('');
                setSelectedSvg('');
            }
        } catch (error) {
            console.error('Error creating or updating page:', error);
            setError('Failed to create or update page.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h1>{pageId ? 'Edit Page' : 'Create Page'}</h1>
            {error && <p className={styles.error}>{error}</p>}
            {loading && <p className={styles.loading}>Loading...</p>}
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="title">Title</label>
                    <TinyMCEEditor
                        id="title"
                        ref={titleRef}
                        initialValue=""
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="content">Content</label>
                    <TinyMCEEditor
                        id="content"
                        ref={contentRef}
                        initialValue=""
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="additional">Additional Info (optional)</label>
                    <TinyMCEEditor
                        id="additional"
                        ref={additionalRef}
                        initialValue=""
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
                    {pageId ? 'Update Page' : 'Create Page'}
                </button>
            </form>
        </div>
    );
};

export default EditPage;