export default defineEventHandler(async (event) => {
  const url = getRequestURL(event);
  const queryParams = new URLSearchParams(url.search || "");

  return {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: url.href,
      queryParams: Object.fromEntries(queryParams),
    }),
  };
});
