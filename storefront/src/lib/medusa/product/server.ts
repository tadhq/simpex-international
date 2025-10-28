import { getPricedProductById, getProductByHandle } from '../api';
import { ProductContextParams } from '../types';

export async function getPricedProductByHandle(handle: string, context?: ProductContextParams) {
  const product = await getProductByHandle(handle);

  if (!product || !product.id) return null;

  return getPricedProductById(product.id, context);
}
