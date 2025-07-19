import dotenv from "dotenv";
import path from "path";

const stage = process.env.SLS_STAGE || process.env.STAGE || "staging";

dotenv.config({
  path: path.resolve(process.cwd(), `.env.${stage}`)
});
