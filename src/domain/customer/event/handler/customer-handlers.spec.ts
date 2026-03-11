import EventDispatcher from "../../../@shared/event/event-dispatcher";
import EnviaConsoleLog1Handler from "./envia-console-log-1.handlers";

describe("Customer Domain Events Handlers Tests", () => { 

    it("should register CustomerCreated event handler 1", () => { 

        const eventDispatcher = new EventDispatcher();
        const eventHandler = new EnviaConsoleLog1Handler();

        eventDispatcher.register("CustomerCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(1);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler);
    });
});