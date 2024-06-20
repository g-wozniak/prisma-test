alter table "public"."posts" drop constraint "posts_blogId_key";

drop index if exists "public"."posts_blogId_key";


