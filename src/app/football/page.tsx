"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import Navigation from "@/components/Navigation";
import Card from "@/components/Card";
import ItemModal from "@/components/ItemModal";
import styles from "./Football.module.css";
import { useHubItems, HubItem } from "@/hooks/useHubItems";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export default function FootballHub() {
  const { items, loading, addItem, updateItem, deleteItem } = useHubItems("football");
  
  const [modalOpen, setModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [itemToEdit, setItemToEdit] = useState<HubItem | undefined>();

  const openAddModal = (section: string) => {
    setActiveSection(section);
    setItemToEdit(undefined);
    setModalOpen(true);
  };

  const openEditModal = (item: HubItem) => {
    setActiveSection(item.section);
    setItemToEdit(item);
    setModalOpen(true);
  };

  const handleSave = async (data: Partial<HubItem>) => {
    if (itemToEdit) {
      await updateItem(itemToEdit.id, data);
    } else {
      await addItem(data as any);
    }
  };

  const renderSection = (title: string, sectionKey: string) => {
    const sectionItems = items.filter(i => i.section === sectionKey);
    return (
      <section className={styles.section} key={sectionKey}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 className={styles.sectionTitle} style={{ margin: 0 }}>{title}</h2>
          <button className="glass-button" onClick={() => openAddModal(sectionKey)}>
            <Plus size={16} /> Add Item
          </button>
        </div>
        
        {loading ? (
          <p style={{ color: "rgba(255,255,255,0.5)" }}>Loading...</p>
        ) : sectionItems.length === 0 ? (
          <div className="glass-panel" style={{ padding: "40px", textAlign: "center", color: "rgba(255,255,255,0.5)" }}>
            No items added yet. Click "Add Item" to get started!
          </div>
        ) : (
          <motion.div className={styles.grid} variants={containerVariants} initial="hidden" animate="show">
            {sectionItems.map((item) => (
              <Card 
                key={item.id} 
                title={item.title}
                subtitle={item.subtitle || ""}
                imageUrl={item.image_url || undefined}
                rating={item.rating ? item.rating.toString() : undefined}
                tags={item.tags || []}
                actionLabel="View Profile" 
                imagePlaceholder={item.title.slice(0, 2).toUpperCase()}
                onEdit={() => openEditModal(item)}
                onDelete={() => deleteItem(item.id)}
              />
            ))}
          </motion.div>
        )}
      </section>
    );
  };

  return (
    <main className={styles.mainContainer}>
      <Navigation />
      
      <div className={styles.contentArea}>
        <motion.div 
          className={styles.header}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className={styles.title}>Football <span className="text-gradient">Hub</span></h1>
          <p className={styles.subtitle}>Track your favorite players, teams, and upcoming matches.</p>
        </motion.div>

        {renderSection("Favorite Players", "favoritePlayers")}
        {renderSection("Favorite Teams", "favoriteTeams")}
        {renderSection("Upcoming Matches", "mockMatches")}

        {modalOpen && (
          <ItemModal 
            hub="football"
            section={activeSection}
            itemToEdit={itemToEdit}
            onClose={() => setModalOpen(false)}
            onSave={handleSave}
          />
        )}
      </div>
    </main>
  );
}
