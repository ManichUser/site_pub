# Backend — API Plateforme de gains publicitaires

API NestJS modulaire exposant les fonctionnalités décrites dans le cahier
des charges : authentification, visionnage de publicités et gains,
parrainage, boosts payants, retraits mobile money, back-office admin.

## Démarrage rapide

```bash
# 1. Copier le fichier d'environnement et l'ajuster si besoin
cp .env.example .env

# 2. Démarrer PostgreSQL et Redis (via Docker)
docker compose up -d

# 3. Installer les dépendances
npm install

# 4. Lancer l'API en mode développement (hot-reload)
npm run start:dev
```

L'API est alors disponible sur `http://localhost:3000/api/v1`.

- Vérification santé : `GET /api/v1/health`

## Organisation des modules

| Module            | Rôle |
|--------------------|------|
| `auth`             | Inscription, connexion, vérification OTP, JWT |
| `users`            | Profil utilisateur, solde, parrainage, KYC |
| `ads`              | Catalogue des publicités vidéo |
| `viewing-sessions` | Enregistrement des visionnages + validation anti-fraude basique |
| `earnings`         | Paliers de gain (barème configurable) et crédit des gains |
| `affiliation`      | Calcul et suivi des commissions de parrainage |
| `boosts`           | Boosts payants (multiplicateur / réducteur d'effort) |
| `payments`         | Demandes de retrait mobile money |
| `admin`            | Back-office (statistiques, modération — à enrichir) |

## Points à finaliser avant mise en production

Ces éléments sont scaffoldés avec des `TODO` explicites dans le code :

- **OTP par SMS** : `modules/auth/otp.service.ts` utilise un stockage en
  mémoire et un simple log pour le développement. À remplacer par Redis +
  un vrai fournisseur SMS.
- **Mobile money** : `modules/payments/payments.service.ts` gère le flux de
  demande de retrait, mais l'appel réel à l'agrégateur (CinetPay, PawaPay...)
  reste à intégrer.
- **Anti-fraude avancée** : device fingerprinting, détection de comptes
  multiples, limitation de fréquence par IP (Redis) — la validation actuelle
  du visionnage ne vérifie que la durée déclarée.
- **Boosts appliqués aux gains** : le multiplicateur/réducteur d'un boost
  actif n'est pas encore pris en compte dans `EarningsService`.
- **Migrations TypeORM** : `synchronize: true` est activé uniquement en
  développement ; prévoir des migrations avant la mise en production.

## Tests

```bash
npm run test       # tests unitaires
npm run test:e2e   # tests end-to-end
```
