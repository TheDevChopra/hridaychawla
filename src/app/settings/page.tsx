"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import styles from "./Settings.module.css";
import { Palette, User, Download, Save, Bell, Lock, Image as ImageIcon, RotateCcw } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { defaultHubItems } from "@/lib/defaultData";

const themes = [
  { id: "dark", name: "Dark Default", color: "#3b82f6" },
  { id: "attack-titan", name: "Attack Titan", color: "#dc2626" },
  { id: "straw-hat", name: "Straw Hat", color: "#0ea5e9" },
  { id: "avengers", name: "Avengers", color: "#eab308" },
  { id: "cyber-gamer", name: "Cyber Gamer", color: "#d946ef" },
  { id: "light-minimal", name: "Minimal Light", color: "#94a3b8" },
  { id: "solarized-light", name: "Solarized Light", color: "#268bd2" },
];

export default function SettingsHub() {
  const [activeTheme, setActiveTheme] = useState("attack-titan");
  const [displayName, setDisplayName] = useState("Hriday Chawla");
  const [bio, setBio] = useState("Anime Fan • Gamer • Football Lover");
  const [notifications, setNotifications] = useState(true);
  
  const [session, setSession] = useState<any>(null);
  const [password, setPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("hc_theme");
    if (savedTheme) setActiveTheme(savedTheme);

    supabase.auth.getSession().then(({ data }) => setSession(data.session));
  }, []);

  const changeTheme = (themeId: string) => {
    setActiveTheme(themeId);
    localStorage.setItem("hc_theme", themeId);
    document.documentElement.setAttribute("data-theme", themeId);
  };

  const handleExport = () => {
    alert("Data export feature will generate a JSON of your Vault and Playlists.");
  };

  const handleUpdatePassword = async () => {
    if (!password) return;
    setPasswordMessage("Updating...");
    const { error } = await supabase.auth.updateUser({ password });
    if (error) setPasswordMessage(error.message);
    else setPasswordMessage("Password updated successfully!");
  };

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !session) return;
    
    setUploading(true);
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `profile_${session.user.id}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('uploads')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      alert("Error uploading image: " + uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from('uploads').getPublicUrl(filePath);
    
    // Save to profiles table
    await supabase.from('profiles').upsert({
      id: session.user.id,
      avatar_url: data.publicUrl,
      display_name: displayName,
      bio: bio
    });

    setUploading(false);
    alert("Profile image updated! Refresh to see it in the sidebar.");
  };

  const handleSaveProfile = async () => {
    if (!session) {
      alert("Please sign in from the Vault page first to save your profile online.");
      return;
    }
    
    const { error } = await supabase.from('profiles').upsert({
      id: session.user.id,
      display_name: displayName,
      bio: bio
    });

    if (error) alert("Error saving profile: " + error.message);
    else alert("Profile saved successfully!");
  };

  const handleRestoreDefaults = async () => {
    if (!session) {
      alert("Please sign in from the Vault page first to restore data.");
      return;
    }
    
    const itemsToInsert = defaultHubItems.map(item => ({
      ...item,
      user_id: session.user.id
    }));

    const { error } = await supabase.from('hub_items').insert(itemsToInsert);
    
    if (error) alert("Error restoring defaults: " + error.message);
    else alert("Defaults restored successfully! Your hubs are fully populated again.");
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
          <h1 className={styles.title}>System <span className="text-gradient">Settings</span></h1>
          <p className={styles.subtitle}>Customize your Personality Hub.</p>
        </motion.div>

        <div className={styles.settingsGrid}>
          {/* Theme Switcher */}
          <section className={`glass-panel ${styles.settingsCard}`}>
            <div className={styles.cardHeader}>
              <Palette size={24} className={styles.icon} />
              <h2>Theme Switcher</h2>
            </div>
            <p className={styles.description}>Change the global aesthetic of the dashboard.</p>
            
            <div className={styles.themeOptions}>
              {themes.map((theme) => (
                <div 
                  key={theme.id}
                  className={`${styles.themeBtn} ${activeTheme === theme.id ? styles.activeTheme : ""}`}
                  onClick={() => changeTheme(theme.id)}
                >
                  <div className={styles.colorCircle} style={{ background: theme.color }} />
                  <span>{theme.name}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Profile Editor */}
          <section className={`glass-panel ${styles.settingsCard}`}>
            <div className={styles.cardHeader}>
              <User size={24} className={styles.icon} />
              <h2>Profile Editor</h2>
            </div>
            <div className={styles.formGroup}>
              <label>Profile Picture</label>
              <div className="glass-button" style={{ position: 'relative', width: 'fit-content' }}>
                <ImageIcon size={16} /> {uploading ? "Uploading..." : "Upload New Picture"}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleProfileImageUpload} 
                  disabled={uploading}
                  style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label>Display Name</label>
              <input 
                type="text" 
                className={styles.input} 
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Bio</label>
              <textarea 
                className={styles.textarea} 
                rows={2} 
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
            <button className="glass-button" onClick={handleSaveProfile}><Save size={16} /> Save Profile</button>
          </section>

          {/* Security */}
          <section className={`glass-panel ${styles.settingsCard}`}>
            <div className={styles.cardHeader}>
              <Lock size={24} className={styles.icon} />
              <h2>Security</h2>
            </div>
            {session ? (
              <div className={styles.formGroup}>
                <label>Change Master Password</label>
                <input 
                  type="password" 
                  className={styles.input} 
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button className="glass-button" onClick={handleUpdatePassword} style={{ marginTop: '10px' }}>
                  Update Password
                </button>
                {passwordMessage && <p style={{ marginTop: '10px', fontSize: '0.9rem', color: 'var(--accent-color)' }}>{passwordMessage}</p>}
              </div>
            ) : (
              <p className={styles.description}>Sign in via the Vault to manage security settings.</p>
            )}
          </section>

          {/* Data Management */}
          <section className={`glass-panel ${styles.settingsCard}`}>
            <div className={styles.cardHeader}>
              <Download size={24} className={styles.icon} />
              <h2>Data Management</h2>
            </div>
            <p className={styles.description}>Restore default app data or export your settings.</p>
            <div className={styles.actions}>
              <button className="glass-button" onClick={handleRestoreDefaults}><RotateCcw size={16} /> Restore Default Cards</button>
              <button className="glass-button" onClick={handleExport}>Export JSON</button>
              <button className={`glass-button ${styles.dangerBtn}`}>Clear All Data</button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
