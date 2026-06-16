"use client";

import { motion, Variants } from "framer-motion";
import { Tv, UserCircle, Gamepad, Monitor } from "lucide-react";
import styles from "./Stats.module.css";

const statsData = [
  { label: "Favorite Anime", value: "One Piece & AOT", icon: Tv },
  { label: "Favorite Character", value: "Eren Yeager", icon: UserCircle },
  { label: "Favorite Genre", value: "Action & Adventure", icon: Gamepad },
  { label: "Gaming Setup", value: "High-End PC", icon: Monitor },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.8,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300 } },
};

export default function Stats() {
  return (
    <section className={styles.statsSection}>
      <motion.div 
        className={styles.statsGrid}
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div key={index} variants={itemVariants} className={`glass-panel ${styles.statCard}`}>
              <div className={styles.iconContainer}>
                <Icon size={24} className={styles.icon} />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statLabel}>{stat.label}</span>
                <span className={styles.statValue}>{stat.value}</span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
