'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './main.module.css';
import { getHomePageData } from '@/app/actions/Home';

const Home = () => {
  const router = useRouter();
  const [showHeader, setShowHeader] = useState(false);
  const [data, setData] = useState({
    title: '',
    description: '',
    buttons: []
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = 200;
      if (window.scrollY >= scrollThreshold) {
        setShowHeader(true);
      } else {
        setShowHeader(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getHomePageData();
        if (result.error) {
          console.error(result.error);
        } else {
          setData(result);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleNavigate = (url) => {
    if (url) {
      router.push(url);
    }
  };

  return (
      <>
        <div className={styles.container}>
          <main>
            <section className={styles.introSection}>
              <h1 className={styles.title}>{data.title}</h1>
              <p className={styles.description}>
                {data.description}
              </p>
              <div className={styles.buttons}>
                {data.buttons.map((button, index) => (
                    button.isVisible && (
                        <button
                            key={index}
                            className={styles.button}
                            style={{ backgroundColor: button.color }}
                            onClick={() => handleNavigate(button.url)}
                        >
                          {button.label}
                        </button>
                    )
                ))}
              </div>
            </section>
          </main>
        </div>
      </>
  );
};

export default Home;
