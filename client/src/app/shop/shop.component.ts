import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Brand } from '../shared/models/brand';
import { Product } from '../shared/models/product';
import { Type } from '../shared/models/productType';
import { ShopParams } from '../shared/models/shopParams';
import { ShopService } from './shop.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  @ViewChild('search', {static: false}) searchTerm: ElementRef;
  products: Product[];
  brands: Brand[];
  types: Type[];
  shopParams: ShopParams;
  totalCount: number;
  sortOptions = [
    {name: 'Alphabetical', value: 'name'},
    {name: 'Price: Low to High', value: 'priceAsc'},
    {name: 'Price: High to Low', value: 'priceDesc'}
  ];

  constructor(private shopService: ShopService) {
    this.shopParams = shopService.getShopParams();
   }

  ngOnInit(): void
  {
    this.getProducts();
    this.getBrands();
    this.getTypes();
  }

  getProducts()
  {
    this.shopService.getProducts().subscribe(response =>
      {
        this.products = response.data;
        this.totalCount = response.count;
      }, error =>
      {
        console.log(error);
      });
  }

  getBrands()
  {
    this.shopService.getBrands().subscribe(response =>
      {
        this.brands = [{id: 0, name: 'All'}, ...response];
      }, error =>
      {
        console.log(error);
      });
  }

  getTypes()
  {
    this.shopService.getTypes().subscribe(response =>
      {
        this.types = [{id: 0, name: 'All'}, ...response];
      }, error =>
      {
        console.log(error);
      });
  }

  onBrandSelected(brandId: number) {
    const params=this.shopService.getShopParams();
    params.branId = brandId;
    params.pageNumber = 1;
    this.shopService.setShopParams(params);
    this.shopParams = params;
    this.getProducts()
  }

  onTypeSelected(typeId: number) {
    const params=this.shopService.getShopParams();
    params.typeId = typeId;
    params.pageNumber = 1;
    this.shopService.setShopParams(params);
    this.shopParams = params;
    this.getProducts();
  }

  onSortSelected(sort: string) {
    const params=this.shopService.getShopParams();
    params.sort = sort;
    this.shopService.setShopParams(params);
    this.shopParams = params;
    this.getProducts();
  }

  onPageChanged(event: any) {
    const params=this.shopService.getShopParams();
    if(params.pageNumber !== event) {
      params.pageNumber = event;
      this.shopService.setShopParams(params);
      this.shopParams = params;
      this.getProducts();
    }
  }

  onSearch() {
    const params=this.shopService.getShopParams();
    params.search = this.searchTerm.nativeElement.value;
    params.pageNumber = 1;
    this.shopService.setShopParams(params);
    this.shopParams = params;
    this.getProducts();
  }

  onReset() {
    if (this.searchTerm) this.searchTerm.nativeElement.value = '';
    this.shopParams = new ShopParams();
    this.shopService.setShopParams(this.shopParams);
    this.getProducts();
  }

}
