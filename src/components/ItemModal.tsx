"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Upload, Save, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import styles from "./ItemModal.module.css";
import { HubItem } from "@/hooks/useHubItems";

interface ItemModalProps {
  hub: string;
  section: string;
  itemToEdit?: HubItem;
  onClose: () => void;
  onSave: (data: Partial<HubItem>) => Promise<any>;
}

export default function ItemModal({ hub, section, itemToEdit, onClose, onSave }: ItemModalProps) {
  const [title, setTitle] = useState(itemToEdit?.title || "");
  const [subtitle, setSubtitle] = useState(itemToEdit?.subtitle || "");
  const [tags, setTags] = useState(itemToEdit?.tags?.join(", ") || "");
  const [rating, setRating] = useState(itemToEdit?.rating?.toString() || "");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    let imageUrl = itemToEdit?.image_url || null;

    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${hub}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Error uploading file:', uploadError.message);
        alert('Upload failed: ' + uploadError.message);
        setUploading(false);
        return;
      }

      const { data } = supabase.storage.from('uploads').getPublicUrl(filePath);
      imageUrl = data.publicUrl;
    }

    const payload: Partial<HubItem> = {
      hub,
      section,
      title,
      subtitle: subtitle || null,
      tags: tags ? tags.split(",").map(t => t.trim()) : null,
      rating: rating ? parseFloat(rating) : null,
      image_url: imageUrl,
    };

    await onSave(payload);
    setUploading(false);
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <motion.div 
        className={`glass-panel ${styles.modal}`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={e => e.stopPropagation()}
      >
        <button className={styles.closeBtn} onClick={onClose}><X size={20} /></button>
        <h2>{itemToEdit ? "Edit Item" : "Add New Item"}</h2>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Title *</label>
            <input required value={title} onChange={e => setTitle(e.target.value)} className={styles.input} />
          </div>

          <div className={styles.inputGroup}>
            <label>Subtitle / Description</label>
            <input value={subtitle} onChange={e => setSubtitle(e.target.value)} className={styles.input} />
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>Tags (comma separated)</label>
              <input value={tags} onChange={e => setTags(e.target.value)} className={styles.input} placeholder="Action, RPG" />
            </div>
            <div className={styles.inputGroup}>
              <label>Rating (optional)</label>
              <input type="number" step="0.1" max="10" value={rating} onChange={e => setRating(e.target.value)} className={styles.input} />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>Image Upload</label>
            <div className={styles.uploadArea}>
              <Upload size={24} />
              <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} />
              {file ? <span>{file.name}</span> : <span>Choose an image...</span>}
            </div>
          </div>

          <button type="submit" disabled={uploading || !title} className={`glass-button ${styles.submitBtn}`}>
            {uploading ? <Loader2 className="animate-spin" /> : <Save size={18} />}
            {uploading ? "Saving..." : "Save Item"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
