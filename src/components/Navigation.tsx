"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Gamepad2, Tv, Shield, Music, Settings, Zap, Trophy } from "lucide-react";
import styles from "./Navigation.module.css";

const navItems = [
  { name: "Home", path: "/", icon: LayoutDashboard },
  { name: "Gaming", path: "/gaming", icon: Gamepad2 },
  { name: "Anime", path: "/anime", icon: Tv },
  { name: "Marvel", path: "/marvel", icon: Zap },
  { name: "Football", path: "/football", icon: Trophy },
  { name: "Vault", path: "/vault", icon: Shield },
  { name: "Playlists", path: "/playlists", icon: Music },
  { name: "Settings", path: "/settings", icon: Settings },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
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
  );
}
