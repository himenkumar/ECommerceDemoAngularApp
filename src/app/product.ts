export class Product {
    ProductId: string = '';
    ProductName : string  = '';
    ProductDescription : string ='' ;
    Category : ProductCategory = { CategoryId : '', CategoryName : ''};
    Attributes : ProductAttribute[] = [];
}

export class ProductCategory {
    CategoryId: string = '';
    CategoryName: string = '';
}

export class ProductCategoryAttribute {
    AttributeId: string = '';
    ProductCategory : ProductCategory = { CategoryId : '', CategoryName : ''};;
    AttributeName: string = '';
}

export class ProductAttribute {
    AttributeId: string = '';
    AttributeValue: string = '';
}

