import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default nextConfig;
module.exports = {
  webpack: (config: any) => {
    config.module.rules.push({
      test: /\.glsl$/,
      type: "asset/source",
    });
    return config;
  },
};
