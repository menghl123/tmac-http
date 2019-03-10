import {NgModule} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {EtHttpClient, EtInterceptors} from './http';

@NgModule({
  declarations: [],
  imports: [
    HttpClientModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: EtInterceptors,
      multi: true,
    }]
})
export class EtHttpModule {

  constructor(private httpClient: EtHttpClient) {
  }
}
