import { promises as fs } from "fs";

export default async function (request, response) {
  const countriesData = await fs.readFile("api/data/countries.json", "utf8");
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
