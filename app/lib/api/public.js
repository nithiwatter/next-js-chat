import sendRequest from './sendRequest';

const BASE_PATH = 'api/v1/public';

export const getUser = () => {
  return sendRequest(`${BASE_PATH}/get-user`, { method: 'get' });
};
