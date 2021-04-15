
const tests = [
    {
        title: "Clientcrypt object exists",
        run: () => {
            console.log("clientcrypt", clientcrypt)
            return typeof clientcrypt !== undefined
        }
    },
    {
        title: "Generating a key",
        run: () => {
            return clientcrypt.generateKey("TestKey");
        }
    },
    {
        title: "Encrypting a message",
        run: () => {
            return clientcrypt.encrypt("Hello, World!", clientcrypt.generateKey("TestKey"));
        }
    },
    {
        title: "Decrypting a message",
        run: () => {
            const key = clientcrypt.generateKey("TestKey");
            const encrypted = clientcrypt.encrypt("Hello, World!", key);
            return clientcrypt.decrypt(encrypted, key);
        }
    },
];

const getResult = test => {
    const result = test.run();
    if (typeof result === 'boolean') {
        return result ? 'OK' : 'Failed';
    } else {
        return result;
    }
}

onload = () => {
    const testContainer = document.getElementById('testContainer');

    let divElement, titleElement, paragraphElement;
    tests.forEach(test => {
        divElement = document.createElement('div');
        divElement.classList= "test";
        titleElement = document.createElement('span');
        titleElement.classList = "test-title";
        titleElement.innerText = test.title + ":";
        divElement.appendChild(titleElement);
        paragraphElement = document.createElement('span');
        paragraphElement.classList = "result";
        paragraphElement.innerText = getResult(test);
        divElement.appendChild(paragraphElement);
        testContainer.appendChild(divElement);
    });
}
