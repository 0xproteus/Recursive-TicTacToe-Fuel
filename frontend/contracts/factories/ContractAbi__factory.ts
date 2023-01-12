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
      "type": "(_, _)",
      "components": [
        {
          "name": "__tuple_element",
          "type": 14,
          "typeArguments": null
        },
        {
          "name": "__tuple_element",
          "type": 6,
          "typeArguments": []
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 2,
      "type": "(_, _, _, _)",
      "components": [
        {
          "name": "__tuple_element",
          "type": 14,
          "typeArguments": null
        },
        {
          "name": "__tuple_element",
          "type": 15,
          "typeArguments": null
        },
        {
          "name": "__tuple_element",
          "type": 15,
          "typeArguments": null
        },
        {
          "name": "__tuple_element",
          "type": 15,
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
          "type": 15,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 4,
      "type": "[_; 9]",
      "components": [
        {
          "name": "__array_element",
          "type": 3,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 5,
      "type": "b256",
      "components": null,
      "typeParameters": null
    },
    {
      "typeId": 6,
      "type": "enum Identity",
      "components": [
        {
          "name": "Address",
          "type": 9,
          "typeArguments": null
        },
        {
          "name": "ContractId",
          "type": 10,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 7,
      "type": "generic T",
      "components": null,
      "typeParameters": null
    },
    {
      "typeId": 8,
      "type": "raw untyped ptr",
      "components": null,
      "typeParameters": null
    },
    {
      "typeId": 9,
      "type": "struct Address",
      "components": [
        {
          "name": "value",
          "type": 5,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 10,
      "type": "struct ContractId",
      "components": [
        {
          "name": "value",
          "type": 5,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 11,
      "type": "struct Game",
      "components": [
        {
          "name": "game_state",
          "type": 3,
          "typeArguments": null
        },
        {
          "name": "boards_state",
          "type": 4,
          "typeArguments": null
        },
        {
          "name": "next_play_position",
          "type": 15,
          "typeArguments": null
        },
        {
          "name": "player1",
          "type": 6,
          "typeArguments": null
        },
        {
          "name": "player2",
          "type": 6,
          "typeArguments": null
        },
        {
          "name": "next_player",
          "type": 6,
          "typeArguments": null
        },
        {
          "name": "winner",
          "type": 15,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 12,
      "type": "struct RawVec",
      "components": [
        {
          "name": "ptr",
          "type": 8,
          "typeArguments": null
        },
        {
          "name": "cap",
          "type": 14,
          "typeArguments": null
        }
      ],
      "typeParameters": [
        7
      ]
    },
    {
      "typeId": 13,
      "type": "struct Vec",
      "components": [
        {
          "name": "buf",
          "type": 12,
          "typeArguments": [
            {
              "name": "",
              "type": 7,
              "typeArguments": null
            }
          ]
        },
        {
          "name": "len",
          "type": 14,
          "typeArguments": null
        }
      ],
      "typeParameters": [
        7
      ]
    },
    {
      "typeId": 14,
      "type": "u64",
      "components": null,
      "typeParameters": null
    },
    {
      "typeId": 15,
      "type": "u8",
      "components": null,
      "typeParameters": null
    }
  ],
  "functions": [
    {
      "inputs": [],
      "name": "active_games",
      "output": {
        "name": "",
        "type": 13,
        "typeArguments": [
          {
            "name": "",
            "type": 14,
            "typeArguments": null
          }
        ]
      }
    },
    {
      "inputs": [
        {
          "name": "game_id",
          "type": 14,
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
          "type": 15,
          "typeArguments": null
        },
        {
          "name": "position",
          "type": 15,
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
          "type": 6,
          "typeArguments": null
        }
      ],
      "name": "player_state",
      "output": {
        "name": "",
        "type": 14,
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
        "type": 0,
        "typeArguments": null
      }
    },
    {
      "inputs": [
        {
          "name": "game_id",
          "type": 14,
          "typeArguments": null
        }
      ],
      "name": "view",
      "output": {
        "name": "",
        "type": 11,
        "typeArguments": null
      }
    },
    {
      "inputs": [],
      "name": "view_games",
      "output": {
        "name": "",
        "type": 13,
        "typeArguments": [
          {
            "name": "",
            "type": 11,
            "typeArguments": null
          }
        ]
      }
    }
  ],
  "loggedTypes": [
    {
      "logId": 0,
      "loggedType": {
        "name": "",
        "type": 1,
        "typeArguments": null
      }
    },
    {
      "logId": 1,
      "loggedType": {
        "name": "",
        "type": 2,
        "typeArguments": null
      }
    },
    {
      "logId": 2,
      "loggedType": {
        "name": "",
        "type": 1,
        "typeArguments": null
      }
    }
  ],
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
