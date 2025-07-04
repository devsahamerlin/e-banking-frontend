# E-Banking Frontend

## Besoins
On souhaite créer une application qui permet de gérer des comptes bancaires. chaque compte appartient à un client. un compte peut subir plusieurs opérations de type DEBIT ou CREDIT. Il existe deux types de comptes : Comptes courants et comptes épargnes.

Backend: https://github.com/devsahamerlin/e-banking-backend

## Rendu IHM Operations sur un compte

![account-search-form](images/account-search-form.png)

## Rendu IHM ajout d'un client

![add-customer](images/add-customer.png)

## Rendu IHM recherche d'un client

![search-customers](images/search-customers.png)

## Liste des clients

![customer-list](images/customer-list.png)

## Liste des compte d'un client

![customer-accounts](images/customer-accounts.png)

## Authentication and Authorization using GUARD and Interceptor

### Login Page

### ROLE_USER (can't add: new account. new customer, view operations form)

### For Not Authorized users

### ROLE_ADMIN (can add: new account. new customer, view operations form)

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.0.7.

## Development server

To start a local development server, run:

```bash
npm install chart.js ng2-charts --save
npm install @types/chart.js --save-dev
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
