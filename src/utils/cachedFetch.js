import { set, get, clear } from "idb-keyval";

const TTL = 10 * 60 * 1000;

function isWithinTTL(timestamp) {
  return Date.now() - timestamp < TTL;
}

export async function cachedFetch(url) {
  const cachedResult = await get(url);
  if (cachedResult && isWithinTTL(cachedResult.timestamp)) {
    console.log("[cachedFetch] cache hit: " + url);
    return { status: cachedResult.status, json: cachedResult.json };
  }
  console.log("[cachedFetch] cache miss: " + url);
  const resp = await fetch(url, {
    credentials:
      process.env.NODE_ENV === "production" ? "same-origin" : "include",
  });
  const status = resp.status;
  if (status === 200) {
    const json = await resp.json();
    const fetchResult = { status, json, timestamp: Date.now() };
    set(url, fetchResult).catch((e) => console.error(e));
    return { status, json };
  } else {
    if (status === 401) {
      clearCache();
    }
    return { status, json: null };
  }
}

export function clearCache() {
  console.log("[cachedFetch] clear cache");
  clear();
}
