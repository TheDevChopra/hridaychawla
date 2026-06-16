-- Run this in your Supabase SQL Editor to seed the database with defaults!
-- It will assign all these items to the first user in your auth.users table.

DO $$
DECLARE
    first_user uuid;
BEGIN
    -- Get the first user ID
    SELECT id INTO first_user FROM auth.users LIMIT 1;

    IF first_user IS NULL THEN
        RAISE EXCEPTION 'No user found in auth.users! Please sign up in the Vault first.';
    END IF;

    -- Add the public read policy so anyone can see the dashboard
    DROP POLICY IF EXISTS "Public can view all hub items" ON public.hub_items;
    CREATE POLICY "Public can view all hub items" ON public.hub_items FOR SELECT USING (true);

    -- Insert Default Gaming Items
    INSERT INTO public.hub_items (user_id, hub, section, title, rating, tags, image_url) VALUES
    (first_user, 'gaming', 'favorites', 'Minecraft', 9.5, ARRAY['Survival', 'Sandbox'], 'https://upload.wikimedia.org/wikipedia/en/5/51/Minecraft_cover.png'),
    (first_user, 'gaming', 'favorites', 'Roblox', 9.0, ARRAY['Platform', 'Creation'], 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Roblox_player_icon_black.svg'),
    (first_user, 'gaming', 'favorites', 'Fortnite', 9.2, ARRAY['Battle Royale'], 'https://upload.wikimedia.org/wikipedia/en/a/a2/Fortnite_cover.jpg'),
    (first_user, 'gaming', 'recommendedAction', 'Ghost of Tsushima', 9.7, ARRAY['Action', 'Samurai'], 'https://upload.wikimedia.org/wikipedia/en/b/b6/Ghost_of_Tsushima.jpg'),
    (first_user, 'gaming', 'recommendedAnime', 'Dragon Ball Sparking Zero', 8.9, ARRAY['Fighting', 'Anime'], 'https://upload.wikimedia.org/wikipedia/en/f/f4/Dragon_Ball_Sparking_Zero_cover.jpg'),
    (first_user, 'gaming', 'recommendedAdventure', 'Zelda Tears of the Kingdom', 9.9, ARRAY['Adventure', 'Open World'], 'https://upload.wikimedia.org/wikipedia/en/f/fb/The_Legend_of_Zelda_Tears_of_the_Kingdom_cover.jpg');

    -- Insert Default Anime Items
    INSERT INTO public.hub_items (user_id, hub, section, title, subtitle, tags, image_url) VALUES
    (first_user, 'anime', 'favorites', 'One Piece', 'Masterpiece', ARRAY['Adventure', 'Shonen'], 'https://upload.wikimedia.org/wikipedia/en/9/90/One_Piece%2C_Volume_61_Cover_%28Japanese%29.jpg'),
    (first_user, 'anime', 'favorites', 'Attack on Titan', 'Masterpiece', ARRAY['Dark Fantasy'], 'https://upload.wikimedia.org/wikipedia/en/d/d6/Shingeki_no_Kyojin_manga_volume_1.jpg'),
    (first_user, 'anime', 'characters', 'Eren Yeager', 'Attack on Titan', ARRAY['Founder', 'Freedom'], 'https://upload.wikimedia.org/wikipedia/en/a/a2/Eren_Yeager_Attack_on_Titan.png'),
    (first_user, 'anime', 'watchlist', 'Solo Leveling', 'Season 2', ARRAY['Hype', 'System'], 'https://upload.wikimedia.org/wikipedia/en/1/1b/Solo_Leveling_Webtoon.png');

    -- Insert Default Marvel Items
    INSERT INTO public.hub_items (user_id, hub, section, title, subtitle, tags, image_url) VALUES
    (first_user, 'marvel', 'favoriteHeroes', 'Iron Man', 'Tony Stark', ARRAY['Genius', 'Billionaire'], 'https://upload.wikimedia.org/wikipedia/en/4/47/Iron_Man_%28circa_2018%29.png'),
    (first_user, 'marvel', 'favoriteHeroes', 'Spider-Man', 'Peter Parker', ARRAY['Web-Slinger', 'Friendly'], 'https://upload.wikimedia.org/wikipedia/en/f/f3/Spider-Man2021.jpg'),
    (first_user, 'marvel', 'mcuEras', 'The Infinity Saga', 'Phases 1-3', ARRAY['Completed', 'Masterpiece'], 'https://upload.wikimedia.org/wikipedia/en/4/4d/Avengers_Infinity_War_poster.jpg');

    -- Insert Default Football Items
    INSERT INTO public.hub_items (user_id, hub, section, title, subtitle, tags, image_url) VALUES
    (first_user, 'football', 'favoritePlayers', 'Cristiano Ronaldo', 'Al Nassr / Portugal', ARRAY['GOAT', 'Striker'], 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Cristiano_Ronaldo_2018.jpg'),
    (first_user, 'football', 'favoriteTeams', 'Real Madrid', 'La Liga', ARRAY['Los Blancos', 'UCL Kings'], 'https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg');

    -- Insert Default Playlists
    INSERT INTO public.hub_items (user_id, hub, section, title, subtitle, tags, image_url) VALUES
    (first_user, 'playlists', 'categories', 'Workout', 'High Energy', ARRAY['Gym', 'Pump'], 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48'),
    (first_user, 'playlists', 'categories', 'Gaming', 'Focus & Flow', ARRAY['Lo-Fi', 'EDM'], 'https://images.unsplash.com/photo-1542751371-adc38448a05e');

END $$;
