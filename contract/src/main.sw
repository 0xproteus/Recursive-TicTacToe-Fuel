contract;

use std::storage::{StorageMap, StorageVec};
use std::auth::{AuthError, msg_sender};
use std::logging::log;

abi TicTacToe {
    #[storage( read)]
    fn player_state(player: Identity) -> u64;

    #[storage( read)]
    fn view(game_id: u64) -> Game;

    // #[storage( read)] Rust and Typescript SDK currently don't allow to return Vec
    // fn view_games() -> Vec<Game>;

    // #[storage( read)]
    // fn active_games() -> Vec<u64>;

    #[storage(write, read)]
    fn start_game();

    #[storage(write, read)]
    fn join_game(game_id:u64);

    #[storage(write, read)]
    fn make_play( board:u8, position:u8);

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
   games: StorageMap<u64,Game> = StorageMap {},
   player_state: StorageMap<Identity, u64> = StorageMap {},
   game_counter: u64 = 1,
   active_games: StorageVec<u64> = StorageVec {},
}

impl TicTacToe for Contract{

    #[storage( read)]
    fn player_state(player: Identity) -> u64{
        storage.player_state.get(player)
    }

    #[storage( read)]
    fn view(game_id: u64) -> Game{
        let game = storage.games.get(game_id);
        return game;
    }

    // #[storage( read)]
    // fn active_games() -> Vec<u64>{
    //     let mut games: Vec<u64> = Vec::new();

    //     let mut i = 0;
    //     while i < storage.active_games.len(){
    //         games.push(storage.active_games.get(i).unwrap());
    //         i += 1;
    //     }
    //     return games;
    // }

    // #[storage( read)]
    // fn view_games() -> Vec<Game>{
    //     let mut vec: Vec<Game> = Vec::new();
    //     let mut i = 0;
    //     while i < storage.active_games.len() {
    //         let game_id = storage.active_games.get(i).unwrap();
    //         vec.push(storage.games.get(game_id));
    //         i += 1;
    //     }
       
    //     return vec;
    // }

    #[storage(write, read)]
    fn start_game(){
        assert(storage.player_state.get(msg_sender().unwrap()) == 0);
        let  game_id = storage.game_counter;
        let mut game: Game = storage.games.get(game_id);
    
        game.player1 = msg_sender().unwrap();
        game.next_play_position = 10;
        game.next_player = msg_sender().unwrap();
        storage.games.insert(game_id, game);
        storage.game_counter += 1;
        storage.player_state.insert(msg_sender().unwrap(), game_id);
        storage.active_games.push(game_id);
        log((game_id, msg_sender().unwrap()));
    }

    #[storage(write, read)]
    fn join_game(game_id:u64){
        assert(storage.player_state.get(msg_sender().unwrap()) == 0);
        let mut game: Game = storage.games.get(game_id);
        assert(game.player2 == Identity::Address(Address::from(0x0000000000000000000000000000000000000000000000000000000000000000)));
        assert(game.player1 != Identity::Address(Address::from(0x0000000000000000000000000000000000000000000000000000000000000000)));
        game.player2 = msg_sender().unwrap();
        storage.player_state.insert(msg_sender().unwrap(), game_id);
        storage.games.insert(game_id, game);
        log((game_id, msg_sender().unwrap()));
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
        log((game_id,board, position, mark));
    }

    #[storage( read, write)]
    fn quit_game(){
        storage.player_state.insert(msg_sender().unwrap(), 0);
    }

}
