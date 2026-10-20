function validate(value, stock) {
  if (!Number.isInteger(value) || value <= 0) {
    throw new RangeError('Количество должно быть положительным целым числом.');
  }
  if (value > stock) {
    throw new RangeError('Количество не может превышать остаток на складе.');
  }
}

function addToCart(cart, product, quantity) {
  validate(quantity, product.stock);

  const existingItem = cart.find((item) => item.id === product.id);
  if (!existingItem) {
    return [...cart, { ...product, quantity }];
  }

  const nextQuantity = existingItem.quantity + quantity;
  validate(nextQuantity, product.stock);

  return cart.map((item) => (
    item.id === product.id ? { ...item, quantity: nextQuantity } : item
  ));
}

function changeQuantity(cart, productId, quantity) {
  const existingItem = cart.find((item) => item.id === productId);
  if (!existingItem) return [...cart];

  validate(quantity, existingItem.stock);

  return cart.map((item) => (
    item.id === productId ? { ...item, quantity } : item
  ));
}

function removeFromCart(cart, productId) {
  return cart.filter((item) => item.id !== productId);
}

function calculateCartSubtotal(cart) {
  return cart.reduce((subtotal, item) => subtotal + item.price * item.quantity, 0);
}

function calculateOrderTotal(cart, promoCode = '') {
  const subtotal = calculateCartSubtotal(cart);
  const discount = promoCode === 'SAVE10' && subtotal >= 20000
    ? Math.round(subtotal * 0.1)
    : 0;
  const delivery = subtotal < 50000 ? 30000 : 0;

  return { subtotal, discount, delivery, total: subtotal - discount + delivery };
}

const cartApi = { addToCart, changeQuantity, removeFromCart, calculateCartSubtotal, calculateOrderTotal };

if (typeof module !== 'undefined') module.exports = cartApi;
if (typeof window !== 'undefined') window.cartApi = cartApi;
