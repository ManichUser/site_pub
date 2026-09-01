# Plateforme de gains en ligne par visionnage de publicités

Plateforme (web + mobile) permettant à des utilisateurs de gagner de l'argent
en regardant des publicités vidéo, avec système d'affiliation et boosts
payants. Retraits via mobile money (Orange Money, MTN MoMo...).

Voir le cahier des charges complet fourni par le porteur de projet pour le
détail fonctionnel.

## Structure du dépôt (monorepo)

```
site_pub/
├── backend/     # API NestJS (en cours) — voir backend/README.md
├── web/         # Application web Next.js (à venir)
└── mobile/      # Application mobile React Native / Expo (à venir)
```

## Stack technique

- **Backend** : NestJS (Node.js/TypeScript), PostgreSQL, Redis, JWT
- **Web** : Next.js (React) — à venir
- **Mobile** : React Native + Expo — à venir
- **Paiement mobile money** : intégration agrégateur (CinetPay/PawaPay ou API
  directe opérateurs) — à venir

## État d'avancement

- [x] Backend — architecture modulaire de base (auth, users, ads,
      viewing-sessions, earnings, affiliation, boosts, payments, admin)
- [ ] Intégration mobile money réelle (retraits + achats de boosts)
- [ ] Application web
- [ ] Application mobile
- [ ] Anti-fraude avancé (device fingerprinting, détection multi-comptes)

## Points encore à valider avec le porteur de projet

Voir la section "Points à valider" du cahier des charges : pays/opérateurs
mobile money ciblés, barème exact des gains, portée de la commission
d'affiliation, grille tarifaire des boosts, origine des vidéos publicitaires,
seuil et frais de retrait, budget et délai global.
