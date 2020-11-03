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

  function isNextTo(curr, i)
  {
      //reduce to row
      let x = Math.abs(Math.floor(i/3) - Math.floor(curr/3))
      //reduce to col
      let y = Math.abs(curr % 3 - i % 3)

      if (x <= 1 && y <= 1)
      {
          return true
      }
      return false
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

        if (calculateWinner(squares))
        {
            return;
        }

        //if after 3 moves different behavior from normal
        if (after3Moves(this.state.turn, this.state.xNext))
        {
            //if a valid piece has already been selected by player
            if (this.state.select && isNaN(this.state.selectedPiece) === false)
            {
                //if player has selected an occupied place by either him or the other 
                // player he can't move there - he must redo everything

                //if square he wants to move to is occupied
                if (this.state.squares[i])
                {
                    //reset his selection and make him redo his move
                    this.setState({
                        select:false,
                        selectedPiece:NaN,
                    });
                    console.log("selection made but occupied square")
                    return
                }
                //else square is unoccupied 
                else
                {
                    //but is the square to move to next to selectedPiece?
                    if (isNextTo(i, this.state.selectedPiece))
                    {
                        //make the move
                        //copy the array to modify
                        const copy = this.state.squares.slice()
                        copy[this.state.selectedPiece] = null
                        copy[i] = this.state.xNext ? 'X' : 'O';

                        this.setState({
                            squares: copy,
                            xNext: !this.state.xNext,
                            turn: this.state.turn + 1,
                            select: false,
                            selectedPiece: NaN,
                        });

                        console.log("valid selection and move finish")
                        return
                    }
                    else
                    {
                        //reset his selection and make him redo his move
                        this.setState({
                            select:false,
                            selectedPiece:NaN,
                        });
                        console.log("valid selection but move is too far")
                        return
                    }
                }
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
                        console.log("valid selection, player doesn't control mid")
                        return
                    }

                    //if the mid position is his, but he chosen to not select it
                    else if (this.state.squares[mid] === player && mid !== i)
                    {
                        /** 
                        //make a copy of array
                        const copy2 = this.state.squares.slice()
                        copy2[this.state.selectedPiece] = null
                        console.log(this.state.squares)
                        copy2[i] = this.state.xNext ? 'X' : 'O';
                        console.log(copy2)
                        //if it is a winning move, then he can play the move
                        if (calculateWinner(copy2))
                        {
                            this.setState({
                                squares: copy2,
                                xNext: !this.state.xNext,
                                turn: this.state.turn + 1,
                            });
                            return
                        }
                        */ 

                        

                        this.setState({
                            select:false,
                            selectedPiece:NaN,
                        });
                        console.log("invalid selection, player must select mid bc he controls middle")
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
                        console.log("valid selection of middle, player controls mid")
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
                    console.log("invalid selection - selection of piece not yours")
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
  