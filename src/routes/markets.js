const { Router } = require("express");

const route = Router();

route.use((req, res, next) => {
  if (req.user) next();
  else res.sendStatus(401);
});

const marketList = [
  {
    id: 1,
    miles: 0.6,
    store: "RK Trader",
  },
  { id: 2, miles: 1.6, store: "K Traders" },
  {
    id: 3,
    miles: 2.6,
    store: "Whole Foods",
  },
];

route.get("", (req, res) => {
  const {miles} = req.query;
  const parsedMiles = parseInt(miles);
  if(!isNaN(parsedMiles)) {
    const filterStores = marketList.filter((f) => f.miles <= parsedMiles);
    res.send(filterStores); 
  }
  else {
    res.send(marketList);
  }
});

module.exports = route;
