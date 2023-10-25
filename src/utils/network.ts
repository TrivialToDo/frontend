import { OkResp, Resp } from "../data/interface";

export const isOk = <T>(resp: Resp<T>): resp is OkResp<T> => 200 <= resp.status && resp.status < 300;

export const upload = async <T>(
  url: string,
  data: { image: File },
  auth: string,
): Promise<Resp<T>> => {
  const form = new FormData();
  form.append("image", data.image);
  const response = await fetch(
    url,
    {
      method: "POST",
      headers: { "Authorization": `Bearer ${auth}` },
      body: form,
    },
  );

  let res;
  try {
    res = await response.json();
  } catch (e) {
    res = null;
  }

  return {
    status: response.status,
    data: res,
  };
};

export const request = async <T>(
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  data?: object | null,
  auth?: string,
): Promise<Resp<T>> => {
  const headers: Record<string, string> = {};

  let body;

  if (method !== "GET" && data) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(data);
  }

  if (typeof auth !== "undefined") {
    headers["Authorization"] = `Bearer ${auth}`;
  }

  const response = await fetch(url, { method, headers, body });

  let res;
  try {
    res = await response.json();
  } catch (e) {
    res = null;
  }

  return {
    status: response.status,
    data: res,
  };
};