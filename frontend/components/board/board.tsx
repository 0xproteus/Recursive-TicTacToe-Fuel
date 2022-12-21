import styles from "./board.module.css"
import TicTacToe from "../tictactoe/tictactoe";
import { SlotState } from "../../pages";

interface Props {
    tictactoe_state: SlotState[][],
    game_state: SlotState[],
    nex_play_positon: number,
    make_play: (board: number, position: number) => void,
}

function Board({tictactoe_state, game_state, nex_play_positon, make_play}:Props){

    return (
        <div className= {styles.container}>
            <div className = {styles.line}>
                <TicTacToe tictactoe_state={tictactoe_state[0]} next_play_position= {nex_play_positon} game_state = {game_state[0]} index = {0} make_play = {make_play}/>
                <TicTacToe tictactoe_state={tictactoe_state[1]} next_play_position= {nex_play_positon} game_state = {game_state[1]} index = {1} make_play = {make_play}/>
                <TicTacToe tictactoe_state={tictactoe_state[2]} next_play_position= {nex_play_positon} game_state = {game_state[2]} index = {2} make_play = {make_play}/>
            </div>
            <div className = {styles.line}>
                <TicTacToe tictactoe_state={tictactoe_state[3]} next_play_position= {nex_play_positon} game_state = {game_state[3]} index = {3} make_play = {make_play}/>
                <TicTacToe tictactoe_state={tictactoe_state[4]} next_play_position= {nex_play_positon} game_state = {game_state[4]} index = {4} make_play = {make_play}/>
                <TicTacToe tictactoe_state={tictactoe_state[5]} next_play_position= {nex_play_positon} game_state = {game_state[5]} index = {5} make_play = {make_play}/>
            </div>
            <div className = {styles.line}>
                <TicTacToe tictactoe_state={tictactoe_state[6]} next_play_position= {nex_play_positon} game_state = {game_state[6]} index = {6} make_play = {make_play}/>
                <TicTacToe tictactoe_state={tictactoe_state[7]} next_play_position= {nex_play_positon} game_state = {game_state[7]} index = {7} make_play = {make_play}/>
                <TicTacToe tictactoe_state={tictactoe_state[8]} next_play_position= {nex_play_positon} game_state = {game_state[8]} index = {8} make_play = {make_play}/>
            </div>  
            
        </div>
    )

}

export default Board;