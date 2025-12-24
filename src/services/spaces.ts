import { useMutation, useQuery } from "@tanstack/react-query";
import supabase from "./db";
import { v4 as uuidv4 } from "uuid";

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
  const spaceToken = localStorage.getItem("space_token"); // Replace with actual token logic if needed
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
  return useMutation({
    mutationFn: async (newSpace: InsertSpace) => {
      const spaceToken = uuidv4();
      localStorage.setItem("space_token", spaceToken);
      const { data, error } = await supabase
        .from("space")
        .insert([{ ...newSpace, space_token: spaceToken }])
        .select()
        .single();
      if (error || !data) {
        throw new Error(error ? error.message : "Insertion failed");
      }
      return data;
    },
  });
};
