import {message} from 'antd';
import {signOut} from 'next-auth/react';
import {type FetchError, ofetch} from 'ofetch';
import {getBearerToken} from '@/lib/helpers/auth';
import {notify} from '@/lib/hooks/notify';
import type {LooseObject} from '@/lib/types/loose.object';
import type {XhrResponse} from './types/xhr';

export async function fetchErrorHandler(error: FetchError) {
  let msg = error.message ?? 'Something went wrong, please try again';
  const responseCode = error.response?.status as number;

  if (responseCode === 401) {
    message.info('You have been logged out');
    await signOut();
    window.location.href = '/login';
    return Promise.reject(error);
  }

  if (responseCode === 400) {
    const errors = error.response?._data.errors;

    if (errors) {
      msg = errors[Object.keys(errors)[0]][0];
    } else {
      msg = error.response?._data.message;
    }

    notify({
      type: 'warning',
      title: process.env.NEXT_PUBLIC_APP_NAME ?? 'App',
      message: msg,
      duration: 15,
    });

    return Promise.reject(error);
  }

  if (error.response?._data) {
    if (error.response._data) {
      const type = typeof error.response._data;

      // Handle uncontrolled server error
      if (type === 'string') {
        msg = error.response._data;
      }

      // Handle controlled-json error
      if (type === 'object') {
        msg = error.response._data.message;
      }
    }
  }

  notify({
    type: 'error',
    title: process.env.NEXT_PUBLIC_APP_NAME ?? 'App',
    message: msg,
    duration: 15,
  });

  throw error;
}

export async function xhrPost<T>(
  uri: string,
  data: LooseObject | FormData,
  params: LooseObject = {},
  headers: HeadersInit = {},
): Promise<XhrResponse<T>> {
  const opt = {
    method: 'POST',
    body: data,
    params,
    headers: await makeAuthorizationHeader(headers),
  };
  return ofetch(uri, opt).catch(fetchErrorHandler);
}

export async function xhrPut<T>(
  uri: string,
  data: object,
  headers: HeadersInit = {},
): Promise<XhrResponse<T>> {
  const opt = {
    method: 'PUT',
    body: data,
    headers: await makeAuthorizationHeader(headers),
  };
  return ofetch(uri, opt).catch(fetchErrorHandler);
}

export async function xhrPatch<T>(
  uri: string,
  data: LooseObject = {},
  headers: HeadersInit = {},
): Promise<XhrResponse<T>> {
  const opt = {
    method: 'PATCH',
    body: data,
    headers: await makeAuthorizationHeader(headers),
  };
  return ofetch(uri, opt).catch(fetchErrorHandler);
}

export async function xhrGet<T>(
  uri: string,
  params: LooseObject = {},
  headers: HeadersInit = {},
): Promise<XhrResponse<T>> {
  const opt = {
    method: 'GET',
    params,
    headers: await makeAuthorizationHeader(headers),
  };
  return ofetch(uri, opt).catch(fetchErrorHandler);
}

export async function xhrDelete<T>(
  uri: string,
  body: LooseObject = {},
  headers: HeadersInit = {},
): Promise<XhrResponse<T>> {
  const opt = {
    method: 'DELETE',
    body,
    headers: await makeAuthorizationHeader(headers),
  };
  return ofetch(uri, opt).catch(fetchErrorHandler);
}

async function makeAuthorizationHeader(existingHeaders: HeadersInit = {}) {
  if (Object.hasOwn(existingHeaders, 'Authorization')) {
    return existingHeaders;
  }

  const token = getBearerToken();

  if (!token) {
    // await signOut({ redirect: true });
    return {};
  }

  const authHeaders = {Authorization: `Bearer ${getBearerToken()}`};
  return Object.assign(authHeaders, existingHeaders);
}
