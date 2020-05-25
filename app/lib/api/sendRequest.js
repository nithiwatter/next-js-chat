import axios from 'axios';

export default async function sendRequest(path, opts) {
  // opts will contain methods, data (if post), and other options
  const qs = opts.qs || '';
  const config = {
    headers: { ...opts.headers },
    method: opts.method,
    data: opts.data,
  };

  config.url = `${process.env.URL_API}/${path}/${qs}`;
  console.log(config.url);
  const response = await axios(config);

  return response.data;
}
