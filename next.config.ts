import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Notion에 직접 올린 이미지가 저장되는 호스트. 외부 링크 이미지는 호스트가 제각각이라 최적화하지 않는다
    remotePatterns: [
      { protocol: "https", hostname: "prod-files-secure.s3.us-west-2.amazonaws.com" },
      { protocol: "https", hostname: "s3.us-west-2.amazonaws.com" },
      { protocol: "https", hostname: "file.notion.so" },
    ],
  },
};

export default nextConfig;
