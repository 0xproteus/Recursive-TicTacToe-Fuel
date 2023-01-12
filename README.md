# Recursive-Tic-Tac-Toe-Fuel

## Overview

---

This project implements a game of Recursive Tic-Tac-Toe on the FuelVM. It is intended to experiment with some of the components of the Fuel toolchain.  
In Recursive Tic-Tac-Toe there is board with 9 cells just like regular Tic-Tac-Toe but inside each cell there is another game of Tic-Tac-Toe occurring, in order to win you have to allign 3 winning Tic-Tac-Toes.  
The position in the board on which you can play in is determined by the action of the player in the previous turn, so if they played in the board center and, top left corner of the cell the next player must make a move in the board top left corner.

## Project Structure

---

The project contains 3 main folders:  
The contract folder contains the smart contract in Sway and tests in Rust.  
The scripts folder contains tests using typescript using Jest.  
The frontend folder contains a frontend to interact with the smart contract using Next.js.

```
.
├── README.md
├── contract
│   ├── Cargo.lock
│   ├── Cargo.toml
│   ├── Forc.lock
│   ├── Forc.toml
│   ├── src
│   └── tests
├── frontend
│   ├── README.md
│   ├── components
│   ├── contexts
│   ├── contracts
│   ├── next.config.js
│   ├── package.json
│   ├── pages
│   ├── public
│   ├── styles
│   ├── tsconfig.json
│   └── yarn.lock
└── scripts
    ├── babel.config.js
    ├── contracts
    ├── jest.config.js
    ├── package.json
    ├── script.ts
    ├── tsconfig.json
    ├── ttt.test.ts
    └── yarn.lock
```

## Running the Project

---

### Build the contract

To build the contract install [Fuels](https://fuellabs.github.io/sway/latest/) and run:

```
 cd contract
 forc build
```

### Running tests

To run tests in Rust run:

```
 cd contract
 forc build
 cargo test
```

To run tests in typescript using [Jest](https://jestjs.io/) run on a terminal:

```
 fuel-core run --db-type in-memory
```

Then open a second terminal and run:

```
 cd scripts
 yarn
 yarn test
```

### Start the Front End

To run the front end first install [Fuel wallet](https://fuels-wallet.vercel.app/docs/install/), and then run:

```
 cd frontend
 yarn
 yarn dev
```
