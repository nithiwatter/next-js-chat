import sendRequest from './sendRequest';
const BASE_PATH = 'api/v1/public';

export const getUser = () => {
  return sendRequest(`${BASE_PATH}/get-user`, { method: 'get' });
};

export const getUserBySlugApiMethod = (slug) => {
  return sendRequest(`${BASE_PATH}/get-user-by-slug`, {
    method: 'post',
    data: { slug },
  });
};

export const updateProfileApiMethod = (data) => {
  return sendRequest(`${BASE_PATH}/user/update-profile`, {
    method: 'post',
    data,
  });
};
