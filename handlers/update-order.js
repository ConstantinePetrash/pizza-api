const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

function updateOrder(orderId, options){
    if(!options || !options.pizza || !options.address)
        throw new Error('Both pizza and address are required to update an order');

    return docClient.update({
        TableName: 'pizza-orders',
        Key:  {
            orderId: orderId
        },
        UpdateExpression: 'set pizza = :p, address=:a',
        ExpressionAttributeValues: {
            ':p': options.pizza,
            ':a': options.address
        },
        ReturnValues: 'ALL_NEW'
    }).promise()
        .then((res)=>{
            console.log(`Order ${orderId} was successfully updated`, res);
            return res.Attributes;
        })
        .catch((updateError)=>{
            console.log(`Oops, order is not updated :(`, updateError);
            throw updateError;
        });


}

module.exports = updateOrder;
