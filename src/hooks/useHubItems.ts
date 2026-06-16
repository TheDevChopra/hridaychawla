import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface HubItem {
  id: string;
  user_id: string;
  hub: string;
  section: string;
  title: string;
  subtitle: string | null;
  tags: string[] | null;
  rating: number | null;
  image_url: string | null;
}

export function useHubItems(hubName: string) {
  const [items, setItems] = useState<HubItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionUser, setSessionUser] = useState<any>(null);

  useEffect(() => {
    checkAuthAndFetch();
  }, [hubName]);

  const checkAuthAndFetch = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    setIsAuthenticated(!!session);
    setSessionUser(session?.user || null);

    const { data, error } = await supabase
      .from("hub_items")
      .select("*")
      .eq("hub", hubName)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching hub items:", error.message);
    } else if (data) {
      setItems(data);
    }
    setLoading(false);
  };

  const addItem = async (itemData: Omit<HubItem, "id" | "user_id">) => {
    if (!sessionUser) return null;

    const { data, error } = await supabase
      .from("hub_items")
      .insert([{ ...itemData, user_id: sessionUser.id }])
      .select()
      .single();

    if (error) {
      console.error("Error adding item:", error.message);
      return null;
    }

    setItems([...items, data]);
    return data;
  };

  const updateItem = async (id: string, updates: Partial<HubItem>) => {
    if (!sessionUser) return null;
    
    const { data, error } = await supabase
      .from("hub_items")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating item:", error.message);
      return null;
    }

    setItems(items.map(item => (item.id === id ? data : item)));
    return data;
  };

  const deleteItem = async (id: string) => {
    if (!sessionUser) return false;
    
    const { error } = await supabase
      .from("hub_items")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting item:", error.message);
      return false;
    }

    setItems(items.filter(item => item.id !== id));
    return true;
  };

  return { items, loading, isAuthenticated, addItem, updateItem, deleteItem, fetchItems: checkAuthAndFetch };
}
