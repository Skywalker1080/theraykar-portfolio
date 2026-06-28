import { test, expect } from "bun:test";
import { getAllPosts, getPost } from "./blog";

test("getAllPosts returns at least the starter post", () => {
  const posts = getAllPosts();
  expect(posts.length).toBeGreaterThan(0);
});

test("getAllPosts is sorted newest-first by date", () => {
  const posts = getAllPosts();
  for (let i = 1; i < posts.length; i++) {
    expect(posts[i - 1].date >= posts[i].date).toBe(true);
  }
});

test("every post has valid required frontmatter", () => {
  for (const p of getAllPosts()) {
    expect(p.title.length).toBeGreaterThan(0);
    expect(p.slug.length).toBeGreaterThan(0);
    expect(p.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(typeof p.description).toBe("string");
  }
});

test("getPost returns content + matching title for a known slug", () => {
  const post = getPost("hello-blog");
  expect(post).not.toBeNull();
  expect(post!.title).toBe("Hello, Blog");
  expect(post!.content.length).toBeGreaterThan(0);
});

test("getPost returns null for an unknown slug", () => {
  expect(getPost("does-not-exist-xyz")).toBeNull();
});
