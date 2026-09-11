import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX({
  agentRules: false,
});

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: '/history', destination: '/history/business', permanent: false },
      { source: '/design', destination: '/design/constraint', permanent: false },
      { source: '/foundations', destination: '/design/foundations', permanent: true },
      { source: '/foundations/', destination: '/design/foundations', permanent: true },
    ];
  },
};

export default withMDX(config);
