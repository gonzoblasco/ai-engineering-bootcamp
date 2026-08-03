// tests/order.test.js
const Order = require('../src/models/order');

describe('Order', () => {
  const items = [
    { price: 30, qty: 2 }, // 60
    { price: 50, qty: 1 }, // 50
  ]; // subtotal = 110

  it('subtotal sums price * qty', () => {
    expect(new Order({ id: 1, items }).subtotal()).toBe(110);
  });

  it('applies 10% discount when subtotal > 100', () => {
    const order = new Order({ id: 1, items });
    expect(order.discountRate()).toBe(0.10);
    expect(order.discountedTotal()).toBe(99);
  });

  it('applies 15% discount when subtotal > 500', () => {
    const bigItems = [{ price: 600, qty: 1 }];
    const order = new Order({ id: 2, items: bigItems });
    expect(order.discountRate()).toBe(0.15);
    expect(order.discountedTotal()).toBe(510);
  });

  it('applies no discount when subtotal <= 100', () => {
    const smallItems = [{ price: 40, qty: 1 }];
    const order = new Order({ id: 3, items: smallItems });
    expect(order.discountRate()).toBe(0);
    expect(order.discountedTotal()).toBe(40);
  });

  it('tax is 21% of discountedTotal', () => {
    const order = new Order({ id: 1, items });
    expect(order.tax()).toBeCloseTo(99 * 0.21, 5);
  });

  it('grandTotal = discountedTotal + tax', () => {
    const order = new Order({ id: 1, items });
    expect(order.grandTotal()).toBeCloseTo(99 + 99 * 0.21, 5);
  });

  it('toDTO contains all expected fields', () => {
    const dto = new Order({ id: 1, items }).toDTO();
    expect(dto).toHaveProperty('id');
    expect(dto).toHaveProperty('total');
    expect(dto).toHaveProperty('date');
    expect(dto).toHaveProperty('tax');
    expect(dto).toHaveProperty('grandTotal');
  });
});