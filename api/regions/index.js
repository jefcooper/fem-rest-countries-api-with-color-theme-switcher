import { promises as fs } from "fs";
import { path } from "path";

export default async (request, response) => {
  const dataDir = path.join(process.cwd(), "data");
  const data = await fs.readFile(dataDir + "/regions.json", "utf8");
  const regions = JSON.parse(data);

  response.status(200).json(regions);
};
