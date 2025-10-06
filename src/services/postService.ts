import type {
  Post,
  PostRequest,
  PostsResponse,
} from "@/interface/postsInterface";
import axiosClient from "@/lib/axios";
import { API_ENDPOINTS } from "../config/api";

export const postService = {
  getPosts: async (
    page: number = 1,
    limit: number = 10
  ): Promise<PostsResponse> => {
    const response = await axiosClient.get<PostsResponse>(
      API_ENDPOINTS.POSTS.LIST,
      {
        params: { page, limit },
      }
    );
    return response.data;
  },

  getPost: async (id: string): Promise<Post> => {
    const response = await axiosClient.get<Post>(
      API_ENDPOINTS.POSTS.DETAIL(id)
    );
    return response.data;
  },

  createPost: async (data: PostRequest): Promise<Post> => {
    const response = await axiosClient.post<Post>(
      API_ENDPOINTS.POSTS.CREATE,
      data
    );
    return response.data;
  },

  updatePost: async (id: string, data: Partial<PostRequest>): Promise<Post> => {
    const response = await axiosClient.patch<Post>(
      API_ENDPOINTS.POSTS.UPDATE(id),
      data
    );
    return response.data;
  },

  deletePost: async (id: string): Promise<void> => {
    await axiosClient.delete(API_ENDPOINTS.POSTS.DELETE(id));
  },
};
