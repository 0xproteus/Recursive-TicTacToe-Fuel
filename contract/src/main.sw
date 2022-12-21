contract;

use std::storage::StorageMap;
use std::auth::{AuthError, msg_sender};

abi TicTacToe {
    #[storage(write, read)]
    fn start_game() -> u64;

    #[storage(write, read)]
    fn join_game(game_id:u64);

    #[storage( read)]
    fn view(game_id: u64) ->([u8;9],[[u8;9];9],u8, Identity, Identity, Identity, u8);

    #[storage(write, read)]
    fn make_play( board:u8, position:u8);

    #[storage( read)]
    fn player_state(player: Identity) -> u64;

    #[storage( read, write)]
    fn quit_game();
}

struct Game{
    game_state: [u8;9],
    boards_state: [[u8;9];9],
    next_play_position: u8,
    player1: Identity,
    player2: Identity,
    next_player: Identity,
    winner: u8,
}

impl Game{
    fn check_board_winner(ref mut self, board_position:u8) {
        let mut game:[u8;9] = self.game_state;
        let board:[u8;9] = self.boards_state[board_position];
        let mut i: u8 = 0;
        let mut j: u8 = 0;
        while j < 3 {
            if board[i] == board[i+1] && board[i+2] == board[i+1] && board[i+2] != 0
            {
                game[board_position] = board[i];
                self.game_state = game;
                return;
            } else if board[j] == board[j+3] && board[j+6] == board[j+3] && board[j] != 0
            {
               game[board_position] = board[j];
               self.game_state = game;
                return;
            }
            i += 3;
            j += 1;
        }

        if board[0] == board[4] && board[4] == board[8] && board[4] != 0
        {
            game[board_position] = board[4];
            self.game_state = game;
            return;
        } else if  board[2] ==  board[4] && board[4] == board[6] && board[4] != 0
        {
            game[board_position] = board[4];
            self.game_state = game;
            return;
        }
    }

    fn check_game_winner(ref mut self){
        let mut game:[u8;9] = self.game_state;
        let mut i: u8 = 0;
        let mut j: u8 = 0;
        while j < 3 {
            if game[i] == game[i+1] && game[i+2] == game[i+1] && game[i+2] != 0
            {
                self.winner = game[i];
                return;
            } else if game[j] == game[j+3] && game[j+6] == game[j+3] && game[j] != 0
            {
               self.winner = game[j];
                return;
            }
            i += 3;
            j += 1;
        }

        if game[0] == game[4] && game[4] == game[8] && game[4] != 0
        {
            self.winner = game[4];
            return;
        } else if  game[2] ==  game[4] && game[4] == game[6] && game[4] != 0
        {
            self.winner = game[4];
            return;
        }
    }

}

storage{
   games: StorageMap<u16,Game> = StorageMap {},
   player_state: StorageMap<Identity, u64> = StorageMap {},
   game_counter: u64 = 1,
}

impl TicTacToe for Contract{
    #[storage(write, read)]
    fn start_game() -> u64{
        assert(storage.player_state.get(msg_sender().unwrap()) == 0);
        let  game_id = storage.game_counter;
        let mut game: Game = storage.games.get(game_id);
    
        game.player1 = msg_sender().unwrap();
        game.next_play_position = 10;
        game.next_player = msg_sender().unwrap();
        storage.games.insert(game_id, game);
        storage.game_counter += 1;
        storage.player_state.insert(msg_sender().unwrap(), game_id);
        return game_id;
    }

    #[storage(write, read)]
    fn join_game(game_id:u64){
        assert(storage.player_state.get(msg_sender().unwrap()) == 0);
        let mut game: Game = storage.games.get(game_id);
        assert(game.player2 == Identity::Address(Address::from(0x0000000000000000000000000000000000000000000000000000000000000000)));
        game.player2 = msg_sender().unwrap();
        storage.player_state.insert(msg_sender().unwrap(), game_id);
        storage.games.insert(game_id, game);
    }

    #[storage( read)]
    fn view(game_id: u64) ->([u8;9],[[u8;9];9], u8, Identity,Identity,Identity, u8){
        let game = storage.games.get(game_id);
        return (game.game_state, game.boards_state, game.next_play_position,game.player1, game.player2, game.next_player , game.winner);
    }

    #[storage( read)]
    fn player_state(player: Identity) -> u64{
        storage.player_state.get(player)
    }

    #[storage( read, write)]
    fn quit_game(){
        storage.player_state.insert(msg_sender().unwrap(), 0);
    }

    #[storage(write, read)]
    fn make_play( board:u8, position:u8){
        let game_id = storage.player_state.get(msg_sender().unwrap());
        assert(game_id != 0);
        let mut game: Game = storage.games.get(game_id);
        
        if game.next_play_position != 10 {
            assert(board == game.next_play_position);
        }
        assert(game.game_state[board] == 0);
        assert(game.boards_state[board][position] == 0);
        assert(game.next_player == msg_sender().unwrap());
        assert(board < 9 && position < 9);

        let mut mark: u8 = 2;
        if game.next_player == game.player1
        {
            mark = 1;
            game.next_player = game.player2;
        } else {
            game.next_player = game.player1;
        }

        let mut boards = game.boards_state;
        boards[board][position] = mark;
        game.boards_state = boards;
        game.check_board_winner(board);
        game.check_game_winner();
        if game.winner != 0 {
            storage.player_state.insert(game.player1, 0);
            storage.player_state.insert(game.player2, 0);
        }

        if game.game_state[position] == 0 {
            game.next_play_position = position;
        } else {
            game.next_play_position = 10;
        }
        storage.games.insert(game_id, game);
    }

}


// use std::storage::StorageMap;
// use std::auth::{AuthError, msg_sender};

// abi TicTacToe {
//     #[storage(write, read)]
//     fn start_game() -> u16;

//      #[storage( read)]
//     fn view() ->([u8;9],[[u8;9];9]);

//     #[storage( read,write)]
//     fn modify();
// }

// struct Game{
//     board: [u8;9],
//     boards: [[u8;9];9],
//     x: u16,
// }

// impl Game{
//     fn start(ref mut self){
//         let mut array2 = self.boards;
//         let mut array = self.board;
//         array[5] =5;
//         self.board = array;
//         let mut counter = 0;
//         while counter < 9{
//             array2[0][counter] =4;
//             counter+=1;
//         }
//         array2[0][4] = 6;
//         self.boards = array2;
//     }
// }

// storage{
//    games: StorageMap<u16,Game> = StorageMap {},
//    boards: StorageMap<u16,[u8;9]> = StorageMap {},
// }

// impl TicTacToe for Contract{
//      #[storage(write, read)]
//     fn start_game() -> u16{
//        let mut game: Game = Game{
//         board: [1;9],
//         boards: [[9;9];9],
//         x: 10,
//        };
//        let mut counter = 0;
//        let mut array = game.board;
//       // while counter < 9{
//             array[2] = 2;
//             game.board = array;
//           //  counter +=1;
//        //}
//        game.start();
//       storage.games.insert(0,game);
      
//     //    let mut boards = storage.boards.get(0);
//     //        let mut counter = 0;
//     //    while counter < 9{
//     //         boards[counter] = 1;
//     //         counter +=1;
//     //    }
//     //    storage.boards.insert(0,boards);
//        return 0;
//     }

//     #[storage( read)]
//     fn view() ->([u8;9],[[u8;9];9]){
//         // let mut array:[u8;9] = [0;9];
//         // let mut counter= 0;
//         // let game = storage.game.get(0);
//         // while counter < 9 {
//         //     array[counter] = game.board.get(counter).unwrap();
//         //     counter +=1;
//         // }
//         return (storage.games.get(0).board, storage.games.get(0).boards);
//         //return storage.boards.get(0);
//     }

    

//     #[storage( read,write)]
//     fn modify() {
//         let mut game: Game = storage.games.get(0);
//         let mut array = game.board;
//         array[3] = 3;
//         game.board = array;
//         storage.games.insert(0,game);
//     }
// }



// contract;

// use std::storage::StorageMap;
// use std::auth::{AuthError, msg_sender};

// abi TicTacToe {
//     #[storage(write, read)]
//     fn start_game() -> u16;

//     #[storage(write, read)]
//     fn join_game(game_id: u16);

//     #[storage(read, write)]
//     fn make_play(game_id: u16, board: u8, position: u8);

//     #[storage(read)]
//     fn get_game(game_id: u16) -> ([[u8; 9]; 9], [u8; 9], u8, Identity, Identity, Identity, u8);
// }

// storage {
//     small_boards_state: StorageMap<(u16, u8, u8), u8> = StorageMap {},
//     next_play_position: StorageMap<u16, u8> = StorageMap {},
//     big_board_state: StorageMap<(u16, u8), u8> = StorageMap {},
//     player1: StorageMap<u16, Identity> = StorageMap {},
//     player2: StorageMap<u16, Identity> = StorageMap {},
//     player_turn: StorageMap<u16, Identity> = StorageMap {},
//     winner: StorageMap<u16, u8> = StorageMap {},
//     game_counter: u16 = 0,
// }

// impl TicTacToe for Contract {
//     #[storage(read)]
//     fn get_game(game_id: u16) -> ([[u8; 9]; 9], [u8; 9], u8, Identity, Identity, Identity, u8) {
//         let small: [[u8; 9]; 9] = [
//             [
//                 storage.small_boards_state.get((game_id, 0, 0)),
//                 storage.small_boards_state.get((game_id, 0, 1)),
//                 storage.small_boards_state.get((game_id, 0, 2)),
//                 storage.small_boards_state.get((game_id, 0, 3)),
//                 storage.small_boards_state.get((game_id, 0, 4)),
//                 storage.small_boards_state.get((game_id, 0, 5)),
//                 storage.small_boards_state.get((game_id, 0, 6)),
//                 storage.small_boards_state.get((game_id, 0, 7)),
//                 storage.small_boards_state.get((game_id, 0, 8)),
//             ],
//             [
//                 storage.small_boards_state.get((game_id, 1, 0)),
//                 storage.small_boards_state.get((game_id, 1, 1)),
//                 storage.small_boards_state.get((game_id, 1, 2)),
//                 storage.small_boards_state.get((game_id, 1, 3)),
//                 storage.small_boards_state.get((game_id, 1, 4)),
//                 storage.small_boards_state.get((game_id, 1, 5)),
//                 storage.small_boards_state.get((game_id, 1, 6)),
//                 storage.small_boards_state.get((game_id, 1, 7)),
//                 storage.small_boards_state.get((game_id, 1, 8)),
//             ],
//             [
//                 storage.small_boards_state.get((game_id, 2, 0)),
//                 storage.small_boards_state.get((game_id, 2, 1)),
//                 storage.small_boards_state.get((game_id, 2, 2)),
//                 storage.small_boards_state.get((game_id, 2, 3)),
//                 storage.small_boards_state.get((game_id, 2, 4)),
//                 storage.small_boards_state.get((game_id, 2, 5)),
//                 storage.small_boards_state.get((game_id, 2, 6)),
//                 storage.small_boards_state.get((game_id, 2, 7)),
//                 storage.small_boards_state.get((game_id, 2, 8)),
//             ],
//             [
//                 storage.small_boards_state.get((game_id, 3, 0)),
//                 storage.small_boards_state.get((game_id, 3, 1)),
//                 storage.small_boards_state.get((game_id, 3, 2)),
//                 storage.small_boards_state.get((game_id, 3, 3)),
//                 storage.small_boards_state.get((game_id, 3, 4)),
//                 storage.small_boards_state.get((game_id, 3, 5)),
//                 storage.small_boards_state.get((game_id, 3, 6)),
//                 storage.small_boards_state.get((game_id, 3, 7)),
//                 storage.small_boards_state.get((game_id, 3, 8)),
//             ],
//             [
//                 storage.small_boards_state.get((game_id, 4, 0)),
//                 storage.small_boards_state.get((game_id, 4, 1)),
//                 storage.small_boards_state.get((game_id, 4, 2)),
//                 storage.small_boards_state.get((game_id, 4, 3)),
//                 storage.small_boards_state.get((game_id, 4, 4)),
//                 storage.small_boards_state.get((game_id, 4, 5)),
//                 storage.small_boards_state.get((game_id, 4, 6)),
//                 storage.small_boards_state.get((game_id, 4, 7)),
//                 storage.small_boards_state.get((game_id, 4, 8)),
//             ],
//             [
//                 storage.small_boards_state.get((game_id, 5, 0)),
//                 storage.small_boards_state.get((game_id, 5, 1)),
//                 storage.small_boards_state.get((game_id, 5, 2)),
//                 storage.small_boards_state.get((game_id, 5, 3)),
//                 storage.small_boards_state.get((game_id, 5, 4)),
//                 storage.small_boards_state.get((game_id, 5, 5)),
//                 storage.small_boards_state.get((game_id, 5, 6)),
//                 storage.small_boards_state.get((game_id, 5, 7)),
//                 storage.small_boards_state.get((game_id, 5, 8)),
//             ],
//             [
//                 storage.small_boards_state.get((game_id, 6, 0)),
//                 storage.small_boards_state.get((game_id, 6, 1)),
//                 storage.small_boards_state.get((game_id, 6, 2)),
//                 storage.small_boards_state.get((game_id, 6, 3)),
//                 storage.small_boards_state.get((game_id, 6, 4)),
//                 storage.small_boards_state.get((game_id, 6, 5)),
//                 storage.small_boards_state.get((game_id, 6, 6)),
//                 storage.small_boards_state.get((game_id, 6, 7)),
//                 storage.small_boards_state.get((game_id, 6, 8)),
//             ],
//             [
//                 storage.small_boards_state.get((game_id, 7, 0)),
//                 storage.small_boards_state.get((game_id, 7, 1)),
//                 storage.small_boards_state.get((game_id, 7, 2)),
//                 storage.small_boards_state.get((game_id, 7, 3)),
//                 storage.small_boards_state.get((game_id, 7, 4)),
//                 storage.small_boards_state.get((game_id, 7, 5)),
//                 storage.small_boards_state.get((game_id, 7, 6)),
//                 storage.small_boards_state.get((game_id, 7, 7)),
//                 storage.small_boards_state.get((game_id, 7, 8)),
//             ],
//             [
//                 storage.small_boards_state.get((game_id, 8, 0)),
//                 storage.small_boards_state.get((game_id, 8, 1)),
//                 storage.small_boards_state.get((game_id, 8, 2)),
//                 storage.small_boards_state.get((game_id, 8, 3)),
//                 storage.small_boards_state.get((game_id, 8, 4)),
//                 storage.small_boards_state.get((game_id, 8, 5)),
//                 storage.small_boards_state.get((game_id, 8, 6)),
//                 storage.small_boards_state.get((game_id, 8, 7)),
//                 storage.small_boards_state.get((game_id, 8, 8)),
//             ],
//         ];

//         let big: [u8; 9] = [
//             storage.big_board_state.get((game_id, 0)),
//             storage.big_board_state.get((game_id, 1)),
//             storage.big_board_state.get((game_id, 2)),
//             storage.big_board_state.get((game_id, 3)),
//             storage.big_board_state.get((game_id, 4)),
//             storage.big_board_state.get((game_id, 5)),
//             storage.big_board_state.get((game_id, 6)),
//             storage.big_board_state.get((game_id, 7)),
//             storage.big_board_state.get((game_id, 8)),
//         ];

//         return (
//             small,
//             big,
//             storage.next_play_position.get(game_id),
//             storage.player1.get(game_id),
//             storage.player2.get(game_id),
//             storage.player_turn.get(game_id),
//             storage.winner.get(game_id),
//         );
//     }

//     #[storage(read, write)]
//     fn start_game() -> u16 {
//         let game_counter: u16 = storage.game_counter;

//         storage.player1.insert(game_counter, msg_sender().unwrap());
//         storage.player_turn.insert(game_counter, msg_sender().unwrap());
//         storage.next_play_position.insert(game_counter, 10);

//         storage.game_counter += 1;
//         return game_counter;
//     }

//     #[storage(read, write)]
//     fn join_game(game_id: u16) {
//         storage.player2.insert(game_id, msg_sender().unwrap());
//     }

//     #[storage(read, write)]
//     fn make_play(game_id: u16, board: u8, position: u8) {
//         assert(storage.winner.get(game_id) == 0);
//         assert(storage.player_turn.get(game_id) == msg_sender().unwrap());

//         if storage.next_play_position.get(game_id) != 10 {
//             assert(board == storage.next_play_position.get(game_id));
//         }

//         assert(storage.big_board_state.get((game_id, board)) == 0);
//         assert(board < 9 && position < 9);

//         assert(storage.small_boards_state.get((game_id, board, position)) == 0);

//         let mut mark: u8 = 2;
//         if storage.player_turn.get(game_id) == storage.player1.get(game_id)
//         {
//             mark = 1;
//             storage.player_turn.insert(game_id, storage.player2.get(game_id));
//         } else {
//             storage.player_turn.insert(game_id, storage.player1.get(game_id));
//         }

//         storage.small_boards_state.insert((game_id, board, position), mark);

//         let mut i: u8 = 0;
//         let mut j: u8 = 0;
//         while j < 3 {
//             if storage.small_boards_state.get((game_id, board, i)) == storage.small_boards_state.get((game_id, board, i + 1))
//                 && storage.small_boards_state.get((game_id, board, i + 2)) == storage.small_boards_state.get((game_id, board, i + 1))
//                 && storage.small_boards_state.get((game_id, board, i)) != 0
//             {
//                 storage.big_board_state.insert((game_id, board), mark);
//             } else if storage.small_boards_state.get((game_id, board, j)) == storage.small_boards_state.get((game_id, board, j + 3))
//                 && storage.small_boards_state.get((game_id, board, j + 6)) == storage.small_boards_state.get((game_id, board, j + 3))
//                 && storage.small_boards_state.get((game_id, board, j)) != 0
//             {
//                 storage.big_board_state.insert((game_id, board), mark);
//             }
//             i += 3;
//             j += 1;
//         }

//         if storage.small_boards_state.get((game_id, board, 0)) == storage.small_boards_state.get((game_id, board, 4))
//             && storage.small_boards_state.get((game_id, board, 4)) == storage.small_boards_state.get((game_id, board, 8))
//             && storage.small_boards_state.get((game_id, board, 4)) != 0
//         {
//             storage.big_board_state.insert((game_id, board), mark);
//         } else if storage.small_boards_state.get((game_id, board, 2)) == storage.small_boards_state.get((game_id, board, 4))
//             && storage.small_boards_state.get((game_id, board, 4)) == storage.small_boards_state.get((game_id, board, 6))
//             && storage.small_boards_state.get((game_id, board, 4)) != 0
//         {
//             storage.big_board_state.insert((game_id, board), mark);
//         }

//         i = 0;
//         j = 0;
//         while j < 3 {
//             if storage.big_board_state.get((game_id, i)) == storage.big_board_state.get((game_id, i + 1))
//                 && storage.big_board_state.get((game_id, i + 2)) == storage.big_board_state.get((game_id, i + 1))
//                 && storage.big_board_state.get((game_id, i)) != 0
//             {
//                 storage.winner.insert(game_id, mark);
//             } else if storage.big_board_state.get((game_id, j)) == storage.big_board_state.get((game_id, j + 3))
//                 && storage.big_board_state.get((game_id, j + 6)) == storage.big_board_state.get((game_id, j + 3))
//                 && storage.big_board_state.get((game_id, j)) != 0
//             {
//                 storage.winner.insert(game_id, mark);
//             }
//             i += 3;
//             j += 1;
//         }

//         if storage.big_board_state.get((game_id, 0)) == storage.big_board_state.get((game_id, 4))
//             && storage.big_board_state.get((game_id, 4)) == storage.big_board_state.get((game_id, 8))
//             && storage.big_board_state.get((game_id, 4)) != 0
//         {
//             storage.winner.insert(game_id, mark);
//         } else if storage.big_board_state.get((game_id, 2)) == storage.big_board_state.get((game_id, 4))
//             && storage.big_board_state.get((game_id, 4)) == storage.big_board_state.get((game_id, 6))
//             && storage.big_board_state.get((game_id, 4)) != 0
//         {
//             storage.winner.insert(game_id, mark);
//         }

//         if storage.big_board_state.get((game_id, position)) == 0 {
//             storage.next_play_position.insert(game_id, position);
//         } else {
//             storage.next_play_position.insert(game_id, 10);
//         }
//     }
// }
































// abi TicTacToe {
//     #[storage(write,read)]
//     fn start_game();
//     #[storage(write,read)]
//     fn join_game() ;
//     #[storage(read,write)]
//     fn make_play(board: u8, position: u8);
//     #[storage(read)]
//     fn get_game() -> ([[u8;9];9], [u8;9], u8,  Identity, Identity, Identity, u8);
// }
// storage{
//     small_boards_state: StorageMap<(u8,u8),u8> =  StorageMap{} ,
//     big_board_state: StorageMap<u8,u8> = StorageMap{},
//     next_play_position: u8 = 0,
//     player1: Identity = Identity::Address(~Address::from(0x000000000000000000000000000000000000000000000000000000000000002A)),
//     player2: Identity= Identity::Address(~Address::from(0x000000000000000000000000000000000000000000000000000000000000002A)),
//     player_turn: Identity= Identity::Address(~Address::from(0x00000000000000000000000000000000000000000000000000000000000000BA)),
//     winner: u8 = 0,
    
// }
// impl TicTacToe for Contract {
    
//     #[storage(read)]
//     fn get_game() -> ([[u8;9];9], [u8;9], u8,  Identity, Identity, Identity, u8){
//         let small: [[u8;9];9] = [[storage.small_boards_state.get((0,0)),
//         storage.small_boards_state.get((0,1)),
//         storage.small_boards_state.get((0,2)),
//         storage.small_boards_state.get((0,3)),
//         storage.small_boards_state.get((0,4)),
//         storage.small_boards_state.get((0,5)),
//         storage.small_boards_state.get((0,6)),
//         storage.small_boards_state.get((0,7)),
//         storage.small_boards_state.get((0,8))],
//         [storage.small_boards_state.get((1,0)),
//         storage.small_boards_state.get((1,1)),
//         storage.small_boards_state.get((1,2)),
//         storage.small_boards_state.get((1,3)),
//         storage.small_boards_state.get((1,4)),
//         storage.small_boards_state.get((1,5)),
//         storage.small_boards_state.get((1,6)),
//         storage.small_boards_state.get((1,7)),
//         storage.small_boards_state.get((1,8))],
//         [storage.small_boards_state.get((2,0)),
//         storage.small_boards_state.get((2,1)),
//         storage.small_boards_state.get((2,2)),
//         storage.small_boards_state.get((2,3)),
//         storage.small_boards_state.get((2,4)),
//         storage.small_boards_state.get((2,5)),
//         storage.small_boards_state.get((2,6)),
//         storage.small_boards_state.get((2,7)),
//         storage.small_boards_state.get((2,8))],
//         [storage.small_boards_state.get((3,0)),
//         storage.small_boards_state.get((3,1)),
//         storage.small_boards_state.get((3,2)),
//         storage.small_boards_state.get((3,3)),
//         storage.small_boards_state.get((3,4)),
//         storage.small_boards_state.get((3,5)),
//         storage.small_boards_state.get((3,6)),
//         storage.small_boards_state.get((3,7)),
//         storage.small_boards_state.get((3,8))],
//         [storage.small_boards_state.get((4,0)),
//         storage.small_boards_state.get((4,1)),
//         storage.small_boards_state.get((4,2)),
//         storage.small_boards_state.get((4,3)),
//         storage.small_boards_state.get((4,4)),
//         storage.small_boards_state.get((4,5)),
//         storage.small_boards_state.get((4,6)),
//         storage.small_boards_state.get((4,7)),
//         storage.small_boards_state.get((4,8))],
//         [storage.small_boards_state.get((5,0)),
//         storage.small_boards_state.get((5,1)),
//         storage.small_boards_state.get((5,2)),
//         storage.small_boards_state.get((5,3)),
//         storage.small_boards_state.get((5,4)),
//         storage.small_boards_state.get((5,5)),
//         storage.small_boards_state.get((5,6)),
//         storage.small_boards_state.get((5,7)),
//         storage.small_boards_state.get((5,8))],
//         [storage.small_boards_state.get((6,0)),
//         storage.small_boards_state.get((6,1)),
//         storage.small_boards_state.get((6,2)),
//         storage.small_boards_state.get((6,3)),
//         storage.small_boards_state.get((6,4)),
//         storage.small_boards_state.get((6,5)),
//         storage.small_boards_state.get((6,6)),
//         storage.small_boards_state.get((6,7)),
//         storage.small_boards_state.get((6,8))],
//         [storage.small_boards_state.get((7,0)),
//         storage.small_boards_state.get((7,1)),
//         storage.small_boards_state.get((7,2)),
//         storage.small_boards_state.get((7,3)),
//         storage.small_boards_state.get((7,4)),
//         storage.small_boards_state.get((7,5)),
//         storage.small_boards_state.get((7,6)),
//         storage.small_boards_state.get((7,7)),
//         storage.small_boards_state.get((7,8))],
//         [storage.small_boards_state.get((8,0)),
//         storage.small_boards_state.get((8,1)),
//         storage.small_boards_state.get((8,2)),
//         storage.small_boards_state.get((8,3)),
//         storage.small_boards_state.get((8,4)),
//         storage.small_boards_state.get((8,5)),
//         storage.small_boards_state.get((8,6)),
//         storage.small_boards_state.get((8,7)),
//         storage.small_boards_state.get((8,8))]];
//         let big: [u8;9] = [
//             storage.big_board_state.get(0),
//             storage.big_board_state.get(1),
//             storage.big_board_state.get(2),
//             storage.big_board_state.get(3),
//             storage.big_board_state.get(4),
//             storage.big_board_state.get(5),
//             storage.big_board_state.get(6),
//             storage.big_board_state.get(7),
//             storage.big_board_state.get(8)
//         ];
//         return ( small, big, storage.next_play_position, storage.player1, storage.player2, storage.player_turn, storage.winner);
//     }
//     #[storage(write,read)]
//     fn start_game() {
//         storage.player1 = msg_sender().unwrap();
//         storage.player_turn = msg_sender().unwrap();
//         storage.next_play_position = 10;
//         storage.winner = 0;
//         let mut i = 0;
        
//         while i < 9 {
//             storage.big_board_state.insert(i, 0);
//             let mut j = 0;
//             while j< 9 {
//                 storage.small_boards_state.insert((i,j),0);
//                 j+=1;
//             }
//             i+=1;
//         }
  
//     }
//     #[storage(write,read)]
//     fn join_game()  {
//         storage.player2 = msg_sender().unwrap();
       
//     }
//     #[storage(read,write)]
//     fn make_play(board: u8, position: u8){
//         assert(storage.winner == 0);
//         assert(storage.player_turn == msg_sender().unwrap());
//         if storage.next_play_position != 10 {
//             assert(board == storage.next_play_position);
//         }
//         assert(storage.big_board_state.get(board) == 0);
//         assert(board < 9 && position < 9);
//         assert(storage.small_boards_state.get((board, position)) == 0);
//         let mut mark: u8 = 2;
//         if storage.player_turn == storage.player1{
//             mark = 1;
//             storage.player_turn = storage.player2;
//         } else {
//             storage.player_turn = storage.player1;
//         }
//         storage.small_boards_state.insert((board, position), mark);
//         let mut i:u8 = 0;
//         let mut j:u8 = 0;
//         while j < 3{
//             if storage.small_boards_state.get((board,i)) == storage.small_boards_state.get((board,i+1)) && storage.small_boards_state.get((board,i+2)) == storage.small_boards_state.get((board,i+1)) && storage.small_boards_state.get((board,i)) != 0{
//                 storage.big_board_state.insert(board,mark);
                
//             } else if storage.small_boards_state.get((board,j)) == storage.small_boards_state.get((board,j+3)) && storage.small_boards_state.get((board,j+6)) == storage.small_boards_state.get((board,j+3)) && storage.small_boards_state.get((board,j)) != 0{
//                 storage.big_board_state.insert(board,mark);
               
//             }
//             i += 3;
//             j += 1;
//         }
//         if storage.small_boards_state.get((board,0)) == storage.small_boards_state.get((board,4 )) && storage.small_boards_state.get((board,4 )) == storage.small_boards_state.get((board,8 )) && storage.small_boards_state.get((board,4 )) != 0{
//             storage.big_board_state.insert(board,mark);
            
//         } else if storage.small_boards_state.get((board,2 )) == storage.small_boards_state.get((board,4 )) && storage.small_boards_state.get((board,4 )) == storage.small_boards_state.get((board,6 )) && storage.small_boards_state.get((board,4 )) != 0{
//             storage.big_board_state.insert(board,mark);
//         }
//         i = 0;
//         j = 0;
//         while j < 3{
//             if storage.big_board_state.get(i) == storage.big_board_state.get(i+1) && storage.big_board_state.get(i+2) == storage.big_board_state.get(i+1) && storage.big_board_state.get(i) != 0{
//                 storage.winner = mark;
                
//             } else if storage.big_board_state.get(j) == storage.big_board_state.get(j+3) && storage.big_board_state.get(j+6) == storage.big_board_state.get(j+3) && storage.big_board_state.get(j) != 0{
//                 storage.winner = mark;
               
//             }
//             i += 3;
//             j += 1;
//         }
//         if storage.big_board_state.get(0) == storage.big_board_state.get(4) && storage.big_board_state.get(4) == storage.big_board_state.get(8) && storage.big_board_state.get(4) != 0{
//             storage.winner = mark;
            
//         } else if storage.big_board_state.get(2) == storage.big_board_state.get(4) && storage.big_board_state.get(4) == storage.big_board_state.get(6) && storage.big_board_state.get(4) != 0{
//             storage.winner = mark;
//         }
//         if storage.big_board_state.get(position) == 0{
//             storage.next_play_position = position;
//         } else {
//             storage.next_play_position = 10;
//         }
//     }
// }
