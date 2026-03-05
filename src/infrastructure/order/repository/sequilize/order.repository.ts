import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class OrderRepository implements OrderRepositoryInterface {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async update(entity: Order): Promise<void> {
    await OrderModel.update(
      {
        customer_id: entity.customerId,
        total: entity.total(),
      },
      {
        where: { id: entity.id },
      }
    );

    await OrderItemModel.destroy({
      where: { order_id: entity.id },
    });

    const orderItems = entity.items.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      product_id: item.productId,
      quantity: item.quantity,
      order_id: entity.id,
    }));

    await OrderItemModel.bulkCreate(orderItems);
  }

  async find(id: string): Promise<Order> {
    try {
      const orderModel = await OrderModel.findOne({
        where: { id },
        include: ["items"],
      });

      const orderItems = orderModel.items.map((item) => 
        new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity)
      );

      return new Order(orderModel.id, orderModel.customer_id, orderItems);
    } catch (error) {
      throw new Error(`Order not found: ${id}, cause: ${error}`);
    }
  }

  async findAll(): Promise<Order[]> {
    return OrderModel.findAll({ include: ["items"] }).then((orderModels) =>
      orderModels.map((orderModel) => {
        const orderItems = orderModel.items.map((item) =>
          new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity)
        );
        return new Order(orderModel.id, orderModel.customer_id, orderItems);
      })
    );
  }

}
