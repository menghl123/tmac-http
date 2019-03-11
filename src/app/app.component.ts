import {Component} from '@angular/core';
import {EtHttpClient} from '../../easytune-mobile-http/http';
import {NzNotificationService} from 'ng-zorro-antd';
import {StorageService} from '../storage.service';
import {Optional} from '../../stream-js/optional/optional';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private AUTHORIZATION = 'Authorization';

  constructor(private notification: NzNotificationService,
              private storageService: StorageService) {
    const a = Optional.ofNullable<AppComponent>(null)
      .orElse(this);
    console.log(a);

    EtHttpClient.configBuilder()
      .baseUrl('http://localhost:8080/api')
      .addInterceptor({
        request: (req) => {
          console.log(req);
        },
        response: (res) => {
          console.log(res);
        }
      })
      .addInterceptor({
        request: (req) => {
          const authorization = this.storageService.get(this.AUTHORIZATION);
          if (authorization) {
            return req.clone({headers: req.headers.set('Authorization', authorization)});
          }
        },
        response: (res: any) => {
          const authorization = res.headers.get(this.AUTHORIZATION);
          if (authorization) {
            this.storageService.save(this.AUTHORIZATION, authorization);
          }
        }
      });
  }

  login() {
    EtHttpClient.builder()
      .url('/login')
      .body({
        account: 'zhangsan',
        password: '123456'
      })
      .post()
      .subscribe((res) => {
        this.notification.blank('访问成功', JSON.stringify(res)
        );
      });
  }

  getMenus() {
    EtHttpClient.builder()
      .url('http://localhost:8080/api/menus')
      .params(
        {
          page: 1 + '',
          size: 10 + '',
          parentId: '',
          name: '',
          url: ''
        }
      )
      .get()
      .subscribe(res => {
        this.notification.blank('访问成功', JSON.stringify(res));
      });
  }
}
