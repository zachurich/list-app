import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import supabase from "./db";
import { v4 as uuidv4 } from "uuid";
import { clearSpaceToken, createSpaceToken, getSpaceToken } from "./token";

type Space = {
  created_at: string;
  id: string;
  space_name: string;
  space_description?: string;
  space_token?: string;
  author: string;
};

type InsertSpace = Pick<Space, "author">;

export const useSpaceQuery = () => {
  const spaceToken = getSpaceToken();
  return useQuery<Space>({
    queryKey: ["space"],
    queryFn: async () => {
      if (!spaceToken) {
        return null;
      }
      try {
        const { data, error } = await supabase
          .from("space")
          .select("*")
          .eq("space_token", spaceToken)
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

export const useSpaceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newSpace: InsertSpace) => {
      const spaceToken = createSpaceToken();
      const { data, error } = await supabase
        .from("space")
        .insert([{ ...newSpace, space_token: spaceToken }])
        .select()
        .single();
      if (error || !data) {
        clearSpaceToken();
        throw new Error(error ? error.message : "Insertion failed");
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["space"] });
    },
    onError: () => {
      clearSpaceToken();
    },
  });
};
