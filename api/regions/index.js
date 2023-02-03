import { promises as fs } from "fs";

export default async (request, response) => {
  const data = await fs.readFile("data/regions.json", "utf8");
  const regions = JSON.parse(data);

  response.status(200).json(regions);
};
