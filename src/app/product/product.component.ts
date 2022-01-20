import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ProductService } from '../product.service';
import { Product } from '../product';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource, } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';

interface ProductCategory {
  CategoryId: string;
  CategoryName: string;
}

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  dataSaved = false;
  productForm: any;
  allProducts!: Observable<Product[]>;
  dataSource!: MatTableDataSource<Product>;
  selection = new SelectionModel<Product>(true, []);
  productIdUpdate = null;
  massage = null;
  allProductCategory!: Observable<ProductCategory[]>;
  ProductCategoryId = '';
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  displayedColumns: string[] = [ 'ProductName', 'ProductDescription', 'ProductCategory', 'Edit', 'Delete'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private formbulider: FormBuilder, 
    private productService: ProductService, 
    private _snackBar: MatSnackBar, 
    public dialog: MatDialog) 
    {
      this.productService.getProducts().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  ngOnInit(): void {
    this.productForm = this.formbulider.group({
      ProductName: ['', [Validators.required]],
      ProductDescription: ['', [Validators.required]],
      ProductCategory: ['', [Validators.required]],
    });    
    this.fillProductCategoryDDL()
    this.loadAllProducts();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadAllProducts() {
    this.productService.getProducts().subscribe(data => {
      debugger;
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  fillProductCategoryDDL() {
    this.allProductCategory =  this.productService.getProductCategories(); 
  }

  OnProductCategorySelectionChange(SelProductCategoryId : any) {
    this.ProductCategoryId = SelProductCategoryId.value
  }

  loadProductToEdit(productId: string) {
    this.productService.getProduct(productId).subscribe(product => {
      this.massage = null;
      this.dataSaved = false;
      this.productIdUpdate =   JSON.parse(product.ProductId);
      this.productForm.controls['ProductName'].setValue(product.ProductName);
      this.productForm.controls['ProductDescription'].setValue(product.ProductDescription);      
      this.productForm.controls['ProductCategory'].setValue(product.Category.CategoryId);      
      this.ProductCategoryId = product.Category.CategoryId;
    });

  }

  onFormSubmit() {
    this.dataSaved = false;
    const product = this.productForm.value;
    this.createProduct(product);
    this.productForm.reset();
  }  

  createProduct(product: Product) {
    
    if (this.productIdUpdate == null) 
    {
      
      product.Category =  { CategoryId : this.ProductCategoryId, CategoryName:''  } 

      this.productService.createProduct(product).subscribe(
        () => {
          this.dataSaved = true;
          this.SavedSuccessful(1);
          this.loadAllProducts();
          this.productIdUpdate = null;
          this.productForm.reset();
        }
      );
    } else 
    {
      product.ProductId = this.productIdUpdate;
      product.Category =  { CategoryId : this.ProductCategoryId, CategoryName:''  }
      this.productService.updateProduct(product).subscribe(() => {
        this.dataSaved = true;
        this.SavedSuccessful(0);
        this.loadAllProducts();
        this.productIdUpdate = null;
        this.productForm.reset();
      });
    }
  }

  deleteProduct(productId: string) {
    if (confirm("Are you sure you want to delete this ?")) {
      this.productService.deleteProduct(productId).subscribe(() => {
        this.dataSaved = true;
        this.SavedSuccessful(2);
        this.loadAllProducts();
        this.productIdUpdate = null;
        this.productForm.reset();
      });
    }
  }

  resetForm() {
    this.productForm.reset();
    this.massage = null;
    this.dataSaved = false;    
    this.loadAllProducts();
  }

  SavedSuccessful(isUpdate : any) {
    if (isUpdate == 0) {
      this._snackBar.open('Record Updated Successfully!', 'Close', {
        duration: 2000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
    else if (isUpdate == 1) {
      this._snackBar.open('Record Saved Successfully!', 'Close', {
        duration: 2000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
    else if (isUpdate == 2) {
      this._snackBar.open('Record Deleted Successfully!', 'Close', {
        duration: 2000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
  }

}
