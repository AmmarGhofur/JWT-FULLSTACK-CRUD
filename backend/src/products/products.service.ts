import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>) {}

  async findAll(): Promise<ProductDocument[]> {
    return this.productModel.find().sort({ createdAt: -1 });
  }

  async findById(id: string): Promise<ProductDocument> {
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async create(createProductDto: CreateProductDto): Promise<ProductDocument> {
    const product = new this.productModel(createProductDto);
    return product.save();
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<ProductDocument> {
    const product = await this.productModel.findByIdAndUpdate(id, updateProductDto, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async delete(id: string): Promise<{ message: string }> {
    const result = await this.productModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException('Product not found');
    }
    return { message: 'Product deleted successfully' };
  }
}
