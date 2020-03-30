const baseURL = 'http://localhost:8080/dev';

export function get(url) {
  return fetch(baseURL + url, {
    method : 'GET',
    mode   : 'cors'
  }).then((res) => {
    return res.json();
  }).then((res) => {
    return res;
  }).catch((err) => {
    console.log('error: ', err);
  });
}

export function post(url, { ...params }) {
  return fetch(baseURL + url, {
    method : 'POST',
    mode   : 'cors',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
    body   : JSON.stringify(params)
  }).then((res) => {
    return res.json();
  }).then((res) => {
    return res;
  }).catch((err) => {
    console.log('error: ', err);
  });
}

export function put(url, { ...params }) {
  return fetch(baseURL + url, {
    method : 'PUT',
    mode   : 'cors',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
    body   : JSON.stringify(params)
  }).then((res) => {
    return res.json();
  }).then((res) => {
    return res;
  }).catch((err) => {
    console.log('error: ', err);
  });
}

export function remove(url, { ...params }) {
  return fetch(baseURL + url, {
    method : 'DELETE',
    mode   : 'cors',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
    body   : JSON.stringify(params)
  }).then((res) => {
    return res.json();
  }).then((res) => {
    return res;
  }).catch((err) => {
    console.log('error: ', err);
  });
}

const request = {
  get,
  post,
  put,
  delete: remove
};

export default request;
