import "dotenv/config";
import app from "./app.ts";
import { logger } from "./utils/logger.ts";

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => logger.info(`listening on port ${PORT}`));
