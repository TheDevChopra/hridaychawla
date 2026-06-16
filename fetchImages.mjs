import fs from 'fs';
import path from 'path';
import { image_search } from 'duckduckgo-images-api';
import https from 'https';

const queries = [
  // Gaming
  "Minecraft official game cover",
  "Roblox official game cover",
  "Fortnite official game cover",
  "EA FC 24 official game cover",
  "Rocket League official game cover",
  "Marvel Rivals official game cover",
  "GTA V official game cover",
  "Ghost of Tsushima official game cover",
  "Spider-Man Remastered official game cover",
  "Batman Arkham Knight official game cover",
  "God of War Ragnarok official game cover",
  "Dragon Ball Sparking Zero official game cover",
  "Naruto Storm Connections official game cover",
  "One Piece Odyssey official game cover",
  "Zelda Tears of the Kingdom official game cover",
  "Hogwarts Legacy official game cover",
  "Horizon Forbidden West official game cover",
  // Anime
  "One Piece anime official poster",
  "Attack on Titan anime official poster",
  "Eren Yeager anime official art",
  "Monkey D Luffy anime official art",
  "Levi Ackerman anime official art",
  "Roronoa Zoro anime official art",
  "Jujutsu Kaisen anime official poster",
  "Demon Slayer anime official poster",
  "Solo Leveling anime official poster",
  // Marvel
  "Iron Man MCU official art",
  "Spider-Man MCU official art",
  "Captain America MCU official art",
  "Thor MCU official art",
  "Hulk MCU official art",
  "Infinity Saga MCU poster",
  "Multiverse Saga MCU poster",
  // Football
  "Cristiano Ronaldo Al Nassr official",
  "Lionel Messi Inter Miami official",
  "Jude Bellingham Real Madrid official",
  "Kylian Mbappe Real Madrid official",
  "Real Madrid logo",
  "Manchester United logo",
  "Real Madrid vs Barcelona El Clasico",
  "Man Utd vs Man City Derby"
];

const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        res.pipe(fs.createWriteStream(filepath))
           .on('error', reject)
           .once('close', () => resolve(filepath));
      } else {
        res.resume();
        reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));
      }
    }).on('error', reject);
  });
};

const sanitize = (name) => name.replace(/[^a-z0-9]/gi, '_').toLowerCase();

async function run() {
  const dir = path.join(process.cwd(), 'public', 'images');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const map = {};

  for (const q of queries) {
    console.log(`Searching for: ${q}`);
    try {
      const results = await image_search({ query: q, moderate: true });
      if (results && results.length > 0) {
        const url = results[0].image;
        const ext = url.split('.').pop().split('?')[0].slice(0, 4) || 'jpg';
        const filename = `${sanitize(q)}.${ext}`;
        const filepath = path.join(dir, filename);
        
        try {
          await downloadImage(url, filepath);
          map[q] = `/images/${filename}`;
          console.log(`Saved: ${filename}`);
        } catch (e) {
          console.log(`Failed to download ${url}:`, e.message);
          // Try second image
          if (results.length > 1) {
            const url2 = results[1].image;
            try {
              await downloadImage(url2, filepath);
              map[q] = `/images/${filename}`;
              console.log(`Saved backup: ${filename}`);
            } catch (e2) {
              console.log(`Backup failed`);
            }
          }
        }
      }
    } catch (e) {
      console.log(`Search failed for ${q}`);
    }
    // sleep briefly
    await new Promise(r => setTimeout(r, 1000));
  }

  fs.writeFileSync('image_map.json', JSON.stringify(map, null, 2));
  console.log('Done!');
}

run();
