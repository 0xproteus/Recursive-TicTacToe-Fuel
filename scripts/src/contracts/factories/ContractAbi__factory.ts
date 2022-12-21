/* Autogenerated file. Do not edit manually. */

/* tslint:disable */
/* eslint-disable */

/*
  Fuels version: 0.27.0
  Forc version: 0.32.2
  Fuel-Core version: 0.15.1
*/

import { Interface, Contract } from "fuels";
import type { Provider, BaseWalletLocked, AbstractAddress } from "fuels";
import type { ContractAbi, ContractAbiInterface } from "../ContractAbi";

const _abi = {
  "types": [
    {
      "typeId": 0,
      "type": "()",
      "components": [],
      "typeParameters": null
    },
    {
      "typeId": 1,
      "type": "(_, _, _, _, _, _, _)",
      "components": [
        {
          "name": "__tuple_element",
          "type": 2,
          "typeArguments": null
        },
        {
          "name": "__tuple_element",
          "type": 3,
          "typeArguments": null
        },
        {
          "name": "__tuple_element",
          "type": 9,
          "typeArguments": null
        },
        {
          "name": "__tuple_element",
          "type": 5,
          "typeArguments": null
        },
        {
          "name": "__tuple_element",
          "type": 5,
          "typeArguments": null
        },
        {
          "name": "__tuple_element",
          "type": 5,
          "typeArguments": null
        },
        {
          "name": "__tuple_element",
          "type": 9,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 2,
      "type": "[_; 9]",
      "components": [
        {
          "name": "__array_element",
          "type": 9,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 3,
      "type": "[_; 9]",
      "components": [
        {
          "name": "__array_element",
          "type": 2,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 4,
      "type": "b256",
      "components": null,
      "typeParameters": null
    },
    {
      "typeId": 5,
      "type": "enum Identity",
      "components": [
        {
          "name": "Address",
          "type": 6,
          "typeArguments": null
        },
        {
          "name": "ContractId",
          "type": 7,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 6,
      "type": "struct Address",
      "components": [
        {
          "name": "value",
          "type": 4,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 7,
      "type": "struct ContractId",
      "components": [
        {
          "name": "value",
          "type": 4,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 8,
      "type": "u64",
      "components": null,
      "typeParameters": null
    },
    {
      "typeId": 9,
      "type": "u8",
      "components": null,
      "typeParameters": null
    }
  ],
  "functions": [
    {
      "inputs": [
        {
          "name": "game_id",
          "type": 8,
          "typeArguments": null
        }
      ],
      "name": "join_game",
      "output": {
        "name": "",
        "type": 0,
        "typeArguments": null
      }
    },
    {
      "inputs": [
        {
          "name": "board",
          "type": 9,
          "typeArguments": null
        },
        {
          "name": "position",
          "type": 9,
          "typeArguments": null
        }
      ],
      "name": "make_play",
      "output": {
        "name": "",
        "type": 0,
        "typeArguments": null
      }
    },
    {
      "inputs": [
        {
          "name": "player",
          "type": 5,
          "typeArguments": null
        }
      ],
      "name": "player_state",
      "output": {
        "name": "",
        "type": 8,
        "typeArguments": null
      }
    },
    {
      "inputs": [],
      "name": "quit_game",
      "output": {
        "name": "",
        "type": 0,
        "typeArguments": null
      }
    },
    {
      "inputs": [],
      "name": "start_game",
      "output": {
        "name": "",
        "type": 8,
        "typeArguments": null
      }
    },
    {
      "inputs": [
        {
          "name": "game_id",
          "type": 8,
          "typeArguments": null
        }
      ],
      "name": "view",
      "output": {
        "name": "",
        "type": 1,
        "typeArguments": null
      }
    }
  ],
  "loggedTypes": [],
  "messagesTypes": []
}

export class ContractAbi__factory {
  static readonly abi = _abi
  static createInterface(): ContractAbiInterface {
    return new Interface(_abi) as unknown as ContractAbiInterface
  }
  static connect(
    id: string | AbstractAddress,
    walletOrProvider: BaseWalletLocked | Provider
  ): ContractAbi {
    return new Contract(id, _abi, walletOrProvider) as unknown as ContractAbi
  }
}
