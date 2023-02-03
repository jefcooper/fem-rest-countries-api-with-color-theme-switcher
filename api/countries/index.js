import { promises as fs } from "fs";
import path from "path";

export default async function (request, response) {
  const dataDir = path.join(process.cwd(), "data");
  const countriesData = await fs.readFile(dataDir + "/countries.json", "utf8");
  const data = JSON.parse(countriesData);

  let result;

  if (request.query.search) {
    const filtered = Object.entries(data)
      .filter(([key, [value]]) =>
        key.toLowerCase().includes(request.query.search)
      )
      .map(([key, [value]]) => [key, value]);
    const startsWith = filtered.filter(([key, value]) =>
      key.toLocaleLowerCase().startsWith(request.query.search)
    );
    const notStartsWith = filtered.filter(
      ([key, value]) =>
        !key.toLocaleLowerCase().startsWith(request.query.search)
    );
    result = startsWith.concat(notStartsWith);
  } else {
    result = Object.entries(data).map(([key, [value]]) => [key, value]);
  }
  response.status(200).json(result);
}
