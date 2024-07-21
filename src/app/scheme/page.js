// pages/diagram.js
"use client";
import React, { useEffect, useState } from 'react';
import SvgViewer from './DrawioDiagram'; // Убедитесь, что путь верный
import styles from './scheme.module.css'; // Убедитесь, что путь верный
import { getAllSvgs } from '@/app/actions/Diagram'; // Убедитесь, что путь верный

const DiagramPage = () => {
    const [svgs, setSvgs] = useState([]);
    const [selectedSvgId, setSelectedSvgId] = useState(null);

    useEffect(() => {
        const fetchSvgs = async () => {
            try {
                const response = await getAllSvgs();
                console.log(response)
                setSvgs(response);
            } catch (error) {
                console.error('Failed to fetch SVGs:', error);
            }
        };

        fetchSvgs();
    }, []);

    const handleSvgClick = (id) => {
        setSelectedSvgId(id);
    };

    return (
        <div className={styles.container}>
            <h1>All Diagrams</h1>
            <div className={styles.svgList}>
                {svgs.map(svg => (
                    <div key={svg.id} className={styles.svgItem} onClick={() => handleSvgClick(svg.id)}>
                        <h3>Diagram {svg.id}</h3>
                    </div>
                ))}
            </div>
            {selectedSvgId && <SvgViewer svgId={selectedSvgId} />}
        </div>
    );
};

export default DiagramPage;
