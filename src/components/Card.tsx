"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Play, Plus, MoreVertical, Edit2, Trash2 } from "lucide-react";
import styles from "./Card.module.css";
import Image from "next/image";

interface CardProps {
  title: string;
  subtitle?: string;
  imagePlaceholder?: string;
  imageUrl?: string;
  rating?: string;
  tags?: string[];
  actionLabel?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function Card({
  title,
  subtitle,
  imagePlaceholder = "Image",
  imageUrl,
  rating,
  tags,
  actionLabel = "View",
  onEdit,
  onDelete,
}: CardProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <motion.div 
      className={`glass-panel ${styles.card}`}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.2 }}
    >
      <div className={styles.imageArea}>
        {imageUrl ? (
          <Image src={imageUrl} alt={title} fill style={{ objectFit: 'cover' }} className={styles.cardImage} />
        ) : (
          <div className={styles.imagePlaceholderText}>{imagePlaceholder}</div>
        )}
        
        {rating && (
          <div className={styles.ratingBadge}>
            <Star size={14} className={styles.starIcon} />
            <span>{rating}</span>
          </div>
        )}

        {(onEdit || onDelete) && (
          <div className={styles.menuContainer}>
            <button className={styles.menuButton} onClick={() => setShowMenu(!showMenu)}>
              <MoreVertical size={20} />
            </button>
            <AnimatePresence>
              {showMenu && (
                <motion.div 
                  className={`glass-panel ${styles.dropdownMenu}`}
                  initial={{ opacity: 0, scale: 0.9, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -10 }}
                >
                  {onEdit && (
                    <button className={styles.dropdownItem} onClick={() => { setShowMenu(false); onEdit(); }}>
                      <Edit2 size={14} /> Edit
                    </button>
                  )}
                  {onDelete && (
                    <button className={`${styles.dropdownItem} ${styles.deleteItem}`} onClick={() => { setShowMenu(false); onDelete(); }}>
                      <Trash2 size={14} /> Remove
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        
        {tags && tags.length > 0 && (
          <div className={styles.tags}>
            {tags.map((tag, idx) => (
              <span key={idx} className={styles.tag}>{tag}</span>
            ))}
          </div>
        )}
        
        <div className={styles.actions}>
          <button className={`glass-button ${styles.actionBtn}`}>
            <Play size={16} /> {actionLabel}
          </button>
          <button className={`glass-button ${styles.iconBtn}`}>
            <Plus size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
