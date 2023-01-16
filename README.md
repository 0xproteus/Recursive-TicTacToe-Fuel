# Recursive-Tic-Tac-Toe-Fuel

## Overview

---

This project implements a game of Recursive Tic-Tac-Toe on the FuelVM. It is intended to experiment with some of the components of the Fuel toolchain.

Recursive Tic-Tac-Toe is a variation of the classic Tic-Tac-Toe game where each cell on the board contains a smaller Tic-Tac-Toe board. The objective of the game is to get three of your symbols in a row on the larger board. The position in which a player can make their move on the board is determined by the location of the previous player's move. For example, if the previous player made a move in the center and top-left corner of a cell, the next player must make their move in the top-left corner board. This adds an extra layer of strategy to the game, as players must not only consider their next move on the current board, but also how it will affect the smaller boards within it.

## Project Structure

---

The project contains 3 main folders:  
The contract folder contains the smart contract in Sway and tests in Rust.  
The scripts folder contains tests in typescript using Jest.  
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
