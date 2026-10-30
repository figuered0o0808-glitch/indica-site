/**
 * A plataforma publica e exportada dentro do site da agencia, em /plataforma.
 * O painel administrativo continua em seu servidor separado.
 * BASE_PATH vazio permite a previa local sem prefixo.
 */
const basePath = process.env.BASE_PATH ?? '/plataforma';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  basePath,
  assetPrefix: basePath || undefined,
  experimental: { cpus: 2 },
  env: { BASE_PATH: basePath },
};

export default nextConfig;
