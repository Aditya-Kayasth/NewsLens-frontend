// lib/articleStore.ts
import { create } from "zustand";
import { BackendArticle } from "@/types";

interface ArticleState {
  selectedArticle: BackendArticle | null;
  setSelectedArticle: (article: BackendArticle) => void;
}

export const useArticleStore = create<ArticleState>((set) => ({
  selectedArticle: null,
  setSelectedArticle: (article) => set({ selectedArticle: article }),
}));
