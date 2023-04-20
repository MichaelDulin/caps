# CAPS - Code Academy Parcel Service

****

## Application Description

A real-time service that allows for vendors, such as flower shops or restaurants, to alert a system of a package needing to be delivered, for drivers to instantly see what’s in their pickup queue, and then to alert the vendors as to the state of the deliveries (in transit, and then delivered).

****

## [Render](https://caps-esgz.onrender.com)

****

# LAB11: Event Driven Applications

**CAPS Phase 1:** Begin the build of an application for a product called **CAPS** - The Code Academy Parcel Service. In this sprint, we'll build out a system that emulates a real world supply chain. **CAPS** will simulate a delivery service where vendors (such a flower shops) will ship products using our delivery service and when our drivers deliver them, each vendor will be notified that their customers received what they purchased.

This will be an event driven application that "distributes" the responsibility for logging to separate modules, using only events to trigger logging based on activity.


## Phase 1 Requirements

Today, we begin the first of a 4-Phase build of the CAPS system, written in Node.js. In this first phase, our goal is to setup a pool of events and handler functions, with the intent being to refactor parts of the system throughout the week, but keep the handlers themselves largely the same. The task of "delivering a package" doesn't change (the handler), even if the mechanism for triggering that task (the event) does.

The following user/developer stories detail the major functionality for this phase of the project.

- As a vendor, I want to alert the system when I have a package to be picked up.
- As a driver, I want to be notified when there is a package to be delivered.
- As a driver, I want to alert the system when I have picked up a package and it is in transit.
- As a driver, I want to alert the system when a package has been delivered.
- As a vendor, I want to be notified when my package has been delivered.

And as developers, here are some of the development stories that are relevant to the above.

- As a developer, I want to use industry standards for managing the state of each package.
- As a developer, I want to create an event driven system so that I can write code that happens in response to events, in real time.

## Technical Requirements / Notes



### Global Event Pool (HUB)

1. Implement a Module for a Global Event Pool.
   - Export a single `EventEmitter` from the [Node JS module](https://nodejs.org/api/events.html#events_class_eventemitter).
   - Should be imported by any module that needs to notify or be alerted by other modules of an event.
  
1. Implement a Module for Managing Global Package Events.
   - Listens to **ALL** events in the Event Pool.
   - Logs a timestamp and the payload of every event.

    ```json
    "EVENT": { 
      "event": "pickup",
      "time": "2020-03-06T18:27:17.732Z",
      "payload": { 
        "store": "1-206-flowers",
        "orderID": "e3669048-7313-427b-b6cc-74010ca1f8f0",
        "customer": "Jamal Braun",
        "address": "Schmittfort, LA"
      }
    }
    ```

### Vendor Client Application

1. Implement a Module for Managing Vendor Events.
   - Your implementation should use a `store name` as a parameter.
   - When triggered, the **vendor module** simulates a `pickup` event for the given `store name` to the Global Event Pool:
     - emits `pickup` to the global event pool.
     - sends a vendor order `payload`:

     ```json
      {
        "store": "<store-name>",
        "orderId": "<unique-order-id>",
        "customer": "<customer-name>",
        "address": "<city-state>"
      }
     ```

     > HINT: Have some fun by using the [Chance](https://chancejs.com/) library to make up phony information.
   - Listens for a `delivered` event and responds by logging a message to the console:

   ```javascript
    Thank you, <customer-name>
   ```

### Driver Client Application

1. Implement a Module for Managing Driver Events.
   - Listens for a `pickup` event from the Global Event Pool and responds with the following:
     - Log a message to the console: `DRIVER: picked up <ORDER_ID>`.
     - Emit an `in-transit` event to the Global Event Pool with the order payload.
     - Log a confirmation message to the console: `DRIVER: delivered <ORDER_ID>`.
     - Emit a `delivered` event to the Global Event Pool with the order payload.

### When running, your console output should look something like this:

```javascript
EVENT { event: 'pickup',
  time: 2020-03-06T18:27:17.732Z,
  payload:
   { store: '1-206-flowers',
     orderID: 'e3669048-7313-427b-b6cc-74010ca1f8f0',
     customer: 'Jamal Braun',
     address: 'Schmittfort, LA' } }
DRIVER: picked up e3669048-7313-427b-b6cc-74010ca1f8f0
EVENT { event: 'in-transit',
  time: 2020-03-06T18:27:18.738Z,
  payload:
   { store: '1-206-flowers',
     orderID: 'e3669048-7313-427b-b6cc-74010ca1f8f0',
     customer: 'Jamal Braun',
     address: 'Schmittfort, LA' } }
DRIVER: delivered up e3669048-7313-427b-b6cc-74010ca1f8f0
VENDOR: Thank you for delivering e3669048-7313-427b-b6cc-74010ca1f8f0
EVENT { event: 'delivered',
  time: 2020-03-06T18:27:20.736Z,
  payload:
   { store: '1-206-flowers',
     orderID: 'e3669048-7313-427b-b6cc-74010ca1f8f0',
     customer: 'Jamal Braun',
     address: 'Schmittfort, LA' } }
...
```

### Testing

- Write unit tests for each event handler function (not event triggers themselves).
- Use spies to help testing your logger methods (assert that console.log was called right).

## UML


<img width="848" alt="Screenshot 2023-04-18 170333" src="https://user-images.githubusercontent.com/73040864/232930326-42b5b6b7-c770-45f9-af86-962b570452a7.png">


****

# LAB12: Socket.io

**CAPS Phase 2:** Continue working on a multi-day build of our delivery tracking system, creating an event observable over a network with Socket.io.

In this phase, we'll be moving away from using Node Events for managing a pool of events, instead refactoring to using the Socket.io libraries.  This allows communication between Server and Client applications.

The intent here is to build the data services that would drive a suite of applications where we can see pickups and deliveries in real-time.

## Before you begin

Refer to *Getting Started*  in the [lab submission instructions](../../../reference/submission-instructions/labs/README.md) for complete setup, configuration, deployment, and submission instructions.

> Building off of your previous day's branch, create a new branch for today called 'socket.io' and continue to work in your 'caps' repository.
## Business Requirements

Refer to the [CAPS System Overview](../../apps-and-libraries/caps/README.md) for a complete review of the application, including Business and Technical requirements along with the development roadmap.

## Phase 2 Requirements

In Phase 2, we'll be changing the underlying networking implementation of our CAPS system from using node events to using a library called Socket.io so that clients can communicate over a network.  Socket.io manages the connection pool for us, making broadcasting much easier to operate, and works well both on the terminal (between servers) and with web clients.

The core functionality we've already built remains the same. The difference in this phase is that we'll be creating a networking layer. As such, the user stories that speak to application functionality remain unchanged, but our developer story changes to reflect the work needed for refactoring.

- As a vendor, I want to alert the system when I have a package to be picked up.
- As a driver, I want to be notified when there is a package to be delivered.
- As a driver, I want to alert the system when I have picked up a package and it is in transit.
- As a driver, I want to alert the system when a package has been delivered.
- As a vendor, I want to be notified when my package has been delivered.

And as developers, here is our updated story relevant to the above.

- **As a developer, I want to create network event driven system using Socket.io so that I can write code that responds to events originating from both servers and client applications**

## Technical Requirements / Notes

In order to switch from Node Events to Socket.io, the refactoring process will involve changes to each application to use the core features of Socket.io.

### Overview

The goal of this lab is to create a [**namespaced** Socket.io](https://socket.io/docs/v4/namespaces#Custom-namespaces) event server, and to configure **Vendor** and **Driver** Client Modules.

- The Socket Server will create a namespace of `caps` that will receive all CAPS event traffic.
- Each **Vendor** and **Driver** Client will connect to the `caps` namespace.
- The server will emit specific events to each `socket` that is listening for their designated events from the Global Event Pool defined in the Server.
- Each **Vendor** will only *emit* and *listen* for specific events based on their `Vendor ID`.  This will be managed by [rooms](https://socket.io/docs/v3/rooms/index.html) within Socket.io.
- Each **Driver** will "pick up" a package when the vendor notifies the Server that an "order" is ready and simulate "in-transit" and "delivered" events.

The expected output of the 3 running applications is the same as it was in Phase 2.

![Output](lab-17-output.png)

> Note: this is the heart of refactoring. The end result **appears** to be the same even after you've made a holistic change on the underlying code to be cleaner and faster. As developers, we want to do great work without changing the users' experience.
### Proposed File Structure

> Note:  The structure below shows both socket clients and the socket server in the same repo.  This is for learning and grading convenience, not a requirement.  Realistically, the socket server and each of the socket clients could be independent applications and repos.
```text
├── .github
│   ├── workflows
│   │   └── node.yml
├── clients
│   ├── driver
│   │   ├── handler.js
│   │   ├── index.js
│   │   └── driver-handler.test.js
│   ├── vendor
│   │   ├── handler.js
│   │   ├── index.js
│   │   └── vendor-handler.test.js
│   └── socket.js (socket instance useful for mocks/testing)
├── server
│   └── index.js
├── .eslintrc.json
├── .gitignore
├── package.json
└── README.md
```

### Global Event Pool (HUB)

1. Use the `socket.io` npm package to configure an event Server that can be started at a designated port using node.
   - Accept connections on a namespace called `caps`, and configure `socket` objects from clients.
   - Ensure that client `sockets` are connecting to their appropriate `room` if specified.

1. Configure a Global Event Pool that every client `socket` should listen for:
    - `pickup` - this will be broadcast to all sockets.
    - `in-transit` - this will be emitted only to **Vendors** that have joined the appropriate room.
    - `delivered` - this will be be emitted only to **Vendors** that have joined the appropriate room.
    > NOTE: You may need to create an extra event here that allows clients to join "rooms".
### Vendor Client Application

1. Connects to the CAPS Application Server using `socket.io-client`:
   - Make sure your module connects using the `caps` namespace.
   - Upon connection, use a `Vendor ID` to join a room, this can be a store name.

1. Upon connection, simulate a new customer order:
   - Create a payload object with your store id, order id, customer name, address.
   - Emit that message to the CAPS server with an event called `pickup`.

1. Listen for the `delivered` event coming in from the CAPS server.
   - Log "thank you for delivering `payload.id` to the console.

1. After the delivery event has been received, exit the application using `process.exit()`.

### Driver Client Application

1. Connects to the CAPS Application Server using `socket.io-client`:
   - Make sure this module is using the `caps` namespace to connect to the Server.

1. Once connected, the Driver client module should listen for any appropriate events from the Server:
   - When a `pickup` is emitted from the Server, *simulate* all specified Driver behaviors.

1. Simulate the following events and emit payloads to the CAPS Application Server upon receiving a "pickup" event:
   - **`in-transit`**
     - Log "picking up `payload.id`" to the console.
     - emit an `in-transit` event to the CAPS server with the payload.
   - **`delivered`**
     - emit a `delivered` event to the CAPS server with the payload.

When running, the vendor and driver consoles should show their own logs. Additionally, the CAPS server should be logging everything.

### Notes

- You will need to start your servers up in the right order so that you can visually test things out.  Consider adjusting interval and timeouts in order to clearly see queue behavior.

1. `CAPS` - needs to be up so that it can accept and re-emit events.
2. `driver` - needs a running server to connect to ands listen for all incoming orders from the Vendor.
3. `vendor` - needs to connect to a running server so that it can hear events and emit orders.

### Stretch Goal

Write a separate app using express, with a single route: POST `/pickup` that sends a JSON object with the following properties:

```json
{
  "store": "<STORE_ID>",
  "orderID": "<ORDER_ID>",
  "customer": "<FIRST_NAME LAST_NAME>",
  "address": "<CITY, STATE>"
 }
```

When that route is hit, have the express server trigger the socket server with the `pickup` event with the attached JSON payload. This should kick off the same series of events that the `vendor` application was triggering before, now using a web request instead of a terminal process that triggers events automatically.

Assuming your small api server runs on port 3001, the form in the test app will hit that route if you have done this step.

### Testing

- Write tests around all of your units.
- Test event handler functions (not event triggers themselves).
- Use jest [spies](https://jestjs.io/docs/jest-object#jestfnimplementation) and/or [mock functionality](https://jestjs.io/docs/manual-mocks) to assert that your handlers were called and ran as expected. 
- For our use case, was `console.log()` called with the expected arguments?

****

## UML


<img width="691" alt="Screenshot 2023-04-19 173700" src="https://user-images.githubusercontent.com/73040864/233229048-734315ed-3152-4503-b2d0-14dab1346065.png">


****

# LAB13: Message Queues

**CAPS Phase 3:** Complete work on a multi-day build of our delivery tracking system, adding queued delivery.

In this phase, we are going to implement a system to guarantee that notification payloads are read by their intended subscriber.   Rather than just triggering an event notification and hope that client applications respond, we're going to implement a "Queue" system so that nothing gets lost. Every event sent will be logged and held onto by the server until the intended recipient acknowledges that they received the message. At any time, a subscriber can get all of the messages they might have missed.

In this final phase, we'll be implementing a "Queue" feature on the Server, allowing `Driver` and `Vendor` clients to subscribe to messages added to `pickup` and `delivered` queues.

## Before you begin

Refer to *Getting Started*  in the [lab submission instructions](../../../reference/submission-instructions/labs/README.md) for complete setup, configuration, deployment, and submission instructions.

> Building off of your previous day's branch, create a new branch for today called 'queue' and continue to work in your 'caps' repository.
## Business Requirements

Refer to the [CAPS System Overview](../../apps-and-libraries/caps/README.md) for a complete review of the application, including Business and Technical requirements along with the development roadmap.

## Phase 3 Requirements

In Phase 3, we are building a set of features to help manage deliveries made by CAPS Drivers. This will simulate a delivery driver receiving a list of orders from a Queue and "scanning" package codes on delivery. Retailers will be able to see in their dashboard or log, a list of all packages delivered in real time. Should a delivery driver deliver many packages while the retailer is not connected to the dashboard, the vendor client should be guaranteed to receive "delivery" notifications from the Queue system.

Here are the high level stories related to this new set of requirements.

- As a vendor, I want to "subscribe" to "delivered" notifications so that I know when my packages are delivered.
- As a vendor, I want to "catch up" on any "delivered" notifications that I might have missed so that I can see a complete log.
- As a driver, I want to "subscribe" to "pickup" notifications so that I know what packages to deliver.
- As a driver, I want to "catch up" on any "pickup" notifications I may have missed so that I can deliver everything.
- As a driver, I want a way to "scan" a delivery so that the vendors know when a package has been delivered.

And as developers, here are some of the development stories that are newly relevant to the above.

- As a developer, I want to create a system of tracking who is subscribing to each event.
- As a developer, I want to place all inbound messages into a "queue" so that my application knows what events are to be delivered.
- As a developer, I want to create a system for communicating when events have been delivered and received by subscribers.
- As a developer, I want to delete messages from the queue after they've been received by a subscriber, so that I don't re-send them.
- As a developer, I want to create a system for allowing subscribers to retrieve all undelivered messages in their queue.

## Technical Requirements / Notes

### Overview

We are adding a new module to the CAPS Application Server to *guarantee* that payloads from events are delivered to any Client Module that is listening for specific events.  This lab will have you refactoring the **Server** and **Client** Modules to facilitate storing of payloads Server side and removing them when received by clients.

- Our **Server** is going to have the same overall functionality, but we want to incorporate a few improvements to existing features:
  - We want a feature to keep a log of payloads that reach our system, organized by vendor and event type.
  - Payloads are "published" to the appropriate **Clients** for the appropriate events.
- Client **Vendor** Applications used by retailers, should subscribe to appropriate **Vendor** Queues so that they can be alerted when a delivery was made.
  - The **Client** can ask for all undelivered messages from a particular **Server** Queue.
  - When a **Client** receives a message, it will need to let the hub server know that it was received.

  ### Proposed File Structure

> Note:  The structure below shows both socket clients and the socket server in the same repo.  This is for learning and grading convenience, not a requirement.  Realistically, the socket server and each of the socket clients could be independent applications and repos.
```text
├── .github
│   ├── workflows
│   │   └── node.yml
├── clients
│   ├── driver
│   │   ├── handler.js
│   │   ├── index.js
│   │   └── driver-handler.test.js
│   ├── flower-vendor
│   │   ├── handler.js
│   │   ├── index.js
│   │   └── flower-handler.test.js
│   ├── lib
│   │   ├── client.js (optional)
│   │   └── client.test.js (optional)
│   ├── widget-vendor
│   │   ├── handler.js
│   │   ├── index.js
│   │   └── widget-handler.test.js
│   └── socket.js (socket instance useful for mocks/testing)
├── server
│   ├── lib
│   │   ├── queue.js
│   │   └── queue.test.js
│   └── index.js
├── .eslintrc.json
├── .gitignore
├── package.json
└── README.md
```

### Global Event Pool (HUB)

1. Use the `socket.io` npm package to configure an event Server that can be started at a designated port using node.
    - We still need the Server to configure socket connections to the `caps` namespace on a specified PORT.
    - Create a **Message Queue** that can store payloads for specific **Clients**.
      - Each payload that is read by the `pickup` event should be added to a Queue for **Driver** clients.
      - Each payload that is read by the `delivered` event should be added to a Queue for **Vendor** clients.
      - This could be as simple as an Object or Array, or as complex as a Module that connects to and performs operations against a database.
1. Add a `received` event to the Global Event Pool.
   - When this event is heard on the server, assume it's a Client Module telling you a payload was successfully read.
   - The payload should include the client id, event name, and message id, so that you can **delete** it from the Queue.
1. Add a `getAll` event to the Global Event Pool.
   - The payload should include the client id and event name.
   - When this event is heard on the server, find each of the messages in the queue for the client, for the event specified.
   - Go through each of the entries for the client/event in the queue (if any) and broadcast them to the client.
1. Refactor the `delivered`, `pickup`, and `in-transit` events in the Global Event Pool.
   - We need to be able to add payloads to the appropriate Queue for specific Clients.
   - When these events are triggered, add the payload immediately to the appropriate Queue.
   - Broadcast the same event, with the following payload to all subscribers.

    ```json
    {
      "messageID": "Unique-Message-ID",
      "payload": "<ORIGINAL_PAYLOAD>"
    }
    ```

### Vendor Client Application(s)

1. Create 2 separate "stores" that use the **Vendor** Client module.
   - Create one store called `acme-widgets` and `1-800-flowers`.
   - Connect to the CAPS Application Server using the `caps` namespace.
   - Both stores should "subscribe" to different Queues, since they are separate stores.
1. On startup, your client applications should trigger a `getAll` event that fetches all messages from the server that are in that **Vendor's** Queue (events/messages they've not yet received).
   - Trigger the `received` event with the correct payload to the server.
1. Subscribe to the `delivered` Queue.
   - Each client should be able to receive payloads "published" to the delivered Queue.
   - We still want to log a confirmation with the "order-id" and payload.

### Driver Client Application

1. Refactor event logic to use Queues.
   - Make sure your **Driver** Client is subscribing to the appropriate **Vendor** Queues.
   - Upon connection, **Driver** Client can fetch any messages added to their subscribed Queues.

## CODE QUALITY / ENGINEERING GOALS

Once you have the application fully functional, consider ways to enhance your implementation by drying out your code, making it easier to extend in the future.

Rather than simply putting all the required logic in every file, create a Queue class library that you can include in each of the client applications to uniformly communicate, subscribe, etc with the Queue server. Consider this a library that we could install on any **Client** that wants to use our Queue **Server**.

For example, this would be the ideal code for a client subscriber application, like the ones described above. Given this as your target, how would you implement a client side "Queue" library, noted in the code below to handle the above requirements?

```javascript
const Queue = require('./lib/queue.js');
const companyID = '1-206-flowers';
const clientID = 'driver';
const queue = new Queue(companyID);
queue.subscribe('delivered' delivered);
queue.trigger('getall', clientID);
function delivered(payload) {
  console.log('Flowers Were Delivered', payload.code);
}
```

### Stretch Goal

Abstract all socket.io-client functionality by building a class that takes in a vendor name as a queueId parameter.  Your class should:
- have a socket connection.
- join a room with the same name as queueId.
- have a publish method that:
  - takes in an event and a payload as parameters.
  - uses its local socket emit property to emit event and payload
    - i.e. if your constructor contains: `this.socket = io(SOCKET_SERVER_URL)`, then `this.socket.emit()` is a thing!
- have a subscribe method that:
  - takes in an event and a callback as parameters.
  - uses its local socket on property to listen for the event and ultimately will accept a `handler` as the callback once invoked.

### Visual Validation

- Start all 3 servers.
  - Queue Server.
  - Both Client Application Servers.
- Stop one of your applications servers.
  - Re-send some requests to your queue.
  - This should leave some undelivered messages.
  - Re-start the application server.
    - It should do an immediate request of all queued messages and log them normally.

### Testing

- Write tests around all of your units.
- Test event handler functions (not event triggers themselves).
- Use jest [spies](https://jestjs.io/docs/jest-object#jestfnimplementation) and/or [mock functionality](https://jestjs.io/docs/manual-mocks) to assert that your handlers were called and ran as expected. (was `console.log()` called with the expected arguments?)

****

## UML


<img width="661" alt="Screenshot 2023-04-19 174847" src="https://user-images.githubusercontent.com/73040864/233229365-71f6ebc1-2516-48b8-8724-632ffdea1b0e.png">


****
