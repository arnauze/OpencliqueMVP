import { aws_access_key_id, aws_secret_key } from '../env'

const AWS = require('aws-sdk')
let awsConfig = {
    "region": 'us-east-2',
    "endpoint" : 'http://dynamodb.us-east-2.amazonaws.com',
    "accessKeyId": aws_access_key_id, "secretAccessKey": aws_secret_key
}
AWS.config.update(awsConfig)

let db = new AWS.DynamoDB.DocumentClient()

// Function to get Data from a DynamoDB table
// Arguments:
// params: Object with field Key and TableName

export function getData(params) {
    db.get(params, (err, data) => {
        if (err) {
            console.log(err)
        }
        else {
            console.log(data)
        }
    })
}

// Function to add Data into a DynamoDB table
// Arguments:
// params: Object with field Item and TableName

export function putData(params) {
    db.put(params, (err, data) => {
        if (err) {
            console.log(err)
        }
        else {
            console.log(data)
        }
    })
}

// Function to scan Datas from a DynamoDB table
// Arguments:
// params: Object with TableName

export function scanTable(params) {
    db.scan(params, (err, data) => {
        if (err) {
            console.log(err)
        } else {
            console.log(data)
        }
    })
}

// Function to delete Data from a DynamoDB table
// Arguments:
// params: Object with TableName and Key

export function deleteData(params) {
    db.delete(params, (err, data) => {
        if (err) {
            console.log(err)
        } else {
            console.log(data)
        }
    })
}