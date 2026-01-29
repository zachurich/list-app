import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import supabase from "./db";
import { v4 as uuidv4 } from "uuid";

export type ListItem = {
  id: string;
  content: string;
  completed: boolean;
};

export type List = {
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
  spaceId: string | undefined,
) => {
  const { data: allLists, ...rest } = useAllListsQuery(spaceId); // Preload all lists for caching
  const singleList = allLists?.find((list) => list.id === listId);

  if (!singleList) {
    return {
      data: null,
      ...rest,
    };
  }

  return {
    data: singleList,
    ...rest,
  };
};

export const useAllListsQuery = (spaceId: string | undefined) => {
  return useQuery<ListDb[], unknown, List[]>({
    queryKey: ["lists"],
    enabled: Boolean(spaceId),
    select: (data: ListDb[]) =>
      sortLists(
        data.map((list) => ({
          ...list,
          data:
            typeof list.data === "string" ? JSON.parse(list.data) : list.data,
        })),
      ),
    queryFn: async () => {
      if (!spaceId) {
        throw new Error("Space ID is required to fetch lists");
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
          error instanceof Error ? error.message : "Unknown error",
        );
      }
    },
  });
};

export const useListMutation = (
  spaceId: string | undefined,
  listId?: string | undefined,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["lists"],
    mutationFn: async (newList: Partial<List>) => {
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
        slug: newList?.title?.toLowerCase().replace(/\s+/g, "-"),
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
    onMutate: async (variables, context) => {
      await context.client.cancelQueries({ queryKey: ["lists"] });
      // Snapshot the previous value
      const previous: List[] | undefined = context.client.getQueryData([
        "lists",
      ]);
      // Optimistically update to the new value
      await context.client.setQueryData(
        ["lists"],
        (old: List[] | undefined) => {
          const listBeingUpdated = old?.find((list) => list.id === listId);
          const existing = (old || []).filter(
            (list) => list.id !== listBeingUpdated?.id,
          );

          return sortLists([
            ...existing,
            {
              id: listId || "",
              title: listBeingUpdated?.title || "",
              data: listBeingUpdated?.data || [],
              slug: listBeingUpdated?.slug || "",
              created_at: listBeingUpdated?.created_at ?? "",
              space_id: listBeingUpdated?.space_id || "",
              ...variables,
            },
          ]);
        },
      );

      return { previous };
    },
    onError: (_, __, onMutateResult, context) => {
      context.client.setQueryData(["lists"], onMutateResult?.previous);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["lists"] }),
  });
};

export const useListDelete = (spaceId: string | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["lists"],
    mutationFn: async (listId: string) => {
      if (!spaceId) {
        throw new Error("Space ID is required to delete a list");
      }

      const { error } = await supabase
        .from("list")
        .delete()
        .eq("id", listId)
        .eq("space_id", spaceId);

      if (error) {
        throw new Error(error.message);
      }
    },
    onMutate: async (listId, context) => {
      await context.client.cancelQueries({ queryKey: ["lists"] });
      // Snapshot the previous value
      const previous: List[] | undefined = context.client.getQueryData([
        "lists",
      ]);
      // Optimistically update to the new value
      await context.client.setQueryData(
        ["lists"],
        (old: List[] | undefined) => {
          const listWithoutDeletedItem = (old || []).filter(
            (list) => list.id !== listId,
          );
          return sortLists([...listWithoutDeletedItem]);
        },
      );

      return { previous };
    },
    onError: (_, __, onMutateResult, context) => {
      context.client.setQueryData(["lists"], onMutateResult?.previous);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["lists"] }),
  });
};

export const sortLists = (lists: List[]) => {
  return lists.slice().sort((a, b) => {
    const indexA = new Date(a.created_at).getTime();
    const indexB = new Date(b.created_at).getTime();
    return indexA - indexB;
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
  updates: Partial<ListItem>,
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
  content: string,
) => {
  return updateListItemById(id, items, { content });
};
