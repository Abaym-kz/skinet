import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { IBrand } from '../shared/models/brand';
import { IPagination } from '../shared/models/pagination';
import { Product } from '../shared/models/product';
import { IType } from '../shared/models/productType';
import { ShopParams } from '../shared/models/shopParams';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  baseUrl = 'https://localhost:5001/api/';

  constructor(private http: HttpClient) { }

  getProducts (shopParams: ShopParams)
  {
    let params = new HttpParams();
    if(shopParams.branId !== 0)
    {
      params = params.append('brandId', shopParams.branId.toString());
    }

    if(shopParams.typeId !== 0)
    {
      params = params.append('typeId', shopParams.typeId.toString())
    }

    if(shopParams.search) {
      params = params.append('search', shopParams.search);
    }

    params = params.append('sort', shopParams.sort);
    params = params.append('pageIndex', shopParams.pageNumber.toString());
    params = params.append('pageSize', shopParams.pageSize.toString());

    return this.http.get<IPagination>(this.baseUrl + 'products', {observe: 'response', params})
      .pipe(
        map(response => {
          return response.body;
        })
      )
  }

  getProduct(id: number) {
    return this.http.get<Product>(this.baseUrl + 'products/' + id);
  }

  getBrands ()
  {
    return this.http.get<IBrand[]>(this.baseUrl + 'products/brands')
  }

  getTypes ()
  {
    return this.http.get<IType[]>(this.baseUrl + 'products/types')
  }
}
