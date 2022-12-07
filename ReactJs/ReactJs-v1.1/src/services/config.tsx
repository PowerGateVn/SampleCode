import axios from "axios";
import config from "containers/config";
import { RESPONSE_STATUS, SYSTEM } from "containers/contants";

export const postService = async (
  url: string,
  body: object,
  messErr = null,
  isAuthorization = true,
  isFormData = false
) => {
  try {
    let headers = isFormData
      ? { "Content-Type": "multipart/form-data" }
      : { Accept: "application/json", "Content-Type": "application/json" };
    if (isAuthorization) headers["Authorization"] = sessionStorage.getItem(SYSTEM.TOKEN);
    const response = await axios.post(`${config.HOST_API}/${url}`, JSON.stringify(body), { headers });
    if (response.status === RESPONSE_STATUS.SUCESS) return response.data;
    if (messErr) throw Error(messErr);
  } catch (error) {
    throw error;
  }
};

export const getService = async (url: string, params: object = null, messErr = null, isAuthorization = true) => {
  try {
    let headers = { Accept: "application/json", "Content-Type": "application/json" };
    let queryString = "";
    if (params) {
      queryString = `?${Object.keys(params)
        .map(key => `${key}=${params[key] || ""}`)
        .join("&")}`;
    }
    if (isAuthorization) headers["Authorization"] = sessionStorage.getItem(SYSTEM.TOKEN);
    const response = await axios.get(`${config.HOST_API}/${url}${queryString}`, { headers });
    if (response.status === RESPONSE_STATUS.SUCESS) return response.data;
    if (messErr) throw Error(messErr);
  } catch (error) {
    throw error;
  }
};
