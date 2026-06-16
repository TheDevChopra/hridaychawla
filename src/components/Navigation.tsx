"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Gamepad2, Tv, Shield, Music, Settings, Zap, Trophy, MoreVertical, X } from "lucide-react";
import styles from "./Navigation.module.css";

const navItems = [
  { name: "Home", path: "/", icon: LayoutDashboard },
  { name: "Gaming", path: "/gaming", icon: Gamepad2 },
  { name: "Anime", path: "/anime", icon: Tv },
  { name: "Marvel", path: "/marvel", icon: Zap },
  { name: "Football", path: "/football", icon: Trophy },
  { name: "Playlists", path: "/playlists", icon: Music },
  { name: "Vault", path: "/vault", icon: Shield },
  { name: "Settings", path: "/settings", icon: Settings },
];

export default function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Navigation */}
      <nav className={styles.navContainer}>
        <div className={`glass-panel ${styles.navBar}`}>
          <div className={styles.logo}>
            <span className="text-gradient">HC.</span>
          </div>
          <div className={styles.navLinks}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`${styles.navItem} ${isActive ? styles.active : ""}`}
                >
                  <Icon size={20} />
                  <span className={styles.tooltip}>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Floating Menu Button (3 Dots) */}
      <button 
        className={styles.mobileMenuBtn} 
        onClick={() => setMobileMenuOpen(true)}
        aria-label="Open Navigation Menu"
      >
        <MoreVertical size={28} />
      </button>

      {/* Mobile Fullscreen Overlay */}
      {mobileMenuOpen && (
        <div className={styles.mobileMenuOverlay}>
          <button 
            className={styles.mobileCloseBtn} 
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close Navigation Menu"
          >
            <X size={32} />
          </button>
          
          <div className={styles.mobileMenuHeader}>
            <span className="text-gradient" style={{ fontSize: "2.5rem", fontWeight: 900 }}>HC. HUB</span>
          </div>

          <div className={styles.mobileNavLinks}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`${styles.mobileNavItem} ${isActive ? styles.mobileActive : ""}`}
                >
                  <Icon size={24} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
