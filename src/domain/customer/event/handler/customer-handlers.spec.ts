import EventDispatcher from "../../../@shared/event/event-dispatcher";
import CustomerAddressChangedEvent from "../customer-address-changed.event";
import CustomerCreatedEvent from "../customer-created.event";
import EnviaConsoleLog1Handler from "./envia-console-log-1.handler";
import EnviaConsoleLog2Handler from "./envia-console-log-2.handler";
import EnviaConsoleLogAddressChangedHandler from "./envia-console-log-address-changed.handler";

describe("Customer Domain Events Handlers Tests", () => {

    it("should register CustomerCreated event handler 1", () => {

        const eventDispatcher = new EventDispatcher();
        const eventHandler = new EnviaConsoleLog1Handler();

        eventDispatcher.register("CustomerCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(1);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler);
    });

    it("should register CustomerCreated event handler 2", () => {

        const eventDispatcher = new EventDispatcher();
        const eventHandler = new EnviaConsoleLog2Handler();

        eventDispatcher.register("CustomerCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(1);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler);
    });

    it("should register both CustomerCreated event handlers", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler1 = new EnviaConsoleLog1Handler();
        const eventHandler2 = new EnviaConsoleLog2Handler();

        eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
        eventDispatcher.register("CustomerCreatedEvent", eventHandler2);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(2);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler1);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(eventHandler2);
    });

    it("should notify both CustomerCreated event handlers", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler1 = new EnviaConsoleLog1Handler();
        const eventHandler2 = new EnviaConsoleLog2Handler();
        const spyEventHandler1 = jest.spyOn(eventHandler1, "handle");
        const spyEventHandler2 = jest.spyOn(eventHandler2, "handle");

        eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
        eventDispatcher.register("CustomerCreatedEvent", eventHandler2);

        const customerCreatedEvent = new CustomerCreatedEvent({
            id: "1",
            name: "John Doe",
        });

        eventDispatcher.notify(customerCreatedEvent);

        expect(spyEventHandler1).toHaveBeenCalled();
        expect(spyEventHandler2).toHaveBeenCalled();
    });
    
    it("should print console logs for CustomerCreated event", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler1 = new EnviaConsoleLog1Handler();
        const eventHandler2 = new EnviaConsoleLog2Handler();
        
        const spyConsole = jest.spyOn(console, "log").mockImplementation();

        eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
        eventDispatcher.register("CustomerCreatedEvent", eventHandler2);

        const customerCreatedEvent = new CustomerCreatedEvent({
            id: "1",
            name: "John Doe",
        });

        eventDispatcher.notify(customerCreatedEvent);

        expect(spyConsole).toHaveBeenCalledWith("Esse é o primeiro console.log do evento: CustomerCreated");
        expect(spyConsole).toHaveBeenCalledWith("Esse é o segundo console.log do evento: CustomerCreated");

        spyConsole.mockRestore();
    });

    it("should register CustomerAddressChanged event handler", () => {

        const eventDispatcher = new EventDispatcher();
        const eventHandler = new EnviaConsoleLogAddressChangedHandler();

        eventDispatcher.register("CustomerAddressChangedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"].length).toBe(1);
        expect(eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"][0]).toMatchObject(eventHandler);
    });

    it("should notify CustomerAddressChanged event handler", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new EnviaConsoleLogAddressChangedHandler();
        const spyEventHandler = jest.spyOn(eventHandler, "handle");

        eventDispatcher.register("CustomerAddressChangedEvent", eventHandler);

        const customerAddressChangedEvent = new CustomerAddressChangedEvent({
            id: "1",
            name: "Cliente 1",
            address: "Endereço do cliente 1",
        });

        eventDispatcher.notify(customerAddressChangedEvent);

        expect(spyEventHandler).toHaveBeenCalled();
    });

    it("should print console log for CustomerAddressChanged event", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new EnviaConsoleLogAddressChangedHandler();

        const spyConsole = jest.spyOn(console, "log").mockImplementation();

        eventDispatcher.register("CustomerAddressChangedEvent", eventHandler);

        const customerAddressChangedEvent = new CustomerAddressChangedEvent({
            id: "1",
            name: "Cliente 1",
            address: "Endereço do cliente 1",
        });

        eventDispatcher.notify(customerAddressChangedEvent);

        expect(spyConsole).toHaveBeenCalledWith("Endereço do cliente: 1, Cliente 1 alterado para: Endereço do cliente 1");

        spyConsole.mockRestore();
    });
});