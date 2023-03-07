import * as url from "url";
import path from "path";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

export const frontend = path.join(__dirname, "../../sql-sessions-frontend");
export const filesPath = path.join(__dirname, "../../sql-sessions-files");
