import Amplify, { Storage } from 'aws-amplify';
import awsmobile from '../aws-exports';
Amplify.configure(awsmobile);
import RNFetchBlob from 'react-native-fetch-blob';
global.Buffer = require('buffer').Buffer;

function readFile(filePath) {
    return RNFetchBlob.fs.readFile(filePath, 'base64').then(data => new Buffer(data, 'base64'));
}

export async function addMedia(user, file) {
    var randomID = (Date.now() + Math.random()).toString()
    var key = user + '/' + randomID

    await readFile(file.url).then(async buffer => {
        await Storage.put(key, buffer, {
            contentType: file.type
        }).then(response => {
            return response
        }).catch(e => {
            console.log('error', e)
        })
    }).catch(e => {
        console.log(e);
    });
}

export function getMedia(user, filename) {
    params = {
        "Bucket": "openclique", 
        "Key": user + '/' + filename
    };
       
    s3.getObject(params, (err, data) => {
        if (err) {
            console.log(err)
        } else {
            console.log(data.Body.toString('utf-8'))
        }
    });
}