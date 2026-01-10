import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import supabase from "./db";
import { v4 as uuidv4 } from "uuid";

type ListItem = {
  id: string;
  content: string;
  completed: boolean;
};

type List = {
  id: string;
  title: string;
  slug: string;
  data: ListItem[];
  created_at: string;
  space_id: string;
};

type ListDb = {
  id: string;
  title: string;
  slug: string;
  data: string;
  created_at: string;
  space_id: string;
};

export type NewList = Omit<List, "id" | "created_at" | "slug">;

export const useListQuery = (
  listId: string | undefined,
  spaceId: string | undefined
) => {
  const { data: allLists, isLoading, error } = useAllListsQuery(spaceId); // Preload all lists for caching
  const singleList = allLists?.find((list) => list.id === listId);

  if (!singleList) {
    return {
      data: null,
      isLoading,
      error,
    };
  }

  return {
    data: singleList,
    isLoading,
    error,
  };
};

export const useAllListsQuery = (spaceId: string | undefined) => {
  return useQuery<ListDb[], unknown, List[]>({
    queryKey: ["lists"],
    enabled: Boolean(spaceId),
    select: (data: ListDb[]) =>
      data.map((list) => ({
        ...list,
        data: typeof list.data === "string" ? JSON.parse(list.data) : list.data,
      })),
    queryFn: async () => {
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

export const useListMutation = (
  spaceId: string | undefined,
  listId?: string | undefined
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newList: Omit<List, "id" | "created_at" | "slug">) => {
      if (!spaceId) {
        throw new Error("Space ID is required to create a list");
      }

      if (listId) {
        const { data, error } = await supabase
          .from("list")
          .update({ ...newList, data: newList.data })
          .eq("id", listId)
          .eq("space_id", spaceId)
          .select();

        if (error || !data) {
          throw new Error(error ? error.message : "Update failed");
        }
        return data;
      }

      const list = {
        ...newList,
        slug: newList.title.toLowerCase().replace(/\s+/g, "-"),
        space_id: spaceId,
      };
      const { data, error } = await supabase
        .from("list")
        .insert([list])
        .select()
        .single();
      if (error || !data) {
        throw new Error(error ? error.message : "Insertion failed");
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists"] });
    },
  });
};

export const createListItem = () => {
  return {
    id: uuidv4(),
    content: "",
    completed: false,
  };
};

export const updateListItemById = (
  id: string,
  items: ListItem[],
  updates: Partial<ListItem>
) => {
  return items.map((item) => (item.id === id ? { ...item, ...updates } : item));
};

export const markItemCompleted = (id: string, items: ListItem[]) => {
  return updateListItemById(id, items, { completed: true });
};

export const markItemIncomplete = (id: string, items: ListItem[]) => {
  return updateListItemById(id, items, { completed: false });
};

export const deleteListItemById = (id: string, items: ListItem[]) => {
  return items.filter((item) => item.id !== id);
};

export const updateListItemContent = (
  id: string,
  items: ListItem[],
  content: string
) => {
  return updateListItemById(id, items, { content });
};
