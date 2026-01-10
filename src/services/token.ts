import { v4 as uuidv4 } from "uuid";

const encode = (data: string): string => {
  try {
    return btoa(encodeURIComponent(data));
  } catch {
    console.log("Hi 👋 Your token could not be encoded.");
    return "";
  }
};

const decode = (data: string): string => {
  try {
    return decodeURIComponent(atob(data));
  } catch {
    console.log("Hi 👋 Your token could not be decoded.");
    return "";
  }
};

/**
 * Set space token from local storage to URL params and return full shareable url
 * @param url
 * @returns
 */
export const prepareUrlToken = (url: string) => {
  const spaceToken = decode(localStorage.getItem("space_token") || "");

  if (!spaceToken) return url;

  const separator = url.includes("?") ? "&" : "?";

  return `${url}${separator}space_token=${encode(spaceToken)}`;
};

/**
 * Get space token from URL params and remove it from URL
 * @param url
 * @returns
 */
export const extractUrlToken = (url: string) => {
  const urlObj = new URL(url);
  const spaceToken = decode(urlObj.searchParams.get("space_token") || "");

  if (spaceToken) {
    urlObj.searchParams.delete("space_token");
  }

  return spaceToken;
};

/**
 * Get space token from URL params or local storage
 * Sets Token to local storage if found in URL
 * @returns space token or null
 */
export const getSpaceToken = () => {
  const urlDecodedToken = extractUrlToken(window.location.href);

  if (urlDecodedToken) {
    localStorage.setItem("space_token", encode(urlDecodedToken));
    return urlDecodedToken;
  }

  const storedDecodedToken = decode(localStorage.getItem("space_token") || "");

  if (storedDecodedToken) {
    return storedDecodedToken;
  }

  return null;
};

/**
 * Create a new space token and store it in local storage
 * @returns space token
 */
export const createSpaceToken = () => {
  const spaceToken = uuidv4();
  localStorage.setItem("space_token", encode(spaceToken));
  return spaceToken;
};

/**
 * Clear space token from local storage
 */
export const clearSpaceToken = () => {
  localStorage.removeItem("space_token");
};
