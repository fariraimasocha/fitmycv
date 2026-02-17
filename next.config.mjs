/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ["@phosphor-icons/react", "lucide-react", "radix-ui", "motion"],
  },
};

export default nextConfig;
