import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private storage;

  constructor() {
    this.storage = window.localStorage;
  }

  getItem(key:string, defaultValue:string|null=null):string|null{
    return this.storage.getItem(key)??defaultValue;
  }

  setItem(key:string, value:string){
    this.storage.setItem(key,value);
  }
  
clear(){this.storage.clear();}

removeItem(key: string) {
  this.storage.removeItem(key);
}

}
