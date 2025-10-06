import { queryClient } from "@/lib/react-query";
import { postService } from "@/services/postService";
import { type LoaderFunctionArgs } from "react-router";

export const editPostLoader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.id as string;
  const cachedPost = queryClient.getQueryData(["post", id]);
  if (cachedPost) {
    return cachedPost;
  }
  try {
    const post = await queryClient.fetchQuery({
      queryKey: ["post", id],
      queryFn: () => postService.getPost(id),
    });
    return post;
  } catch (error) {
    throw new Response("Not Found", { status: 404 });
  }
};
