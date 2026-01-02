import { useQuery } from "@tanstack/react-query";
import supabase from "./db";

type List = {
  id: string;
  title: string;
  slug: string;
  data: string[];
  created_at: string;
  space_id: string;
};

export const useListQuery = (listId: string) => {
  return useQuery<List | null>({
    queryKey: ["lists", listId],
    queryFn: async () => {
      if (!listId) {
        return null;
      }
      try {
        const { data, error } = await supabase
          .from("list")
          .select("*")
          .eq("id", listId)
          .limit(1);
        if (error || !data) {
          throw new Error(error ? error.message : "No data found");
        }
        return data?.[0];
      } catch (error) {
        throw new Error(
          error instanceof Error ? error.message : "Unknown error"
        );
      }
    },
  });
};

export const useAllListsQuery = (spaceId: string) => {
  return useQuery<List[] | null>({
    queryKey: ["lists"],
    queryFn: async () => {
      if (!spaceId) {
        return null;
      }
      try {
        const { data, error } = await supabase
          .from("list")
          .select("*")
          .eq("space_id", spaceId);
        if (error || !data) {
          throw new Error(error ? error.message : "No data found");
        }
        return data;
      } catch (error) {
        throw new Error(
          error instanceof Error ? error.message : "Unknown error"
        );
      }
    },
  });
};
