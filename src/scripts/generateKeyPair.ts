/**
 * This module will generate a public and private keypair and save to current directory
 *
 * Make sure to save the private key elsewhere after generated!
 */
import crypto from 'crypto';
import fs from 'fs';
import { resolve } from 'path';

function genKeyPair() {
  // Generates an object where the keys are stored in properties `privateKey` and `publicKey`
  const keyPair = crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096, // bits - standard for RSA keys
    publicKeyEncoding: {
      type: 'pkcs1', // "Public Key Cryptography Standards 1"
      format: 'pem' // Most common formatting choice
    },
    privateKeyEncoding: {
      type: 'pkcs1', // "Public Key Cryptography Standards 1"
      format: 'pem' // Most common formatting choice
    }
  });

  const getDirectory = (type: 'pub' | 'priv') => {
    const keyName = `id_rsa_${type}.pem`;
    return resolve(__dirname, '..', '..', keyName);
  };

  // Create the public key file
  fs.writeFileSync(getDirectory('pub'), keyPair.publicKey);

  // Create the private key file
  fs.writeFileSync(getDirectory('priv'), keyPair.privateKey);
}

// Generate the keypair
genKeyPair();
