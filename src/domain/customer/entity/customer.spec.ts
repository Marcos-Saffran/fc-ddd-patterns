import EventDispatcher from "../../@shared/event/event-dispatcher";
import EnviaConsoleLog1Handler from "../event/handler/envia-console-log-1.handler";
import EnviaConsoleLog2Handler from "../event/handler/envia-console-log-2.handler";
import EnviaConsoleLogAddressChangedHandler from "../event/handler/envia-console-log-address-changed.handler";
import Address from "../value-object/address";
import Customer from "./customer";

describe("Customer unit tests", () => {
  it("should throw error when id is empty", () => {
    expect(() => {
      let customer = new Customer("", "John");
    }).toThrowError("Id is required");
  });

  it("should throw error when name is empty", () => {
    expect(() => {
      let customer = new Customer("123", "");
    }).toThrowError("Name is required");
  });

  it("should change name", () => {
    // Arrange
    const customer = new Customer("123", "John");

    // Act
    customer.changeName("Jane");

    // Assert
    expect(customer.name).toBe("Jane");
  });

  it("should activate customer", () => {
    const customer = new Customer("1", "Customer 1");
    const address = new Address("Street 1", 123, "13330-250", "São Paulo");
    customer.changeAddress(address);

    customer.activate();

    expect(customer.isActive()).toBe(true);
  });

  it("should throw error when address is undefined when you activate a customer", () => {
    expect(() => {
      const customer = new Customer("1", "Customer 1");
      customer.activate();
    }).toThrowError("Address is mandatory to activate a customer");
  });

  it("should deactivate customer", () => {
    const customer = new Customer("1", "Customer 1");

    customer.deactivate();

    expect(customer.isActive()).toBe(false);
  });

  it("should add reward points", () => {
    const customer = new Customer("1", "Customer 1");
    expect(customer.rewardPoints).toBe(0);

    customer.addRewardPoints(10);
    expect(customer.rewardPoints).toBe(10);

    customer.addRewardPoints(10);
    expect(customer.rewardPoints).toBe(20);
  });

      it("should dispatch CustomerCreated event when customer is created", () => {
        // arrange
        const eventDispatcher = new EventDispatcher();
        const eventHandler1 = new EnviaConsoleLog1Handler();
        const eventHandler2 = new EnviaConsoleLog2Handler();
        const spyEventHandler1 = jest.spyOn(eventHandler1, "handle");
        const spyEventHandler2 = jest.spyOn(eventHandler2, "handle");

        eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
        eventDispatcher.register("CustomerCreatedEvent", eventHandler2);

        // act
        const customer = new Customer("1", "John", eventDispatcher);

        // assert
        expect(spyEventHandler1).toHaveBeenCalled();
        expect(spyEventHandler2).toHaveBeenCalled();
    });

    it("should print console logs when CustomerCreated event is dispatched", () => {
        // arrange
        const eventDispatcher = new EventDispatcher();
        const eventHandler1 = new EnviaConsoleLog1Handler();
        const eventHandler2 = new EnviaConsoleLog2Handler();
        const spyConsole = jest.spyOn(console, "log").mockImplementation();

        eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
        eventDispatcher.register("CustomerCreatedEvent", eventHandler2);

        // act
        const customer = new Customer("1", "John", eventDispatcher);

        // assert
        expect(spyConsole).toHaveBeenCalledWith("Esse é o primeiro console.log do evento: CustomerCreated");
        expect(spyConsole).toHaveBeenCalledWith("Esse é o segundo console.log do evento: CustomerCreated");

        spyConsole.mockRestore();
    });

    it("should dispatch CustomerAddressChanged event when address is changed", () => {
        // arrange
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new EnviaConsoleLogAddressChangedHandler();
        const spyEventHandler = jest.spyOn(eventHandler, "handle");

        eventDispatcher.register("CustomerAddressChangedEvent", eventHandler);

        const customer = new Customer("1", "John", eventDispatcher);
        const address = new Address("Street 1", 123, "12345-678", "City");

        // act
        customer.changeAddress(address);

        // assert
        expect(spyEventHandler).toHaveBeenCalled();
    });

    it("should print console log when CustomerAddressChanged event is dispatched", () => {
        // arrange
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new EnviaConsoleLogAddressChangedHandler();
        const spyConsole = jest.spyOn(console, "log").mockImplementation();

        eventDispatcher.register("CustomerAddressChangedEvent", eventHandler);

        const customer = new Customer("1", "John", eventDispatcher);
        const address = new Address("Street 1", 123, "12345-678", "City");

        // act
        customer.changeAddress(address);

        // assert
        expect(spyConsole).toHaveBeenCalledWith(expect.stringContaining("Endereço do cliente: 1, John alterado para:"));

        spyConsole.mockRestore();
    });

});
