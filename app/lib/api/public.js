import sendRequest from './sendRequest';
const BASE_PATH = 'api/v1/public';

export const getUserApiMethod = (JWTCookie) => {
  if (JWTCookie) {
    return sendRequest(`${BASE_PATH}/get-user`, {
      method: 'get',
      headers: { cookie: JWTCookie },
      withCredentials: true,
    });
  }
  return sendRequest(`${BASE_PATH}/get-user`, {
    method: 'get',
    withCredentials: true,
  });
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
