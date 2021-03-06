// @flow

// Framework
import { Meteor } from "meteor/meteor";

// Collections
import { Orders } from "./collection";

/**
 * Create a new order
 * 
 * @param  {Object} items The items in { id: quantity } format
 * @return {Number} The order id
 */
export const createOrder = items => {
  const itemsArr = [];
  for (const id of Object.keys(items)) {
    itemsArr.push({ productId: id, quantity: items[id] });
  }

  try {
    const orderId = Orders.insert({ items: itemsArr });
    return orderId;
  } catch (error) {
    throw new Meteor.Error(
      `${__filename}:createOrder.insertError`,
      `Could not insert order. Got error: ${error}`,
      error
    );
  }
};

/**
 * Get the most recently created order, not safe for production
 *
 * @returns {Object} A single order object.
 */
export const getLastOrder = () => {
  const options = { sort: { createdAt: -1 }, limit: 1 };
  try {
    const lastOrderCursor = Products.find({}, options);
    const lastOrder = lastOrderCursor.fetch()[0];
    return lastOrder;
  } catch (error) {
    throw new Meteor.Error(
      `${__filename}:getLastOrder.findOrFetchError`,
      `Could not find or fetch product. Got error: ${error}`,
      error
    );
  }
};

/**
 * Get an order by id
 *
 * @returns {Object} A single order object.
 */
export const getOrderById = orderId => {
  try {
    return Products.findOne(orderId);
  } catch (error) {
    throw new Meteor.Error(
      `${__filename}:getOrderById.findOrFetchError`,
      `Could not find or fetch product with order id: '${orderId}'`,
      error
    );
  }
};

// Register meteor methods.
Meteor.methods({
  "orders.createOrder": createOrder,
  "orders.getLastOrder": getLastOrder,
  "orders.getOrderById": getOrderById
});
