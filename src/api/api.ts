/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

import {
  AuthResponseDto,
  BulkCreatePostsDto,
  BulkCreatePostsResponseDto,
  CreatePostDto,
  LoginDto,
  PaginatedPostsResponseDto,
  PostResponseDto,
  PostWithAuthorResponseDto,
  RegisterDto,
  UpdatePostDto,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Api<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description Create a new user account with email, password, and name / 이메일, 비밀번호, 이름으로 새 사용자 계정을 생성합니다
   *
   * @tags Authentication / 인증
   * @name AuthControllerRegister
   * @summary Register a new user / 새 사용자 등록
   * @request POST:/api/v1/auth/register
   */
  authControllerRegister = (data: RegisterDto, params: RequestParams = {}) =>
    this.http.request<AuthResponseDto, void>({
      path: `/api/v1/auth/register`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Authenticate user with email and password / 이메일과 비밀번호로 사용자를 인증합니다
   *
   * @tags Authentication / 인증
   * @name AuthControllerLogin
   * @summary Login user / 사용자 로그인
   * @request POST:/api/v1/auth/login
   */
  authControllerLogin = (data: LoginDto, params: RequestParams = {}) =>
    this.http.request<AuthResponseDto, void>({
      path: `/api/v1/auth/login`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Create multiple posts in bulk (default: 100 posts, max: 100 posts) / 대량으로 게시물을 생성합니다 (기본: 100개, 최대: 100개)
   *
   * @tags Posts / 게시물
   * @name PostsControllerBulkCreatePosts
   * @summary Create multiple posts in bulk / 대량 게시물 생성
   * @request POST:/api/v1/posts/bulk
   * @secure
   */
  postsControllerBulkCreatePosts = (
    data: BulkCreatePostsDto,
    params: RequestParams = {},
  ) =>
    this.http.request<BulkCreatePostsResponseDto, void>({
      path: `/api/v1/posts/bulk`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Create a new post with title and content / 제목과 내용으로 새 게시물을 생성합니다
   *
   * @tags Posts / 게시물
   * @name PostsControllerCreatePost
   * @summary Create a new post / 새 게시물 생성
   * @request POST:/api/v1/posts
   * @secure
   */
  postsControllerCreatePost = (
    data: CreatePostDto,
    params: RequestParams = {},
  ) =>
    this.http.request<PostResponseDto, void>({
      path: `/api/v1/posts`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Get all posts with pagination (max 100 pages, max 50 items per page) / 페이지네이션으로 모든 게시물을 조회합니다 (최대 100페이지, 페이지당 최대 50개 항목)
   *
   * @tags Posts / 게시물
   * @name PostsControllerGetAllPosts
   * @summary Get all posts with pagination / 페이지네이션으로 모든 게시물 조회
   * @request GET:/api/v1/posts
   * @secure
   */
  postsControllerGetAllPosts = (
    query?: {
      /**
       * Page number / 페이지 번호
       * @min 1
       * @max 100
       * @default 1
       * @example 1
       */
      page?: number;
      /**
       * Number of items per page / 페이지당 항목 수
       * @min 1
       * @max 50
       * @default 10
       * @example 10
       */
      limit?: number;
    },
    params: RequestParams = {},
  ) =>
    this.http.request<PaginatedPostsResponseDto, void>({
      path: `/api/v1/posts`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Get a specific post by its ID / ID로 특정 게시물을 조회합니다
   *
   * @tags Posts / 게시물
   * @name PostsControllerGetPostById
   * @summary Get post by ID / ID로 게시물 조회
   * @request GET:/api/v1/posts/{id}
   * @secure
   */
  postsControllerGetPostById = (id: string, params: RequestParams = {}) =>
    this.http.request<PostWithAuthorResponseDto, void>({
      path: `/api/v1/posts/${id}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Update a post by its ID (only the author can update) / ID로 게시물을 업데이트합니다 (작성자만 가능)
   *
   * @tags Posts / 게시물
   * @name PostsControllerUpdatePost
   * @summary Update post / 게시물 업데이트
   * @request PATCH:/api/v1/posts/{id}
   * @secure
   */
  postsControllerUpdatePost = (
    id: string,
    data: UpdatePostDto,
    params: RequestParams = {},
  ) =>
    this.http.request<PostResponseDto, void>({
      path: `/api/v1/posts/${id}`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Delete a post by its ID (only the author can delete) / ID로 게시물을 삭제합니다 (작성자만 가능)
   *
   * @tags Posts / 게시물
   * @name PostsControllerDeletePost
   * @summary Delete post / 게시물 삭제
   * @request DELETE:/api/v1/posts/{id}
   * @secure
   */
  postsControllerDeletePost = (id: string, params: RequestParams = {}) =>
    this.http.request<
      {
        /** @example "Post deleted successfully / 게시물이 성공적으로 삭제되었습니다" */
        message?: string;
      },
      void
    >({
      path: `/api/v1/posts/${id}`,
      method: "DELETE",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Get all posts created by the current user / 현재 사용자가 생성한 모든 게시물을 조회합니다
   *
   * @tags Posts / 게시물
   * @name PostsControllerGetMyPosts
   * @summary Get my posts / 내 게시물 조회
   * @request GET:/api/v1/posts/my/posts
   * @secure
   */
  postsControllerGetMyPosts = (params: RequestParams = {}) =>
    this.http.request<PostResponseDto[], void>({
      path: `/api/v1/posts/my/posts`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
}
