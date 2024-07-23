"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getSvgById } from '@/app/actions/Diagram';
import ElementInfo from '../ElementInfo';
import Modal from '../(components)/Modal';
import styles from '../scheme.module.css'; 
import ElementInfoView from '../ElementInfoView';

export default function SvgViewer({ params }) {
    const { id } = params; 
    const [svgContent, setSvgContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedElement, setSelectedElement] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        async function fetchSvg() {
            try {
                const response = await getSvgById(id); 
                if (response && response.content) {
                    setSvgContent(response.content);
                } else {
                    console.error('SVG not found or empty response');
                }
            } catch (error) {
                console.error('Failed to fetch SVG:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchSvg();
    }, [id]);

    const handleElementClick = (event) => {
        const element = event.target;
        const elementId = element.id;

        if (elementId) {
            setSelectedElement({
                id: elementId,
                svgId: id,
            });
            setIsModalOpen(true);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    if (loading) {
        return <div className={styles.loading}>Loading SVG...</div>;
    }

    return (
        <div className={styles.svgContainer}>
            <button onClick={() => router.push('/')} className={styles.backButton}>Back to Page</button>
            <div
                className={styles.svgContent}
                onClick={handleElementClick}
                dangerouslySetInnerHTML={{ __html: svgContent }}
            />
            {isModalOpen && (
                <Modal onClose={closeModal}>
                    <ElementInfoView element={selectedElement} />
                </Modal>
            )}
        </div>
    );
}
