const crypto = require('crypto');
const fs = require('fs');

class Cryptography {
  static loadPublicKeyFromFile(path) {
    const keyStr = fs.readFileSync(path, 'utf-8');
    return crypto.createPublicKey(keyStr);
  }

  static loadPrivateKeyFromFile(path) {
    const keyStr = fs.readFileSync(path, 'utf-8');
    return crypto.createPrivateKey(keyStr);
  }

  static rsaSign(data, privateKey) {
    const signer = crypto.createSign('SHA256');
    signer.update(data);
    return signer.sign(privateKey);
  }

  static rsaSignToHex(data, privateKey) {
    const signature = this.rsaSign(data, privateKey);
    return signature.toString('hex');
  }

  static rsaVerify(data, signatureHex, publicKey) {
    const verifier = crypto.createVerify('SHA256');
    verifier.update(data);
    const signature = Buffer.from(signatureHex, 'hex');
    return verifier.verify(publicKey, signature);
  }

  static sha256text(text) {
    const hash = crypto.createHash('sha256');
    hash.update(text);
    return hash.digest('hex');
  }

  static bytesToHex(bytes, length = 0) {
    const hexArray = '0123456789ABCDEF';
    const bytesLength = length === 0 ? bytes.length : length;
    let hexChars = '';

    for (let j = 0; j < bytesLength; j++) {
      const v = bytes[j] & 0xFF;
      hexChars += hexArray.charAt(v >>> 4) + hexArray.charAt(v & 0x0F);
    }

    return hexChars;
  }
}

module.exports = Cryptography;