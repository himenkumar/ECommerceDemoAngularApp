import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductAttribute,ProductCategory, ProductCategoryAttribute } from './product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  url = 'https://localhost:44384';
  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.url + '/products');
  }

  getProduct(productId: string): Observable<Product> {
    return this.http.get<Product>(this.url + '/product/' + productId);
  }

  createProduct(product: Product): Observable<Product> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<Product>(this.url + '/products', product, httpOptions);
  }

  updateProduct(product: Product): Observable<Product> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.put<Product>(this.url + '/product/' +product.ProductId ,product, httpOptions);
  }

  deleteProduct(productId: string): Observable<number> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.delete<number>(this.url + '/product/' + productId,httpOptions);
  }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.http.get<ProductCategory[]>(this.url + '/product-categories');
  }

}
