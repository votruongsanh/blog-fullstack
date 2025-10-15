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

export interface RegisterDto {
  /**
   * User email address / 사용자 이메일 주소
   * @example "user@example.com"
   */
  email: string;
  /**
   * User password / 사용자 비밀번호
   * @minLength 6
   * @example "password123"
   */
  password: string;
  /**
   * User name / 사용자 이름
   * @minLength 2
   * @example "John Doe"
   */
  name: string;
}

export interface UserResponseDto {
  /**
   * User ID / 사용자 ID
   * @example "1234567890"
   */
  id: string;
  /**
   * User email / 사용자 이메일
   * @example "user@example.com"
   */
  email: string;
  /**
   * User name / 사용자 이름
   * @example "John Doe"
   */
  name: string;
  /**
   * User creation date / 사용자 생성 날짜
   * @format date-time
   * @example "2024-01-01T00:00:00.000Z"
   */
  createdAt: string;
  /**
   * User last update date / 사용자 마지막 업데이트 날짜
   * @format date-time
   * @example "2024-01-01T00:00:00.000Z"
   */
  updatedAt: string;
}

export interface AuthResponseDto {
  /**
   * JWT access token / JWT 액세스 토큰
   * @example "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   */
  accessToken: string;
  /** User information / 사용자 정보 */
  user: UserResponseDto;
}

export interface LoginDto {
  /**
   * User email address / 사용자 이메일 주소
   * @example "user@example.com"
   */
  email: string;
  /**
   * User password / 사용자 비밀번호
   * @minLength 6
   * @example "password123"
   */
  password: string;
}

export interface BulkCreatePostsDto {
  /**
   * Base title for posts / 게시물의 기본 제목
   * @minLength 1
   * @maxLength 200
   * @example "Sample Post"
   */
  title: string;
  /**
   * Base content for posts / 게시물의 기본 내용
   * @minLength 1
   * @maxLength 5000
   * @example "This is the content of the post."
   */
  content: string;
  /**
   * Number of posts to create / 생성할 게시물 수
   * @min 1
   * @max 100
   * @default 100
   * @example 100
   */
  count?: number;
}

export interface PostResponseDto {
  /**
   * Post ID / 게시물 ID
   * @example "1234567890"
   */
  id: string;
  /**
   * Post title / 게시물 제목
   * @example "My First Post"
   */
  title: string;
  /**
   * Post content / 게시물 내용
   * @example "This is the content of my first post."
   */
  content: string;
  /**
   * Author ID / 작성자 ID
   * @example "1234567890"
   */
  authorId: string;
  /**
   * Post creation date / 게시물 생성 날짜
   * @format date-time
   * @example "2024-01-01T00:00:00.000Z"
   */
  createdAt: string;
  /**
   * Post last update date / 게시물 마지막 업데이트 날짜
   * @format date-time
   * @example "2024-01-01T00:00:00.000Z"
   */
  updatedAt: string;
}

export interface BulkCreatePostsResponseDto {
  /** Array of created posts / 생성된 게시물 배열 */
  posts: PostResponseDto[];
  /**
   * Number of posts created / 생성된 게시물 수
   * @example 100
   */
  count: number;
  /**
   * Success message / 성공 메시지
   * @example "Successfully created 100 posts / 100개의 게시물이 성공적으로 생성되었습니다"
   */
  message: string;
}

export interface CreatePostDto {
  /**
   * Post title / 게시물 제목
   * @minLength 1
   * @maxLength 200
   * @example "My First Post"
   */
  title: string;
  /**
   * Post content / 게시물 내용
   * @minLength 1
   * @maxLength 5000
   * @example "This is the content of my first post."
   */
  content: string;
}

export interface PostWithAuthorResponseDto {
  /**
   * Post ID / 게시물 ID
   * @example "1234567890"
   */
  id: string;
  /**
   * Post title / 게시물 제목
   * @example "My First Post"
   */
  title: string;
  /**
   * Post content / 게시물 내용
   * @example "This is the content of my first post."
   */
  content: string;
  /**
   * Author ID / 작성자 ID
   * @example "1234567890"
   */
  authorId: string;
  /**
   * Post creation date / 게시물 생성 날짜
   * @format date-time
   * @example "2024-01-01T00:00:00.000Z"
   */
  createdAt: string;
  /**
   * Post last update date / 게시물 마지막 업데이트 날짜
   * @format date-time
   * @example "2024-01-01T00:00:00.000Z"
   */
  updatedAt: string;
  /**
   * Author information / 작성자 정보
   * @example {"id":"1234567890","name":"John Doe","email":"user@example.com"}
   */
  author: object;
}

export interface PaginatedPostsResponseDto {
  /** Array of posts / 게시물 배열 */
  posts: PostWithAuthorResponseDto[];
  /**
   * Total number of posts / 전체 게시물 수
   * @example 1000
   */
  total: number;
  /**
   * Current page number / 현재 페이지 번호
   * @min 1
   * @max 100
   * @example 1
   */
  page: number;
  /**
   * Number of posts per page / 페이지당 게시물 수
   * @min 1
   * @max 50
   * @example 10
   */
  limit: number;
  /**
   * Total number of pages / 전체 페이지 수
   * @example 100
   */
  totalPages: number;
  /**
   * Whether there is a next page / 다음 페이지 존재 여부
   * @example true
   */
  hasNextPage: boolean;
  /**
   * Whether there is a previous page / 이전 페이지 존재 여부
   * @example false
   */
  hasPrevPage: boolean;
}

export interface UpdatePostDto {
  /**
   * Post title / 게시물 제목
   * @minLength 1
   * @maxLength 200
   * @example "My First Post"
   */
  title?: string;
  /**
   * Post content / 게시물 내용
   * @minLength 1
   * @maxLength 5000
   * @example "This is the content of my first post."
   */
  content?: string;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem)
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<T> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance
      .request({
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type ? { "Content-Type": type } : {}),
        },
        params: query,
        responseType: responseFormat,
        data: body,
        url: path,
      })
      .then((response) => response.data);
  };
}

/**
 * @title HCMC Workshop API
 * @version 1.0
 * @contact
 *
 * HyperX HCMC Development Team RESTful API Sample
 */
export class Api<SecurityDataType extends unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  api = {
    /**
     * @description Create a new user account with email, password, and name / 이메일, 비밀번호, 이름으로 새 사용자 계정을 생성합니다
     *
     * @tags Authentication / 인증
     * @name AuthControllerRegister
     * @summary Register a new user / 새 사용자 등록
     * @request POST:/api/v1/auth/register
     */
    authControllerRegister: (data: RegisterDto, params: RequestParams = {}) =>
      this.http.request<AuthResponseDto, void>({
        path: `/api/v1/auth/register`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Authenticate user with email and password / 이메일과 비밀번호로 사용자를 인증합니다
     *
     * @tags Authentication / 인증
     * @name AuthControllerLogin
     * @summary Login user / 사용자 로그인
     * @request POST:/api/v1/auth/login
     */
    authControllerLogin: (data: LoginDto, params: RequestParams = {}) =>
      this.http.request<AuthResponseDto, void>({
        path: `/api/v1/auth/login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Create multiple posts in bulk (default: 100 posts, max: 100 posts) / 대량으로 게시물을 생성합니다 (기본: 100개, 최대: 100개)
     *
     * @tags Posts / 게시물
     * @name PostsControllerBulkCreatePosts
     * @summary Create multiple posts in bulk / 대량 게시물 생성
     * @request POST:/api/v1/posts/bulk
     * @secure
     */
    postsControllerBulkCreatePosts: (
      data: BulkCreatePostsDto,
      params: RequestParams = {}
    ) =>
      this.http.request<BulkCreatePostsResponseDto, void>({
        path: `/api/v1/posts/bulk`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Create a new post with title and content / 제목과 내용으로 새 게시물을 생성합니다
     *
     * @tags Posts / 게시물
     * @name PostsControllerCreatePost
     * @summary Create a new post / 새 게시물 생성
     * @request POST:/api/v1/posts
     * @secure
     */
    postsControllerCreatePost: (
      data: CreatePostDto,
      params: RequestParams = {}
    ) =>
      this.http.request<PostResponseDto, void>({
        path: `/api/v1/posts`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Get all posts with pagination (max 100 pages, max 50 items per page) / 페이지네이션으로 모든 게시물을 조회합니다 (최대 100페이지, 페이지당 최대 50개 항목)
     *
     * @tags Posts / 게시물
     * @name PostsControllerGetAllPosts
     * @summary Get all posts with pagination / 페이지네이션으로 모든 게시물 조회
     * @request GET:/api/v1/posts
     * @secure
     */
    postsControllerGetAllPosts: (
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
      params: RequestParams = {}
    ) =>
      this.http.request<PaginatedPostsResponseDto, void>({
        path: `/api/v1/posts`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Get a specific post by its ID / ID로 특정 게시물을 조회합니다
     *
     * @tags Posts / 게시물
     * @name PostsControllerGetPostById
     * @summary Get post by ID / ID로 게시물 조회
     * @request GET:/api/v1/posts/{id}
     * @secure
     */
    postsControllerGetPostById: (id: string, params: RequestParams = {}) =>
      this.http.request<PostWithAuthorResponseDto, void>({
        path: `/api/v1/posts/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Update a post by its ID (only the author can update) / ID로 게시물을 업데이트합니다 (작성자만 가능)
     *
     * @tags Posts / 게시물
     * @name PostsControllerUpdatePost
     * @summary Update post / 게시물 업데이트
     * @request PATCH:/api/v1/posts/{id}
     * @secure
     */
    postsControllerUpdatePost: (
      id: string,
      data: UpdatePostDto,
      params: RequestParams = {}
    ) =>
      this.http.request<PostResponseDto, void>({
        path: `/api/v1/posts/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Delete a post by its ID (only the author can delete) / ID로 게시물을 삭제합니다 (작성자만 가능)
     *
     * @tags Posts / 게시물
     * @name PostsControllerDeletePost
     * @summary Delete post / 게시물 삭제
     * @request DELETE:/api/v1/posts/{id}
     * @secure
     */
    postsControllerDeletePost: (id: string, params: RequestParams = {}) =>
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
      }),

    /**
     * @description Get all posts created by the current user / 현재 사용자가 생성한 모든 게시물을 조회합니다
     *
     * @tags Posts / 게시물
     * @name PostsControllerGetMyPosts
     * @summary Get my posts / 내 게시물 조회
     * @request GET:/api/v1/posts/my/posts
     * @secure
     */
    postsControllerGetMyPosts: (params: RequestParams = {}) =>
      this.http.request<PostResponseDto[], void>({
        path: `/api/v1/posts/my/posts`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
}
