#!/usr/bin/env node
/**
 * Génère un fichier .env local à partir de .env.example, en remplaçant
 * automatiquement les secrets par des valeurs aléatoires fortes.
 * Usage : node scripts/generate-env.js
 */
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const examplePath = path.join(__dirname, '..', '.env.example');
const targetPath = path.join(__dirname, '..', '.env');

if (fs.existsSync(targetPath)) {
  console.error('.env existe déjà — suppression manuelle requise avant régénération.');
  process.exit(1);
}

let content = fs.readFileSync(examplePath, 'utf-8');

const randomSecret = (bytes) => crypto.randomBytes(bytes).toString('base64');

content = content
  .replace('DB_PASSWORD=REPLACE_ME_STRONG_PASSWORD', `DB_PASSWORD=${randomSecret(24)}`)
  .replace('REDIS_PASSWORD=REPLACE_ME_STRONG_PASSWORD', `REDIS_PASSWORD=${randomSecret(24)}`)
  .replace('JWT_SECRET=REPLACE_ME_RANDOM_SECRET_MIN_32_CHARS', `JWT_SECRET=${randomSecret(48)}`);

fs.writeFileSync(targetPath, content);
console.log('.env généré avec des secrets aléatoires forts.');
console.log('Pensez à ajuster ALLOWED_ORIGINS selon votre besoin.');
