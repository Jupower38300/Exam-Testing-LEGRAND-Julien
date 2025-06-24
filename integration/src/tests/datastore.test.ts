import { beforeEach, describe, test, expect } from "vitest";
import { DataStore } from "../DataStore";
import { ICustomer, IProduct, IOrder, IOrderItem, IInvoice } from "../types";

describe("Datastore Tests", () => {
  let store: DataStore;

  const product: IProduct = {
    id: "1",
    name: "Spaghettis",
    description: "Yummy spaghetti with tomato sauce",
    price: 20,
    category: "main",
    available: true,
    preparationTimeMinutes: 15,
  };

  const customer: ICustomer = {
    id: "1",
    name: "Julien",
    email: "julien.legrand38300@gmail.com",
    address: "28 road of testing",
    phone: "0000000000",
    loyaltyPoints: 100,
  };

  const orderItem: IOrderItem = {
    productId: product.id,
    quantity: 2,
    unitPrice: product.price,
  };

  const order: IOrder = {
    id: "1",
    customerId: customer.id,
    items: [orderItem],
    status: "pending",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2025-01-01"),
    totalAmount: orderItem.quantity * orderItem.unitPrice,
  };

  const invoice: IInvoice = {
    id: "1",
    orderId: order.id,
    customerId: customer.id,
    items: [orderItem],
    totalAmount: orderItem.quantity * orderItem.unitPrice,
    tax: 10,
    paid: true,
    createdAt: new Date("2024-01-01"),
  };

  beforeEach(() => {
    store = new DataStore();
  });

  test("should save and get a product", () => {
    store.saveProduct(product);
    const retrievedProduct = store.getProduct(product.id);
    expect(retrievedProduct).toEqual(product);
  });

  test("should return only available products", () => {
    store.saveProduct(product);
    store.saveProduct({ ...product, id: "2", available: false });
    const availableProducts = store.getAvailableProducts();
    expect(availableProducts).toHaveLength(1);
    expect(availableProducts[0].id).toBe(product.id);
  });

  test("should save and ger a customer", () => {
    store.saveCustomer(customer);
    const retrievedCustomer = store.getCustomer(customer.id);
    expect(retrievedCustomer).toEqual(customer);
  });

  test("should save and get an order", () => {
    store.saveOrder(order);
    const resultOrder = store.getOrder(order.id);
    expect(resultOrder).toEqual(order);
  });

  test("should return customer orders", () => {
    store.saveOrder(order);
    store.saveOrder({ ...order, id: "2" });
    store.saveOrder({ ...order, id: "3", customerId: "2" });

    const orders = store.getCustomerOrders(customer.id);
    expect(orders).toHaveLength(2);
    expect(orders.map((o) => o.id)).toEqual(["1", "2"]);
  });

  test("should save and get an invoice", () => {
    store.saveInvoice(invoice);
    const savedInvoice = store.getInvoice(invoice.id);
    expect(savedInvoice).toEqual(invoice);
  });

  test("should find invoice by order ID", () => {
    store.saveInvoice(invoice);
    const result = store.getOrderInvoice("1");
    expect(result).toEqual(invoice);
  });

  test("Complete integration test", () => {
    store.saveProduct(product);
    store.saveCustomer(customer);
    store.saveOrder(order);
    store.saveInvoice(invoice);

    const savedCustomer = store.getCustomer(customer.id);
    const customerOrders = store.getCustomerOrders(customer.id);
    const firstOrder = customerOrders[0];
    const orderInvoice = store.getOrderInvoice(firstOrder.id);
    const products = firstOrder.items.map((item) =>
      store.getProduct(item.productId),
    );

    expect(savedCustomer?.name).toEqual("Julien");
    expect(customerOrders.length).toEqual(1);
    expect(orderInvoice?.totalAmount).toBe(40);
    expect(products[0]?.name).toBe("Spaghettis");
  });
});
