let endpoint = "/api/products";

function parseToJson (data) {
  console.log(data);
  return data.json();
}

function stringifyQueryParams (queryParams) {
  return Object.keys(queryParams).map(k => `${k}=${queryParams[k]}`).join("&");
}

function constructUrl (queryParams) {
  let queryString = stringifyQueryParams(queryParams);
  return queryString ? `${endpoint}?${queryString}` : endpoint;
}

export function requestAffiliatesApi (queryParams) {
  console.log(queryParams);
  return fetch(constructUrl(queryParams)).then(parseToJson);
}
