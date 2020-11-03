import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

   function Square(props) {
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
  }
  
  function after3Moves(turn, xNext){
      let player = "O"
      if (xNext)
      {
          player = "X"
      }
    
      if (player === "X")
      {
          //X starts on turn 0, then 2, then 4 so third move for X comes AFTER turn 4
          if (turn > 4)
          {
              return true
          }
          else
          {
              return false
          }
      }
      else
      {
          //if player is O
          //O starts on turn 1, then 3, then 5, so third move for O comes AFTER turn 5
          if (turn > 5)
          {
              return true
          }
          else
          {
              return false
          }
      }
  }

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }

  class Board extends React.Component {
    constructor(props)
    {
        super(props);
        this.state = {
            squares: Array(9).fill(null),
            xNext : true,
            turn : 0,
            select : false, 
            selectedPiece : NaN,
        }
    }

    handleClick(i)
    {
        //create a copy of squares to modify
        const squares = this.state.squares.slice();


        //if after 3 moves different behavior from normal
        if (after3Moves(this.state.turn, this.state.xNext))
        {
            //if a piece has already been selected
            if (this.state.select && isNaN(this.state.selectedPiece) === false)
            {
                
            }

            //else a piece has not already been selected by player
            else{
                //this means that this move must select a piece of his own to move

                //figure out what player this is
                let player = this.state.xNext ? 'X' : 'O'
                //get index of middle position of board arry
                let mid = Math.floor(this.state.squares.length / 2)

                //if player has chosen to select his own piece
                if (this.state.squares[i] === player)
                {

                    //if player doesn't control middle position
                    if (this.state.squares[mid] !== player)
                    {
                        //since he doesn't have to pick the middle position,
                        // and he has picked his own piece, he may select it
                        this.setState({
                            select:true,
                            selectedPiece:i,
                        })
                    }

                    //if the mid position is his, but he chosen to not select it
                    else if (this.state.squares[mid] === player && mid !== i)
                    {
//MUST FIX HE CAN PLACE IF ITS A WINNING MOVE                        
                        //he will have to try again at selecting
                        this.setState({
                            select:false,
                            selectedPiece:NaN,
                        });
                        return
                    }
                    //else, the mid position is his and he chosen to selected it
                    else
                    {
                        //he has selected the right position, and he will move it next turn
                        this.setState({
                            select:true,
                            selectedPiece : mid,
                        });
                        return

                    }
                }
                //he has chosen to select a piece that is either empty or not his 
                else
                {
                    // cannot do this after 3 moves, therefore he must try again
                    this.setState({
                        select:false,
                        selectedPiece:NaN,
                    });
                    return
                }

            }
        }

        //else if we 3 moves or before we have normal behavior 
        //where one cannot replace occupied squares, or play if theres a winner
        else if (calculateWinner(squares) || squares[i]) {
          return;
        }

        //if 3 moves or before and we have a valid move, make it
        //make move
        squares[i] = this.state.xNext ? 'X' : 'O';
        this.setState({
            squares: squares,
            xNext: !this.state.xNext,
            turn: this.state.turn + 1,
        });
    }

    renderSquare(i) {
      return (
      <Square 
            value = {this.state.squares[i]}
            onClick ={() => this.handleClick(i)}
      />
      );
    }
  
    render() {
        const winner = calculateWinner(this.state.squares);
        let status;
        if (winner) {
        status = 'Winner: ' + winner;
        } else {
            console.log(this.state.xNext)
        status = 'Next player: ' + (this.state.xNext ? 'X' : 'O');
        }

      return (
        <div>
          <div className="status">{status}</div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    render() {
      return (
        <div className="game">
          <div className="game-board">
            <Board />
          </div>
          <div className="game-info">
            <div>{/* status */}</div>
            <ol>{/* TODO */}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  