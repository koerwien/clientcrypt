const nacl = require('tweetnacl');
const { toByteArray, fromByteArray } = require('base64-js');

const encoder = new TextEncoder('utf-8');
const decoder =  new TextDecoder('utf-8');

const convertToUTF8 = uint8Array => decoder.decode(uint8Array);
const newNonce = () => nacl.randomBytes(nacl.secretbox.nonceLength);
const generateKey = secret => fromByteArray(nacl.hash(encoder.encode(secret)).subarray(32));

const encrypt = (message, key) => {
    let keyArray = toByteArray(key);
    const nounce = newNonce();
    const messageArray = encoder.encode(message);
    const box = nacl.secretbox(messageArray, nounce, keyArray);
    const cypherArray = new Uint8Array(nounce.length + box.length);
    cypherArray.set(nounce);
    cypherArray.set(box, nounce.length);
    return fromByteArray(cypherArray)
};

const decrypt = (cypher, key) => {
    const keyArray = toByteArray(key);
    const cypherArray = toByteArray(cypher);
    const nounce = cypherArray.slice(0, nacl.secretbox.nonceLength);
    const cypherArrayWithoutNounce = cypherArray.slice(nacl.secretbox.nonceLength, cypher.length);
    const messageArray = nacl.secretbox.open(cypherArrayWithoutNounce, nounce, keyArray);
    if (!messageArray) throw new Error("Could not decrypt message");
    return convertToUTF8(messageArray);
};

const ex = {
    generateKey,
    encrypt,
    decrypt
}
module.exports = ex;