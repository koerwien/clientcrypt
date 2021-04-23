const nacl = require('tweetnacl');
const { toByteArray, fromByteArray } = require('base64-js');

// Basics

const encoder = new TextEncoder('utf-8');
const decoder =  new TextDecoder('utf-8');

const convertToUTF8 = uint8Array => decoder.decode(uint8Array);
const newNonce = () => nacl.randomBytes(nacl.secretbox.nonceLength);
const generateKey = secret => fromByteArray(nacl.hash(encoder.encode(secret)).subarray(32));

const encrypt = (message, key) => {
    if ( ! key) key = getEncryptionKey();
    let keyArray = toByteArray(key);
    const nounce = newNonce();
    const messageArray = encoder.encode(message);
    const box = nacl.secretbox(messageArray, nounce, keyArray);
    const cypherArray = new Uint8Array(nounce.length + box.length);
    cypherArray.set(nounce);
    cypherArray.set(box, nounce.length);
    return cypherArray;
};

const encrypt64 = (message, key) => fromByteArray(encrypt(message, key));

const decrypt = (cypherArray, key) => {
    if ( ! key) key = getEncryptionKey();
    const keyArray = toByteArray(key);
    const nounce = cypherArray.slice(0, nacl.secretbox.nonceLength);
    const cypherArrayWithoutNounce = cypherArray.slice(nacl.secretbox.nonceLength, cypherArray.length);
    const messageArray = nacl.secretbox.open(cypherArrayWithoutNounce, nounce, keyArray);
    if (!messageArray) throw new Error("Could not decrypt message");
    return convertToUTF8(messageArray);
};

const decrypt64 = (cypher64, key) => decrypt(toByteArray(cypher64), key);

// Application

const encryptWithLoginKey = data => encrypt(data, getLoginEncryptionKey());
const encryptWithKey = data => encrypt(data);
const decryptWithKey = cypher => decrypt(cypher);

// Local storage for storing the key

let localStorageNameForKey = 'encryptionKey';
let localStorageNameForLoginKey = 'loginEncryptionKey';

const namesForKeys = (name1, name2) => {
    localStorageNameForKey = name1;
    localStorageNameForSessionKey = name2;
};

// Setting localstorage
const setEncryptionKey = key => localStorage.setItem(localStorageNameForKey, key);
const setLoginEncryptionKey = key => localStorage.setItem(localStorageNameForLoginKey, key);
const setEncryptionKeys = key => {
    setEncryptionKey(key);
    setLoginEncryptionKey(key);
}

// Getting from localstorage
const getEncryptionKey = () => localStorage.getItem(localStorageNameForKey);
const getLoginEncryptionKey = () => localStorage.getItem(localStorageNameForLoginKey);
const getEncryptionKeys = () => ({
    encryptionKey: getEncryptionKey(),
    loginEncryptionKey: getLoginEncryptionKey()
});

// Removing from localstorage
const removeEncryptionKeys = () => {
    localStorage.removeItem(localStorageNameForKey);
    localStorage.removeItem(localStorageNameForLoginKey);
}

// Conveniences
const encryptionKeysDiffer = () => getEncryptionKey() !== getLoginEncryptionKey();
const useLoginEncryptionKey = () => {
    setEncryptionKey(getLoginEncryptionKey());
}

const api = {
    generateKey,
    encrypt,
    decrypt,
    encrypt64,
    decrypt64,
    namesForKeys,
    setEncryptionKey,
    setLoginEncryptionKey,
    setEncryptionKeys,
    getEncryptionKey,
    getLoginEncryptionKey,
    getEncryptionKeys,
    removeEncryptionKeys,
    encryptionKeysDiffer,
    useLoginEncryptionKey
}
module.exports = api;