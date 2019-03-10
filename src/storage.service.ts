import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private storage = sessionStorage;

  save(key: string, value: any) {
    this.storage.setItem(key, JSON.stringify(value));
  }

  get(key: string) {
    return JSON.parse(this.storage.getItem(key));
  }

  remove(key: string) {
    return this.storage.removeItem(key);
  }

  clear() {
    return this.storage.clear();
  }

}
