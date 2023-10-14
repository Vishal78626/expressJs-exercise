const { Router } = require("express");

const route = Router();

route.use((req, res, next) => {
  if (req.user) next();
  else res.sendStatus(401);
});

const groceryList = [
  {
    item: "milk",
    quantity: 2,
  },
  {
    item: "water",
    quantity: 4,
  },
  {
    item: "coffee",
    quantity: 1,
  },
];

route.get("/groceries", (req, res) => {
  res.cookie("visited", true, {
    maxAge: 60000,
  });
  res.send(groceryList);
});

route.get("/groceries/:item", (req, res) => {
  console.log(req.cookies);
  const { item } = req.params;
  const groceriesItem = groceryList.find((g) => g.item === item);
  res.status(200).send(groceriesItem);
});

route.post("/groceries", (req, res) => {
  console.log(req.body);
  groceryList.push(req.body);
  res.send(201);
});

route.get("/shopping/cart", (req, res) => {
  const { cart } = req.session;
  if (!cart) {
    res.send("You don't have session");
  } else {
    res.send(cart);
  }
});

route.post("/shopping/cart/item", (req, res) => {
  const cartItem = req.body;
  const { cart } = req.session;
  if (cart) {
    req.session.cart.items.push(cartItem);
  } else {
    req.session.cart = {
      items: [cartItem],
    };
  }
  res.send(201);
});

module.exports = route;
