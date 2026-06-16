"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Card from "@/components/Card";
import styles from "./page.module.css";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";

interface UpcomingAnime {
  mal_id: number;
  title: string;
  images: { jpg: { image_url: string } };
  genres: { name: string }[];
}

export default function Home() {
  const [recentItems, setRecentItems] = useState<any[]>([]);
  const [upcomingAnime, setUpcomingAnime] = useState<UpcomingAnime[]>([]);
  const [loadingUpcoming, setLoadingUpcoming] = useState(true);

  useEffect(() => {
    fetchRecentHubItems();
    fetchUpcomingAnime();
  }, []);

  const fetchRecentHubItems = async () => {
    // Fetch the 4 most recently added items across any hub globally
    const { data } = await supabase
      .from('hub_items')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(4);

    if (data) setRecentItems(data);
  };

  const fetchUpcomingAnime = async () => {
    try {
      const res = await fetch('https://api.jikan.moe/v4/seasons/upcoming');
      const data = await res.json();
      // take top 4
      if (data.data) {
        setUpcomingAnime(data.data.slice(0, 4));
      }
    } catch (e) {
      console.error("Failed to fetch anime", e);
    }
    setLoadingUpcoming(false);
  };

  return (
    <main className={styles.mainContainer}>
      <Navigation />
      
      <div className={styles.contentArea}>
        <Hero />
        <Stats />
        
        {/* Hub Highlights */}
        <section className={styles.section} style={{ marginTop: '40px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>Your Recent Hub Additions</h2>
          {recentItems.length === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.6)' }}>Add items to your Gaming, Anime, or Marvel hubs to see them here.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
              {recentItems.map((item) => (
                <Card 
                  key={item.id}
                  title={item.title}
                  subtitle={item.hub ? `${item.hub.toUpperCase()} • ${item.section}` : item.section}
                  imageUrl={item.image_url}
                  rating={item.rating?.toString()}
                  tags={item.tags}
                  actionLabel="View"
                />
              ))}
            </div>
          )}
        </section>

        {/* Auto-updating upcoming shows API */}
        <section className={styles.section} style={{ marginTop: '40px', marginBottom: '80px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>Upcoming Anime Releases 📺</h2>
          {loadingUpcoming ? (
            <p style={{ color: 'rgba(255,255,255,0.6)' }}>Fetching live data...</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
              {upcomingAnime.map((anime) => (
                <Card 
                  key={anime.mal_id}
                  title={anime.title}
                  imageUrl={anime.images.jpg.image_url}
                  tags={anime.genres.slice(0, 2).map(g => g.name)}
                  actionLabel="Details"
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
