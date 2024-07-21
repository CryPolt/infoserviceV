'use client'
import Image from 'next/image';
import { useState } from 'react';
import './database.module.css';

const DatabaseScheme = () => {
    const [scale, setScale] = useState(1);

    const zoomIn = () => setScale(prevScale => prevScale + 0.1);
    const zoomOut = () => setScale(prevScale => Math.max(prevScale - 0.1, 0.1));
    const reset = () => setScale(1);

    return (
        <div className="container">
            <div className="controls">
                <button onClick={zoomIn}>+</button>
                <button onClick={zoomOut}>-</button>
                <button onClick={reset}>Reset</button>
            </div>
            <div className="grid-background">
                <div className="image-container">
                    <Image
                        src="/db.svg"
                        alt="Database Schema"
                        layout="fill"
                        objectFit="contain"
                        style={{ transform: `scale(${scale})` }}
                    />
                </div>
            </div>
        </div>
    );
};

export default DatabaseScheme;
