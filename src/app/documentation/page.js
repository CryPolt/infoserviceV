'use client';

import React, { useState, useEffect } from 'react';
import styles from './documentation.module.css';
import { getAllPages, getPageById } from '@/app/actions/pageActions';
import Link from 'next/link';
import DOMPurify from 'dompurify';

const DocumentationPage = () => {
    const [pages, setPages] = useState([]);
    const [activePage, setActivePage] = useState('Overview');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPageId, setSelectedPageId] = useState(null);
    const [additionalInfo, setAdditionalInfo] = useState('');

    const getOverviewDescription = () => `
        <div>
            <p>Это страница обзора, которая предоставляет общий обзор документации.</p>
            <p class="${styles.largeText}">Документация является ключевым фактором успеха любого проекта. Она предоставляет исчерпывающее руководство по системе, помогая разработчикам понять структуру, функциональность и сценарии использования. Хорошая документация:</p>
            <ul class="${styles.largeText}">
                <li>Повышает понимание системы.</li>
                <li>Облегчает адаптацию новых членов команды.</li>
                <li>Улучшает коммуникацию между членами команды.</li>
                <li>Обеспечивает согласованность в методах разработки.</li>
                <li>Служит справочным материалом для устранения неполадок и обслуживания.</li>
            </ul>
            <p class="${styles.largeText}">Вложение времени в создание и поддержание документации может сэкономить время и ресурсы в долгосрочной перспективе, уменьшая недопонимания и ошибки.</p>
            <p class="${styles.largeText}">Хорошо структурированная документация помогает избежать дублирования усилий, так как все члены команды имеют доступ к актуальной информации о проекте. Она также позволяет легко находить и исправлять ошибки, поскольку все изменения и их причины документируются.</p>
            <p class="${styles.largeText}">Документация также играет важную роль в обучении новых сотрудников. Они могут быстро ознакомиться с проектом, изучив документацию, что сокращает время на адаптацию и повышает их продуктивность.</p>
            <p class="${styles.largeText}">Кроме того, наличие подробной документации способствует улучшению качества кода, так как разработчики могут следовать стандартам и лучшим практикам, описанным в ней. Это, в свою очередь, улучшает общее качество проекта и его поддерживаемость.</p>
        </div>
    `;

    useEffect(() => {
        const fetchPages = async () => {
            try {
                const pagesData = await getAllPages();
                setPages(pagesData);
                if (pagesData.length > 0 && !pagesData.some(page => page.id === 'Overview')) {
                    setActivePage(pagesData[0].id);
                }
            } catch (err) {
                console.error('Ошибка при загрузке страниц:', err);
                setError('Не удалось загрузить страницы');
            } finally {
                setLoading(false);
            }
        };
        fetchPages();
    }, []);

    const handlePageClick = async (pageId) => {
        setActivePage(pageId);
        setSelectedPageId(pageId);

        try {
            const page = await getPageById(pageId);
            setAdditionalInfo(page?.additional || 'Нет дополнительной информации');
        } catch (err) {
            console.error('Ошибка при загрузке информации о странице:', err);
            setAdditionalInfo('Не удалось загрузить дополнительную информацию');
        }
    };

    const handleShowAllPages = () => {
        setActivePage('Documentation');
        setSelectedPageId(null);
        setAdditionalInfo('');
    };

    if (loading) {
        return <div>Загрузка...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const getPageSummary = (pageId) => {
        const page = pages.find(p => p.id === pageId);
        return page ? DOMPurify.sanitize(page.summary) : 'Нет доступного описания';
    };

    return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>Документация PAY</div>
                <ul className={styles.navList}>
                    <li className={styles.navItem}>
                        <a
                            className={`${styles.navLink} ${activePage === 'Overview' ? styles.navLinkActive : ''}`}
                            onClick={() => handlePageClick('Overview')}
                        >
                            Обзор
                        </a>
                    </li>
                    <li className={styles.navItem}>
                        <a
                            className={`${styles.navLink} ${activePage === 'Documentation' ? styles.navLinkActive : ''}`}
                            onClick={handleShowAllPages}
                        >
                            Документация
                        </a>
                    </li>
                </ul>
            </aside>
            <main className={styles.content}>
                <div className={styles.contentHeader}>
                    {activePage === 'Documentation'
                        ? 'Обзор документации'
                        : activePage === 'Overview'
                        ? 'Обзор'
                        : pages.find(page => page.id === activePage)?.title}
                </div>
                <div className={styles.contentBody}>
                    {activePage === 'Documentation' ? (
                        <div>
                            <p>Выберите страницу из списка, чтобы просмотреть её описание.</p>
                            <ul className={styles.navList}>
                                {pages.map(page => (
                                    <li key={page.id} className={styles.navItem}>
                                        <a
                                            className={`${styles.navLink} ${selectedPageId === page.id ? styles.navLinkActive : ''}`}
                                            onClick={() => handlePageClick(page.id)}
                                        >
                                            {page.title}
                                        </a>
                                        {selectedPageId === page.id && (
                                            <div className={styles.pageSummary}>
                                                <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(getPageSummary(page.id)) }} />
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : activePage === 'Overview' ? (
                        <div
                            className={styles.pageDescription}
                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(getOverviewDescription()) }}
                        />
                    ) : (
                        <div />
                    )}
                </div>
                {activePage !== 'Documentation' && additionalInfo && (
                    <div className={styles.additionalInfo}>
                        <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(additionalInfo) }} />
                        <div className={styles.links}>
                            <Link href={`/pages/${selectedPageId}`} className={styles.link}>
                                Перейти на Документацию Сервиса
                            </Link>
                            <Link href={`/scheme/${selectedPageId}`} className={styles.link}>
                                Перейти к Схеме Сервиса
                            </Link>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default DocumentationPage;
