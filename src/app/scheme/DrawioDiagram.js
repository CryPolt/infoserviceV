import React, { useEffect, useState } from 'react';
import { getSvgById } from '@/app/actions/Diagram';
import ElementInfo from './ElementInfo';
import Modal from './Modal';
import styles from './scheme.module.css';

const DrawioDiagram = ({ svgId }) => {
    const [svgContent, setSvgContent] = useState('');
    const [selectedElement, setSelectedElement] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchSvgContent = async () => {
            try {
                if (svgId) {
                    const response = await getSvgById(svgId);
                    if (response && response.content) {
                        setSvgContent(response.content);
                    } else {
                        console.error('SVG not found or empty response');
                    }
                }
            } catch (error) {
                console.error('Failed to fetch SVG:', error);
            }
        };

        fetchSvgContent();
    }, [svgId]);

    const handleElementClick = async (event) => {
        const element = event.target;
        const elementId = element.id;

        if (elementId) {
            setSelectedElement({
                id: elementId,
                svgId: svgId,
            });

            setIsModalOpen(true);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div>
            <div
                className={styles.svgContainer}
                onClick={handleElementClick}
                dangerouslySetInnerHTML={{ __html: svgContent }}
            />
            {isModalOpen && (
                <Modal onClose={closeModal}>
                    <ElementInfo element={selectedElement} />
                </Modal>
            )}
        </div>
    );
};

export default DrawioDiagram;
