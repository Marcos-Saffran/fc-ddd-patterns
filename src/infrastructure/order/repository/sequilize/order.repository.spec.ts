import { Sequelize } from "sequelize-typescript";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import Product from "../../../../domain/product/entity/product";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import ProductModel from "../../../product/repository/sequelize/product.model";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderRepository from "./order.repository";

describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a new order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("123", "123", [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: "123",
          product_id: "123",
        },
      ],
    });
  });

  it("should update an order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("123", "123", [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    // change customer
    const newCustomer = new Customer("124", "Customer 2");
    const newAddress = new Address("Street 2", 2, "Zipcode 2", "City 2");
    newCustomer.changeAddress(newAddress);
    await customerRepository.create(newCustomer);

    // change product
    const newProduct = new Product("124", "Product 2", 20);
    await productRepository.create(newProduct);

    // change order item
    const newOrderItem = new OrderItem(
      "2",
      newProduct.name,
      newProduct.price,
      newProduct.id,
      3
    );

    const newOrder = new Order("123", "124", [newOrderItem]);

    await orderRepository.update(newOrder);

    const updatedOrderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });
    
    expect(updatedOrderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "124",
      total: newOrder.total(),
      items: [
        {
          id: newOrderItem.id,
          name: newOrderItem.name,
          price: newOrderItem.price,
          quantity: newOrderItem.quantity,
          order_id: "123",
          product_id: "124",
        },
      ],
    });
  });

  it("should find an order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("123", "123", [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModelFinded = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModelFinded.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: "123",
          product_id: "123",
        },
      ],
    });
  });

  it("should throw an error when order is not found", async () => {
    const orderRepository = new OrderRepository();
    await expect(orderRepository.find("456")).rejects.toThrow(
      /^Order not found: 456,/
    );
  });

  it("should find all orders", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const customer2 = new Customer("124", "Customer 2");
    const address2 = new Address("Street 2", 2, "Zipcode 2", "City 2");
    customer2.changeAddress(address2);
    await customerRepository.create(customer2);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const product2 = new Product("124", "Product 2", 20);
    await productRepository.create(product2);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order1 = new Order("123", "123", [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order1);

    const orderItem2 = new OrderItem(
      "2",
      product2.name,
      product2.price,
      product2.id,
      3
    );

    const order2 = new Order("124", "124", [orderItem2]);
    await orderRepository.create(order2);

    const foundOrders = await orderRepository.findAll();
    const orders = [order1, order2];

    expect(foundOrders.length).toBe(2);

    expect(foundOrders[0].id).toBe(orders[0].id);
    expect(foundOrders[0].customerId).toBe(orders[0].customerId);
    expect(foundOrders[0].total()).toBe(orders[0].total());
    expect(foundOrders[0].items.length).toBe(orders[0].items.length);
    expect(foundOrders[0].items[0].id).toBe(orders[0].items[0].id);
    expect(foundOrders[0].items[0].name).toBe(orders[0].items[0].name);
    expect(foundOrders[0].items[0].price).toBe(orders[0].items[0].price);
    expect(foundOrders[0].items[0].quantity).toBe(
      orders[0].items[0].quantity
    );

    expect(foundOrders[1].id).toBe(orders[1].id);
    expect(foundOrders[1].customerId).toBe(orders[1].customerId);
    expect(foundOrders[1].total()).toBe(orders[1].total());
    expect(foundOrders[1].items.length).toBe(orders[1].items.length);
    expect(foundOrders[1].items[0].id).toBe(orders[1].items[0].id);
    expect(foundOrders[1].items[0].name).toBe(orders[1].items[0].name);
    expect(foundOrders[1].items[0].price).toBe(orders[1].items[0].price);
    expect(foundOrders[1].items[0].quantity).toBe(
      orders[1].items[0].quantity
    );
  });
});
