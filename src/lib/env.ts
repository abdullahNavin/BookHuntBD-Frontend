if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined. Check your .env.local file.");
}

if (!process.env.NEXT_PUBLIC_APP_NAME) {
  throw new Error("NEXT_PUBLIC_APP_NAME is not defined. Check your .env.local file.");
}

export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL,
  appName: process.env.NEXT_PUBLIC_APP_NAME,
} as const;
