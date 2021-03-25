'use strict'

const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const rp = require('minimal-request-promise');


module.exports = function deleteOrder(orderId) {
    if (!orderId) throw new Error('Order ID is required for deleting the order');

    return docClient.get({
        TableName: 'pizza-orders',
        Key: {
            orderId: orderId
        }
    }).promise()
        .then(result => result.Item)
        .then(item => {
            if (item.orderStatus !== 'pending') throw new Error('Order status is not pending');


            return rp.delete(`https://some-like-it-hot.effortless-serverless.com/delivery/${orderId}`, {
                headers: {
                    "Authorization": "aunt-marias-pizzeria-1234567890",
                    "Content-type": "application/json"
                }
            })
                .then(() => {
                    return docClient.delete({
                        TableName: 'pizza-orders',
                        Key: {
                            orderId: orderId
                        }
                    }).promise()
                        .then((result) => {
                            console.log('Order is deleted!', result)
                            return result
                        })
                        .catch((deleteError) => {
                            console.log(`Oops, order is not deleted :(`, deleteError)
                            throw deleteError
                        });
                })
        })
}
/*function deleteOrder(orderId) {
    if (!orderId) throw new Error('Order ID is required for deleting the order');
    return docClient.delete({
        TableName: 'pizza-orders',
        Key: {
            orderId: orderId
        }
    }).promise()
        .then((result) => {
            console.log('Order is deleted!', result)
            return result
        })
        .catch((deleteError) => {
            console.log(`Oops, order is not deleted :(`, deleteError)
            throw deleteError
        });
}
module.exports = deleteOrder*/
