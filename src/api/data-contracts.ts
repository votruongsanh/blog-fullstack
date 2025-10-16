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
