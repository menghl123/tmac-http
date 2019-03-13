import {Component} from '@angular/core';
import {EtHttpClient} from '../../easytune-mobile-http/http';
import {NzNotificationService} from 'ng-zorro-antd';
import {StorageService} from '../storage.service';
import {Optional} from '../../projects/stream-js/src/lib/optional/optional';
import {Stream} from 'stream-ts';
import {NumberUtils} from '../../projects/stream-ts/src/lib/utils/number.utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private AUTHORIZATION = 'Authorization';

  constructor(private notification: NzNotificationService,
              private storageService: StorageService) {

    console.log(NumberUtils.randomInteger(1, 10));

    const a = Optional.ofNullable<AppComponent>(null)
      .orElse(this);
    console.log(a);

    Stream.of([0, 1, 2, 3, 4])
      .limit(3)
      .forEach(item => console.log(item));

    Stream.of([0, 1, 2, 3, 4])
      .skip(2)
      .forEach(item => console.log(item));


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
