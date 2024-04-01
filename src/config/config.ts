export default function config() {
  return {
    HOST: process.env.HOST ?? "localhost",
    PORT: process.env.PORT ?? 3000,
    NODE_ENV: process.env.NODE_ENV ?? "development",
  };
}
