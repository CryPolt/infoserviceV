// src/app/admin/(components)/SidebarMenu/SidebarMenu.js
"use client";

import React from 'react';
import styles from './SidebarMenu.module.css';

const SidebarMenu = ({ onMenuItemClick }) => {
    return (
        <div className={styles.sidebar}>
            <h2 className={styles.title}>Admin Menu</h2>
            <ul className={styles.menu}>
                <li>
                    <button onClick={() => onMenuItemClick('page-manager')}>Page Manager</button>
                </li>
                <li>
                    <button onClick={() => onMenuItemClick('settings')}>Settings</button>
                </li>
                <li>
                    <button onClick={() => onMenuItemClick('user-management')}>User Management</button>
                </li>
                {/* Add more menu items as needed */}
            </ul>
        </div>
    );
};

export default SidebarMenu;
