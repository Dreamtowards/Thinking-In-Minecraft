import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX({
  agentRules: false,
});

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  async redirects() {
    return [
    ];
  },
};

export default withMDX(config);

import('@opennextjs/cloudflare').then((m) => m.initOpenNextCloudflareForDev());
