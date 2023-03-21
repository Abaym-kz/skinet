import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Order } from '../shared/models/order';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  baseurl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getOrdersForUser() {
    return this.http.get<Order[]>(this.baseurl + 'orders');
  }

  getOrderDetailed(id: number) {
    return this.http.get<Order>(this.baseurl + 'orders/' + id);
  }
}
