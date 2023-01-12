/* Autogenerated file. Do not edit manually. */

/* tslint:disable */
/* eslint-disable */

/*
  Fuels version: 0.27.0
  Forc version: 0.32.2
  Fuel-Core version: 0.15.1
*/

import type {
  Interface,
  FunctionFragment,
  DecodedValue,
  Contract,
  BytesLike,
  BigNumberish,
  InvokeFunction,
  BN,
} from 'fuels';

import type { Enum, Vec } from "./common";

export type IdentityInput = Enum<{ Address: AddressInput, ContractId: ContractIdInput }>;
export type IdentityOutput = Enum<{ Address: AddressOutput, ContractId: ContractIdOutput }>;

export type AddressInput = { value: string };
export type AddressOutput = AddressInput;
export type ContractIdInput = { value: string };
export type ContractIdOutput = ContractIdInput;
export type GameInput = { game_state: [BigNumberish, BigNumberish, BigNumberish, BigNumberish, BigNumberish, BigNumberish, BigNumberish, BigNumberish, BigNumberish], boards_state: [[BigNumberish, BigNumberish, BigNumberish, BigNumberish, BigNumberish, BigNumberish, BigNumberish, BigNumberish, BigNumberish], [BigNumberish, BigNumberish, BigNumberish, BigNumberish, BigNumberish, BigNumberish, BigNumberish, BigNumberish, BigNumberish], [BigNumberish, BigNumberish, BigNumberish, BigNumberish, BigNumberish, BigNumberish, BigNumberish, BigNumberish, BigNumberish], [BigNumberish, BigNumberish, BigNumberish, BigNumberish, BigNumberish, BigNumberish, BigNumberish, BigNumberish, BigNumberish], [BigNumberish, BigNumberish, BigNumberish, BigNumberish, BigNumberish, BigNumberish, BigNumberish, BigNumberish, BigNumberish], [BigNumberish, BigNumberish, BigNumberish, BigNumberish, BigNumberish, BigNumberish, BigNumberish, BigNumberish, BigNumberish], [BigNumberish, BigNumberish, BigNumberish, BigNumberish, BigNumberish, BigNumberish, BigNumberish, BigNumberish, BigNumberish], [BigNumberish, BigNumberish, BigNumberish, BigNumberish, BigNumberish, BigNumberish, BigNumberish, BigNumberish, BigNumberish], [BigNumberish, BigNumberish, BigNumberish, BigNumberish, BigNumberish, BigNumberish, BigNumberish, BigNumberish, BigNumberish]], next_play_position: BigNumberish, player1: IdentityInput, player2: IdentityInput, next_player: IdentityInput, winner: BigNumberish };
export type GameOutput = { game_state: [number, number, number, number, number, number, number, number, number], boards_state: [[number, number, number, number, number, number, number, number, number], [number, number, number, number, number, number, number, number, number], [number, number, number, number, number, number, number, number, number], [number, number, number, number, number, number, number, number, number], [number, number, number, number, number, number, number, number, number], [number, number, number, number, number, number, number, number, number], [number, number, number, number, number, number, number, number, number], [number, number, number, number, number, number, number, number, number], [number, number, number, number, number, number, number, number, number]], next_play_position: number, player1: IdentityOutput, player2: IdentityOutput, next_player: IdentityOutput, winner: number };

interface ContractAbiInterface extends Interface {
  functions: {
    active_games: FunctionFragment;
    join_game: FunctionFragment;
    make_play: FunctionFragment;
    player_state: FunctionFragment;
    quit_game: FunctionFragment;
    start_game: FunctionFragment;
    view: FunctionFragment;
    view_games: FunctionFragment;
  };

  encodeFunctionData(functionFragment: 'active_games', values: []): Uint8Array;
  encodeFunctionData(functionFragment: 'join_game', values: [BigNumberish]): Uint8Array;
  encodeFunctionData(functionFragment: 'make_play', values: [BigNumberish, BigNumberish]): Uint8Array;
  encodeFunctionData(functionFragment: 'player_state', values: [IdentityInput]): Uint8Array;
  encodeFunctionData(functionFragment: 'quit_game', values: []): Uint8Array;
  encodeFunctionData(functionFragment: 'start_game', values: []): Uint8Array;
  encodeFunctionData(functionFragment: 'view', values: [BigNumberish]): Uint8Array;
  encodeFunctionData(functionFragment: 'view_games', values: []): Uint8Array;

  decodeFunctionData(functionFragment: 'active_games', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'join_game', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'make_play', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'player_state', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'quit_game', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'start_game', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'view', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'view_games', data: BytesLike): DecodedValue;
}

export class ContractAbi extends Contract {
  interface: ContractAbiInterface;
  functions: {
    active_games: InvokeFunction<[], Vec<BN>>;
    join_game: InvokeFunction<[game_id: BigNumberish], void>;
    make_play: InvokeFunction<[board: BigNumberish, position: BigNumberish], void>;
    player_state: InvokeFunction<[player: IdentityInput], BN>;
    quit_game: InvokeFunction<[], void>;
    start_game: InvokeFunction<[], void>;
    view: InvokeFunction<[game_id: BigNumberish], GameOutput>;
    view_games: InvokeFunction<[], Vec<GameOutput>>;
  };
}