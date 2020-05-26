import sendRequest from './sendRequest';
import axios from 'axios';

const BASE_PATH = 'api/v1/team-member';

export const getSignedRequestApiMethod = (data) => {
  return sendRequest(`${BASE_PATH}/aws/get-signed-request-for-upload-to-s3`, {
    method: 'post',
    data,
  });
};

export const uploadUsingSignedRequestApiMethod = (
  signedRequestUrl,
  file,
  fileType
) => {
  return axios.put(signedRequestUrl, file, {
    headers: { 'Content-Type': fileType },
  });
};
