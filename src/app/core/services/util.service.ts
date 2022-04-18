import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  constructor() { }

  setLocalStorage(setTo, data) {
    localStorage.setItem(setTo, JSON.stringify(data));
  }

  removeLocalStorage(key) {
    const data = JSON.parse(localStorage.getItem(key));
    if (data) {
      localStorage.removeItem(key);
    }
  }

  getLocalStorage(key, filterKey?: string) {
    const item = JSON.parse(localStorage.getItem(key));
    if (filterKey && item && item[filterKey]) {
      return item[filterKey];
    } else if (filterKey && item && !item[filterKey]) {
      return '';
    } else {
      return item;
    }
  }

  validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
}
