export async function getSortedPostsData() {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts");

  return res.json();
}