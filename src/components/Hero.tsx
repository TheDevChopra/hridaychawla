"use client";

import { motion } from "framer-motion";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.heroSection}>
      {/* Background Elements */}
      <div className={styles.particleContainer}>
        <div className={styles.glowOrb} />
      </div>

      <div className={styles.content}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className={`glass-panel ${styles.profileCard}`}
        >
          <div className={styles.avatarPlaceholder}>
            <img src="/profile.png" alt="Profile" className={styles.profileImage} />
          </div>
          
          <div className={styles.textContent}>
            <motion.h1 
              className={styles.title}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Hriday Chawla
            </motion.h1>
            
            <motion.p 
              className={styles.subtitle}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Anime Fan • Gamer • Football Lover
            </motion.p>
            
            <motion.div 
              className={styles.actions}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <button className="glass-button">Explore Hubs</button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
