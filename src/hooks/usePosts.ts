import { ROUTE_PAGES } from "@/config/routePage";
import type {
  Post,
  PostRequest,
  PostsResponse,
} from "@/interface/postsInterface";
import { postService } from "@/services/postService";
import { deepClone } from "@/utils/format";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { useAuth } from "./useAuth";

// -------------------
// Posts list with pagination
// -------------------
export const usePosts = (page: number, limit: number) =>
  useQuery<PostsResponse>({
    queryKey: ["posts", { page, limit }],
    queryFn: () => postService.getPosts(page, limit),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: true,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
  });

// -------------------
// Post detail
// -------------------
export const usePost = (id: string | undefined) =>
  useQuery<Post>({
    queryKey: ["post", id],
    queryFn: () => postService.getPost(id!),
    enabled: !!id,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: true,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
  });

// Helpers (thêm nếu chưa có)
function isPostsResponse(data: unknown): data is PostsResponse {
  return (
    typeof data === "object" &&
    data !== null &&
    Array.isArray((data as PostsResponse).posts) &&
    typeof (data as PostsResponse).total === "number" &&
    typeof (data as PostsResponse).page === "number" &&
    typeof (data as PostsResponse).limit === "number" &&
    typeof (data as PostsResponse).totalPages === "number"
  );
}

function extractPageFromKey(key: unknown): number {
  if (Array.isArray(key) && key.length >= 2) {
    const second = key[1];
    if (typeof second === "number") return second;
    if (second && typeof second === "object" && "page" in second)
      return (second as { page: number }).page;
  }
  return 1; // Default
}

// -------------------
// Create (compact, safe)
// -------------------
export const useCreatePost = () => {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const { user } = useAuth();

  return useMutation<
    Post,
    unknown,
    PostRequest,
    {
      prevQueries?: Array<[readonly unknown[], unknown]>;
      tempId?: string;
    }
  >({
    mutationFn: (body: PostRequest) => postService.createPost(body),
    onMutate: async (newPost: PostRequest) => {
      // 1. Cancel ongoing queries để tránh race condition
      await qc.cancelQueries({ queryKey: ["posts"] });

      // 2. Snapshot và deep clone previous data từ tất cả cache matching ["posts"]
      const prevQueries = qc.getQueriesData({ queryKey: ["posts"] }).map(
        ([key, data]) =>
          [key, data ? deepClone(data) : data] as [readonly unknown[], unknown] // Fix type cho key
      );

      // 3. Tạo tempId và optimistic post (dựa trên newPost để nhanh)
      const tempId = `temp-${Date.now()}`;
      const optimisticPost: Post = {
        id: tempId,
        title: newPost.title,
        content: newPost.content,
        authorId: user?.id ?? "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        author: {
          id: user?.id ?? "",
          name: user?.name ?? "You",
          email: user?.email ?? "",
        },
      };

      // 4. Áp dụng optimistic update vào từng cache entry (chỉ list, không detail)
      prevQueries.forEach(([key, snapshot]) => {
        if (!snapshot || !isPostsResponse(snapshot)) return;

        const oldData = snapshot as PostsResponse;
        const newTotal = oldData.total + 1;
        const newTotalPages = Math.ceil(newTotal / oldData.limit);

        const queryPage = extractPageFromKey(key);

        let newPosts = oldData.posts;
        if (queryPage === 1) {
          newPosts = [optimisticPost, ...oldData.posts];
        }

        qc.setQueryData(
          key as readonly unknown[], // Cast an toàn
          {
            ...oldData,
            posts: newPosts,
            total: newTotal,
            totalPages: newTotalPages,
          } as PostsResponse
        );
      });

      return { prevQueries, tempId };
    },
    onError: (_err, _newPost, context) => {
      context?.prevQueries?.forEach(([key, snapshot]) => {
        qc.setQueryData(key as readonly unknown[], snapshot);
      });
    },
    onSuccess: (createdPost: Post, _newPost, context) => {
      console.log("createdPost", createdPost);
      console.log("_newPost", _newPost);
      console.log("context", context);

      // CRITICAL: Cập nhật cache với ID thật - Thay thế optimistic post
      const { tempId, prevQueries } = context || {
        tempId: "",
        prevQueries: [],
      };
      if (tempId && prevQueries) {
        prevQueries.forEach(([key, _snapshot]) => {
          const currentData = qc.getQueryData<PostsResponse>(key);
          if (!currentData || !isPostsResponse(currentData)) return;

          // Tìm và thay optimistic post bằng real post (dựa trên tempId)
          const updatedPosts = currentData.posts.map(
            (post) =>
              post.id === tempId
                ? { ...createdPost, author: post.author }
                : post // Giữ author nếu cần
          );

          // Update total nếu cần (nhưng vì success, total đã +1 ở optimistic)
          qc.setQueryData(key as readonly unknown[], {
            ...currentData,
            posts: updatedPosts,
          });
        });
      }
      // Navigate sau khi update cache
      navigate(ROUTE_PAGES.POSTS.DETAIL(createdPost.id), { replace: true });
    },
    onSettled: () => {
      qc.invalidateQueries({
        queryKey: ["posts"],
        refetchType: "active", // Chỉ refetch queries đang active (nhanh hơn)
        exact: false, // Invalidate tất cả matching ["posts"]
      });
    },
  });
};

// -------------------
// Update (safe snapshot + keep author)
// -------------------
export const useUpdatePost = () => {
  const qc = useQueryClient();
  const navigate = useNavigate();

  return useMutation<
    Post,
    unknown,
    { id: string; data: PostRequest }, // Variables: object { id, data }
    {
      prevQueries?: Array<[readonly unknown[], unknown]>;
      prevDetail?: Post | undefined;
    }
  >({
    mutationFn: ({ id, data }: { id: string; data: PostRequest }) =>
      postService.updatePost(id, data),
    onMutate: async ({ id, data }: { id: string; data: PostRequest }) => {
      // 1. Cancel ongoing queries để tránh race
      await qc.cancelQueries({ queryKey: ["posts"] });
      await qc.cancelQueries({ queryKey: ["post", id] });

      // 2. Snapshot list queries
      const prevQueries = qc
        .getQueriesData({ queryKey: ["posts"] })
        .map(
          ([key, d]) =>
            [key, d ? deepClone(d) : d] as [readonly unknown[], unknown]
        );

      // 3. Snapshot detail post (type as Post | undefined để match context)
      const prevDetail = qc.getQueryData<Post>(["post", id]);

      // 4. Tạo optimistic post (thay thế với data mới) - Fix: Set id explicit, fallback nếu prevDetail undefined
      const optimisticPost: Post = {
        id, // Explicit id từ variables
        ...prevDetail, // Giữ fields cũ nếu có (author, createdAt, etc.)
        ...data, // Override title, content từ input
        updatedAt: new Date().toISOString(), // Update timestamp
        // Fallback nếu prevDetail undefined (ví dụ author từ local user nếu cần)
        ...(prevDetail
          ? {}
          : { authorId: "", createdAt: new Date().toISOString() }), // Thêm fallback nếu cần
      } as Post;

      // 5. Update list caches (thay thế postId trong posts array)
      prevQueries.forEach(([key, snapshot]) => {
        if (!snapshot || !isPostsResponse(snapshot)) return;

        const oldData = snapshot as PostsResponse;
        // Không thay đổi total/totalPages (update không ảnh hưởng count)

        qc.setQueryData(
          key as readonly unknown[],
          {
            ...oldData,
            posts: oldData.posts.map((post) =>
              post.id === id ? optimisticPost : post
            ),
          } as PostsResponse
        );
      });

      // 6. Update detail cache
      qc.setQueryData(["post", id], optimisticPost);

      return { prevQueries, prevDetail };
    },
    onError: (_err, _variables, context) => {
      const { id } = _variables; // Lấy id từ variables
      // Rollback list
      context?.prevQueries?.forEach(([key, snapshot]) => {
        qc.setQueryData(key as readonly unknown[], snapshot as unknown);
      });
      // Rollback detail
      if (context?.prevDetail) {
        qc.setQueryData(["post", id], context.prevDetail);
      }
    },
    onSuccess: (updatedPost, _newPost, _context) => {
      // Không invalidate ở đây (di chuyển vào onSettled)
      navigate(ROUTE_PAGES.POSTS.DETAIL(updatedPost.id));
    },
    onSettled: (_data, _error, variables, _context) => {
      const { id } = variables; // Lấy id từ variables
      // Đồng bộ với server (refetch list/detail sau success/error)
      qc.invalidateQueries({ queryKey: ["posts"] });
      qc.invalidateQueries({ queryKey: ["post", id] });
    },
  });
};

// -------------------
// Delete (safe snapshot + redirect if on detail)
// -------------------
export const useDeletePost = () => {
  const qc = useQueryClient();
  const navigate = useNavigate();

  return useMutation<
    void, // Delete thường không trả data, hoặc Post nếu cần
    unknown,
    string, // Variables: { id }
    {
      prevQueries?: Array<[readonly unknown[], unknown]>;
      prevDetail?: Post | undefined;
    }
  >({
    mutationFn: (id: string) => postService.deletePost(id),
    onMutate: async (id: string) => {
      // 1. Cancel ongoing queries để tránh race
      await qc.cancelQueries({ queryKey: ["posts"] });
      await qc.cancelQueries({ queryKey: ["post", id] });

      // 2. Snapshot list queries
      const prevQueries = qc
        .getQueriesData({ queryKey: ["posts"] })
        .map(
          ([key, d]) =>
            [key, d ? deepClone(d) : d] as [readonly unknown[], unknown]
        );

      // 3. Snapshot detail post (nếu có)
      const prevDetail = qc.getQueryData<Post>(["post", id]);

      // 4. Optimistic delete: Remove từ list caches (filter posts, giảm total/totalPages)
      prevQueries.forEach(([key, snapshot]) => {
        if (!snapshot || !isPostsResponse(snapshot)) return;

        const oldData = snapshot as PostsResponse;
        const newTotal = oldData.total - 1;
        const newTotalPages = Math.ceil(newTotal / oldData.limit);

        qc.setQueryData(
          key as readonly unknown[],
          {
            ...oldData,
            posts: oldData.posts.filter((post) => post.id !== id), // Remove post nếu tồn tại trong page
            total: newTotal,
            totalPages: newTotalPages,
          } as PostsResponse
        );
      });

      // 5. Remove detail cache
      qc.removeQueries({ queryKey: ["post", id] });

      return { prevQueries, prevDetail };
    },
    onError: (_err, id, context) => {
      // Rollback list
      context?.prevQueries?.forEach(([key, snapshot]) => {
        qc.setQueryData(key as readonly unknown[], snapshot as unknown);
      });
      // Rollback detail (restore nếu có)
      if (context?.prevDetail) {
        qc.setQueryData(["post", id], context.prevDetail);
      }
    },
    onSuccess: (_deletedPost, _id, _context) => {
      navigate(ROUTE_PAGES.POSTS.LIST);
    },
    onSettled: (_data, _error, id, _context) => {
      qc.invalidateQueries({ queryKey: ["posts"] });
      qc.invalidateQueries({ queryKey: ["post", id] });
    },
  });
};
