import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

const MermaidDiagram = ({ chart }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (containerRef.current) {
            // Инициализация Mermaid
            mermaid.initialize({ startOnLoad: false });

            // Рендеринг диаграммы
            mermaid.render('graphDiv', chart, (svgCode) => {
                if (containerRef.current) {
                    containerRef.current.innerHTML = svgCode;
                }
            });
        }
    }, [chart]);

    return <div ref={containerRef} />;
};

export default MermaidDiagram;
