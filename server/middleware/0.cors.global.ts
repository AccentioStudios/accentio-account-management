export default defineEventHandler(async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*",
    "Access-Control-Allow-Headers": "*",
    "Cache-Control": "s-maxage=1",
    Age: "0",
  };
  setHeaders(event, headers);
});
