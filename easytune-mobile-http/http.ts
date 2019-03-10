import {EtHttpInterceptor, HttpMethod, HttpObserve, HttpResponseType} from './interface/builder.interface';
import {
  HttpClient,
  HttpEvent,
  HttpEventType,
  HttpHandler,
  HttpHeaderResponse,
  HttpHeaders,
  HttpInterceptor,
  HttpParams,
  HttpProgressEvent,
  HttpRequest,
  HttpResponse,
  HttpSentEvent,
  HttpUserEvent
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {Injectable} from '@angular/core';
import {catchError, map} from 'rxjs/operators';

@Injectable()
export class EtInterceptors implements HttpInterceptor {

  constructor() {
  }

  handleRequest(req: HttpRequest<any>): HttpRequest<any> | void {
    return HttpConfigBuilder.interceptors
      .filter(item => !!item.request)
      .reduce((httpEvent, item) => {
        return (item.request(httpEvent) || httpEvent);
      }, req);
  }

  getHandleResponse(): any {
    return (res, req) => {
      this.handleResponse(res, req);
    };
  }

  handleResponse(response: HttpEvent<any>, request?: HttpRequest<any>): HttpEvent<any> | void {
    return HttpConfigBuilder.interceptors
      .filter(item => !!item.response)
      .reverse()
      .reduce((httpEvent, item) => {
        return item.response(httpEvent, request) || httpEvent;
      }, response);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent
    | HttpResponse<any> | HttpUserEvent<any>> {
    const httpRequest = this.handleRequest(req) as any;
    return next.handle(httpRequest)
      .pipe(map(response => {
          if ([HttpEventType.Response, HttpEventType.ResponseHeader].indexOf(response.type) !== -1) {
            return (this.getHandleResponse()(response, httpRequest) || response);
          }
          return response;
        }),
        catchError(error => throwError(this.handleResponse(error, httpRequest) || error))
      );
  }
}

export class HttpConfigBuilder {
  public static interceptors: EtHttpInterceptor[] = [];
  public static globalBaseUrl: string;

  constructor() {
  }

  public baseUrl(baseUrl: string, excludes: RegExp[] = []): HttpConfigBuilder {
    HttpConfigBuilder.globalBaseUrl = baseUrl;

    HttpConfigBuilder.interceptors.push({
      request: (request: HttpRequest<any>): HttpRequest<any> => {
        if (/^https?:/.test(request.url)) {
          return request;
        }

        const excludeUrl = excludes.some(t => t.test(request.url));
        if (excludeUrl) {
          return request;
        }

        baseUrl = baseUrl.replace(/\/$/, '');
        const url = request.url.replace(/^\//, '');
        return request.clone({url: `${baseUrl}/${url}`});
      }
    });

    return this;
  }

  public addInterceptor(interceptor: EtHttpInterceptor): HttpConfigBuilder {
    HttpConfigBuilder.interceptors.push(interceptor);
    return this;
  }
}

@Injectable({
  providedIn: 'root'
})
export class EtHttpClient {
  public static CLIENT: HttpClient;

  constructor(private httpClient: HttpClient) {
    this.initCore();
  }

  public static builder(): HttpRequestBuilder {
    return new HttpRequestBuilder();
  }

  public static configBuilder(): HttpConfigBuilder {
    return new HttpConfigBuilder();
  }

  private initCore() {
    EtHttpClient.CLIENT = this.httpClient;
  }

}


export class HttpRequestBuilder {
  private httpMethod: HttpMethod;
  private httpUrl: string;

  public options: {
    body?: any;
    headers?: HttpHeaders | {
      [header: string]: string | string[];
    };
    observe?: HttpObserve;
    params?: HttpParams | {
      [param: string]: string | string[];
    };
    reportProgress?: boolean;
    responseType: HttpResponseType;
    withCredentials?: boolean;
  } = {} as any;

  public constructor() {
  }

  url(url: string): HttpRequestBuilder {
    this.httpUrl = url;
    return this;
  }

  body(body: any): HttpRequestBuilder {
    this.options.body = body;
    return this;
  }

  header(key: string, value: any): HttpRequestBuilder {
    (this.options.headers as HttpHeaders).set(key, value);
    return this;
  }

  headers(headers: HttpHeaders | { [p: string]: string | string[] }): HttpRequestBuilder {
    this.options.headers = headers;
    return this;
  }

  observe(observe: HttpObserve): HttpRequestBuilder {
    this.options.observe = observe;
    return this;
  }

  params(params: HttpParams | { [p: string]: string | string[] }): HttpRequestBuilder {
    this.options.params = params;
    return this;
  }

  reportProgress(reportProgress: boolean): HttpRequestBuilder {
    this.options.reportProgress = reportProgress;
    return this;
  }

  responseType(responseType: HttpResponseType): HttpRequestBuilder {
    this.options.responseType = responseType;
    return this;
  }

  withCredentials(withCredentials: boolean): HttpRequestBuilder {
    this.options.withCredentials = withCredentials;
    return this;
  }

  delete<T>(): Observable<T> {
    return this.method(HttpMethod.DELETED);
  }

  get<T>(): Observable<T> {
    return this.method(HttpMethod.GET);
  }

  method<T>(method: HttpMethod): Observable<T> {
    this.httpMethod = method;
    if (!EtHttpClient.CLIENT) {
      throw new Error('etHttpClient is not init');
    }
    if (!this.httpMethod) {
      throw new Error('etHttpClient should request with method');
    }

    if (!this.httpUrl) {
      throw new Error('etHttpClient should request with url');
    }

    return EtHttpClient.CLIENT.request<T>(this.httpMethod, this.httpUrl, this.options as any) as any;
  }

  post<T>(): Observable<T> {
    return this.method(HttpMethod.POST);
  }

  put<T>(): Observable<T> {
    return this.method(HttpMethod.PUT);
  }
}
