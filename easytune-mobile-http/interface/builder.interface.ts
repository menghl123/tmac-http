import {HttpErrorResponse, HttpEvent, HttpRequest} from '@angular/common/http';

export enum HttpMethod {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETED = 'delete'
}

export enum HttpObserve {
  HTTP_OBSERVE = 'body',
  EVENTS = 'events',
  RESPONSE = 'response',
}

export enum HttpResponseType {
  ARRAY_BUFFER = 'arraybuffer',
  BLOB = 'blob',
  TEXT = 'text',
  JSON = 'json',
}

export interface EtHttpInterceptor {
  request?: (option: HttpRequest<any>) => HttpRequest<any> | void;
  response?: (response: HttpEvent<any> | HttpErrorResponse, request?: HttpRequest<any>) => HttpEvent<any> | void;
}


