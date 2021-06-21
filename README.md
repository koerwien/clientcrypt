# Description

A minimalistic set of routines that allow password based client-side encryption of data before it is being sent to a remote server. Encryption is based on the tweetnacl routines. Encryption and decryption is symmetric and uses a private key that is computed from a given password and never leaves the client. It can  be stored in the client's browser's localstorage (on login with the given password) and should be removed from there on logout.

# Installation

`npm i clientcrypt`

# Api

## Generating a private key from a secret (typically from the user's password on login)

```javascript
import { generateKey, setEncryptionKeys } from 'clientcrypt';
const encryptionKey = generateKey(secret);
setEncryptionKeys(encryptionKey); // key is saved in localstorage for further usage
```

## Encrypting and decrypting data in base64 string format

```javascript
import { decrypt64, encrypt64 } from "clientcrypt";
const myData = "Hello, World!";
const cypher = encrypt64(myData); // Uses the private key from local storage
const plain = decrypt64(cypher); // plain === "Hello, World!"
```

## Remove private key on logout

```javascript
import { removeEncryptionKeys } from 'clientcrypt';
removeEncryptionKeys();
```

## Additional features (using the respective named imports from "clientcrypt"):

Encrypt string to byte array:
```javascript
const byteArray = encrypt(plainData, privateKey);
```

Decrypt byte array:
```javascript
const plainData = decrypt(byteArray, privateKey);
```

Choose custom names for the local storage keys:
```javascript
namesForKeys(encryptionKeyName, loginEncryptionKeyName);
```

Getting and setting keys in local storage:
```javascript
setEncryptionKey(key);
setLoginEncryptionKey(key);
const key = getEncryptionKey();
const key2 = getLoginEncryptionKey();
const { encryptionKey, loginEncryptionKey } = getEncryptionKeys();
if (encryptionKeysDiffer()) {
    console.log("encryptionKey !== loginEncryptionKey");
}
useLoginEncryptionKey(); // Now encryptionKey is set to the value of loginEncryptionKey
```

# A remark about the terms encryptionKey and loginEncryptionKey

For encryption and decryption, encryptionKey (stored in local storage) is used. A a copy of encryptionKey called loginEncryptionKey is saved in local storage when `setEncryptionKeys` is called. It can be used as follows: suppose the user's password has changed so data encrypted by his old password fails decryption with encryptionKey; luckily, the user has saved his former encryptionKey (or can generate it using his old password), so we can call setEncryptionKey() with that saved key, decrypt the old data, then call useLoginEncryptionKey() to update encryptionKey to its new value in local storage (corresponding to the new password). After that, we should update server data for that recovered old data after encrypting it (which will now happen with the updated encryptionKey).

# Author

Martin Koerwien at Tekplace Berlin


