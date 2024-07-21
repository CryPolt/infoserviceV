"use client"

import React, { useEffect,useState } from 'react';
import { useRouter } from 'next/navigation'; 
import styles from './main.module.css';

const Home = () => {
  const router = useRouter();
  const [showHeader, setShowHeader] = useState(false);

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

  const handleNavigate = (route) => {
    router.push(route);
  };

  return (
      <>
        <div className={styles.container}>
          <main>
            <section className={styles.introSection}>
              <h1>Welcome to PAY Team Site</h1>
              <p>
                Here you'll find comprehensive documentation for all our services,
                APIs, and development practices. Whether you're a new team member
                or a seasoned developer, this site will help you navigate through
                our projects and services effectively.
              </p>
              <div className={styles.buttons}>
                <button className={styles.button} onClick={() => handleNavigate('/service')}>
                  Services
                </button>
                <button className={styles.button} onClick={() => handleNavigate('/documentation')}>
                  Documentation
                </button>
                <button className={styles.button} onClick={() => handleNavigate('/team')}>
                  Team
                </button>
              </div>
            </section>
          </main>
        </div>
      </>
  );
};

export default Home;