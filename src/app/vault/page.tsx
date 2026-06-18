"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Key, Copy, Plus, AlertTriangle, Eye, EyeOff, LogIn, UserPlus, Edit, Trash2 } from "lucide-react";
import Navigation from "@/components/Navigation";
import styles from "./Vault.module.css";
import { encryptData, decryptData, generatePassword, checkPasswordStrength } from "@/lib/encryption";
import { supabase } from "@/lib/supabase";

interface VaultEntry {
  id: string;
  category: string;
  username: string;
  encryptedPassword?: string;
  encrypted_data?: string; // from Supabase
}

const defaultCategories = ["Snapchat", "Roblox", "Instagram", "Gmail", "Discord"];

export default function VaultHub() {
  const [entries, setEntries] = useState<VaultEntry[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newEntry, setNewEntry] = useState({ category: "Snapchat", username: "", password: "" });
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});
  const [generatedPassword, setGeneratedPassword] = useState("");

  const closeModal = () => {
    setShowAddModal(false);
    setEditingId(null);
    setNewEntry({ category: "Snapchat", username: "", password: "" });
    setGeneratedPassword("");
  };

  const openEditModal = (entry: VaultEntry) => {
    const encryptedStr = entry.encrypted_data || entry.encryptedPassword || "";
    const decrypted = decryptData(encryptedStr);
    
    setEditingId(entry.id);
    setNewEntry({
      category: entry.category,
      username: entry.username,
      password: decrypted
    });
    setShowAddModal(true);
  };

  const handleDeleteEntry = async (id: string) => {
    if (!confirm("Are you sure you want to delete this account?")) return;
    
    const { error } = await supabase
      .from('vault_entries')
      .delete()
      .eq('id', id)
      .eq('user_id', session.user.id);
      
    if (error) {
      console.error("Delete error:", error.message);
      alert("Error deleting entry.");
    } else {
      setEntries(entries.filter(e => e.id !== id));
    }
  };

  // Auth State
  const [session, setSession] = useState<any>(null);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchEntries(session.user.id);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchEntries(session.user.id);
      else setEntries([]);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchEntries = async (userId: string) => {
    const { data, error } = await supabase
      .from('vault_entries')
      .select('*')
      .eq('user_id', userId);
    
    if (data) setEntries(data);
    if (error) console.error("Error fetching entries:", error.message);
  };

  const handleSignUp = async () => {
    setAuthError("");
    const { error } = await supabase.auth.signUp({ email: authEmail, password: authPassword });
    if (error) setAuthError(error.message);
    else setAuthError("Success! Check your email to verify (if email confirmations are enabled) or just sign in.");
  };

  const handleSignIn = async () => {
    setAuthError("");
    const { error } = await supabase.auth.signInWithPassword({ email: authEmail, password: authPassword });
    if (error) setAuthError(error.message);
  };

  const handleSignOut = () => {
    supabase.auth.signOut();
  };

  const handleSaveEntry = async () => {
    if (!newEntry.username || !newEntry.password || !session) return;
    
    const encryptedStr = encryptData(newEntry.password);

    if (editingId) {
      const { data, error } = await supabase
        .from('vault_entries')
        .update({
          category: newEntry.category,
          username: newEntry.username,
          encrypted_data: encryptedStr
        })
        .eq('id', editingId)
        .eq('user_id', session.user.id)
        .select();
        
      if (error) {
        console.error("Update error:", error.message);
        alert("Error updating entry.");
      } else if (data) {
        setEntries(entries.map(e => e.id === editingId ? data[0] : e));
        closeModal();
      }
    } else {
      const { data, error } = await supabase
        .from('vault_entries')
        .insert([
          {
            user_id: session.user.id,
            category: newEntry.category,
            username: newEntry.username,
            encrypted_data: encryptedStr
          }
        ])
        .select();
      
      if (error) {
        console.error("Insert error:", error.message);
        alert("Error saving to database. Did you run the SQL schema in Supabase?");
      } else if (data) {
        setEntries([...entries, data[0]]);
        closeModal();
      }
    }
  };

  const handleGenerate = () => {
    const pwd = generatePassword(16);
    setGeneratedPassword(pwd);
    setNewEntry({ ...newEntry, password: pwd });
  };

  const togglePasswordVisibility = (id: string) => {
    setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
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
          <div className={styles.headerFlex}>
            <div>
              <h1 className={styles.title}>Secure <span className="text-gradient">Vault</span></h1>
              <p className={styles.subtitle}>End-to-end encrypted password manager.</p>
            </div>
            {session && (
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="glass-button" onClick={handleSignOut}>Sign Out</button>
                <button className="glass-button" style={{ background: "var(--accent-color)" }} onClick={() => setShowAddModal(true)}>
                  <Plus size={20} /> Add Account
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {!session ? (
          <section className={styles.authSection}>
            <motion.div 
              className={`glass-panel ${styles.authCard}`}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <Shield size={48} className={styles.iconSafe} style={{ marginBottom: "20px" }} />
              <h2>Unlock Your Vault</h2>
              <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: "24px" }}>
                Sign in to sync your encrypted data. Your master password decrypts your vault locally.
              </p>
              
              <input 
                type="email" 
                placeholder="Email Address" 
                className={styles.input} 
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                style={{ marginBottom: "12px" }}
              />
              <input 
                type="password" 
                placeholder="Master Password" 
                className={styles.input} 
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                style={{ marginBottom: "24px" }}
              />
              
              {authError && <p className={styles.authError}>{authError}</p>}
              
              <div className={styles.authActions}>
                <button className={`glass-button ${styles.actionBtn}`} onClick={handleSignIn}><LogIn size={16} /> Sign In</button>
                <button className={`glass-button ${styles.actionBtn}`} onClick={handleSignUp}><UserPlus size={16} /> Sign Up</button>
              </div>
            </motion.div>
          </section>
        ) : (
          <>
            <section className={styles.securityDashboard}>
              <div className={`glass-panel ${styles.dashboardCard}`}>
                <Shield size={32} className={styles.iconSafe} />
                <div className={styles.dashboardInfo}>
                  <h3>Security Status: Secure</h3>
                  <p>AES-256 Client-Side Encryption Active</p>
                </div>
              </div>
              <div className={`glass-panel ${styles.dashboardCard}`}>
                <AlertTriangle size={32} className={styles.iconWarning} />
                <div className={styles.dashboardInfo}>
                  <h3>Synced to Supabase</h3>
                  <p>{entries.length} items securely stored</p>
                </div>
              </div>
            </section>

            <section className={styles.vaultList}>
              <h2 className={styles.sectionTitle}>Your Accounts</h2>
              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Username</th>
                      <th>Password</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.length === 0 && (
                      <tr>
                        <td colSpan={4} style={{ textAlign: "center", padding: "30px", color: "rgba(255,255,255,0.5)" }}>
                          No accounts saved yet. Click Add Account to get started!
                        </td>
                      </tr>
                    )}
                    {entries.map((entry) => {
                      const isVisible = showPasswords[entry.id];
                      // Handle both mock data property name and real db property name
                      const encryptedStr = entry.encrypted_data || entry.encryptedPassword || "";
                      const decrypted = decryptData(encryptedStr);
                      
                      return (
                        <tr key={entry.id} className={styles.tableRow}>
                          <td className={styles.categoryCell}>{entry.category}</td>
                          <td>{entry.username}</td>
                          <td className={styles.passwordCell}>
                            {isVisible ? decrypted : "••••••••••••••••"}
                            <button className={styles.iconBtn} onClick={() => togglePasswordVisibility(entry.id)}>
                              {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </td>
                          <td className={styles.actionsCell}>
                            <button className={`glass-button ${styles.actionBtn}`} onClick={() => handleCopy(decrypted)} title="Copy Password">
                              <Copy size={16} /> <span className={styles.actionText}>Copy</span>
                            </button>
                            <button className={`glass-button ${styles.actionBtn}`} onClick={() => openEditModal(entry)} title="Edit Account">
                              <Edit size={16} /> <span className={styles.actionText}>Edit</span>
                            </button>
                            <button className={`glass-button ${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => handleDeleteEntry(entry.id)} title="Delete Account">
                              <Trash2 size={16} /> <span className={styles.actionText}>Delete</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        {showAddModal && (
          <div className={styles.modalOverlay} onClick={closeModal}>
            <motion.div 
              className={`glass-panel ${styles.modalContent}`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={e => e.stopPropagation()}
            >
              <h2>{editingId ? "Edit Account" : "Add New Account"}</h2>
              
              <select 
                className={styles.input} 
                value={newEntry.category}
                onChange={(e) => setNewEntry({...newEntry, category: e.target.value})}
              >
                {defaultCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              
              <input 
                type="text" 
                placeholder="Username / Email" 
                className={styles.input} 
                value={newEntry.username}
                onChange={(e) => setNewEntry({...newEntry, username: e.target.value})}
              />
              
              <div className={styles.passwordInputGroup}>
                <input 
                  type="text" 
                  placeholder="Password" 
                  className={styles.input} 
                  value={newEntry.password}
                  onChange={(e) => setNewEntry({...newEntry, password: e.target.value})}
                />
                <button className={`glass-button ${styles.generateBtn}`} onClick={handleGenerate}>
                  <Key size={16} /> Generate
                </button>
              </div>

              {newEntry.password && (
                <div className={styles.strengthMeter}>
                  Strength: <span className={styles[checkPasswordStrength(newEntry.password).toLowerCase()]}>
                    {checkPasswordStrength(newEntry.password)}
                  </span>
                </div>
              )}

              <div className={styles.modalActions}>
                <button className="glass-button" onClick={closeModal}>Cancel</button>
                <button className="glass-button" style={{ background: "var(--accent-color)" }} onClick={handleSaveEntry}>Save Encrypted</button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </main>
  );
}
