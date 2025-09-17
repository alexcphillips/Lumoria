# Tech Stack

A **tech stack** is the group of technologies and frameworks a project uses.

This app is built with the **NestJS** framework. It's a bit different from typical code, so learning the two main APIs will feel unique. If you want to learn more about NestJS, check out the [official docs](https://docs.nestjs.com/).

The app is organized into **Modules**, **Services**, and **Controllers**:

---

### Controllers

Controllers set up the endpoints and handle responses. An **endpoint** or **route** is the `/menu` part of a URL like: https://www.dominos.com/menu

When an endpoint is hit, the controller receives the request and sends a response back. For example, clicking "Log In" and getting an error or success message is your controller talking to the server.

---

### Services

Services are the brains behind the controllers. A controller defines the route, and services hold the code that does the work.

Example: If we were Dominos with an order tracking route `/my-orders`:

- **OrdersController** → defines the `/my-orders` route
- **OrdersService** → contains the code that looks up the order and returns details to the controller

---

### Modules

Modules bundle everything together. You can import modules into other modules.

Example: A hypothetical **Orders Module** could import:

- `OrdersController`
- `OrdersService`
- Another module like a **TrackingModule**, which contains code that checks how far away your order is

---

### Database

We use **PostgreSQL** as the database for this app.

PostgreSQL is a **relational SQL database**, which means it stores data in **tables** with **columns** and **rows**.

SQL is the language used to query the database. For example:

```sql
SELECT * FROM MY_TABLE WHERE _id > 1;
```
