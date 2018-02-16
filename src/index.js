import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

/*class Square extends React.Component {
	
	//uno Square non mantiene più il proprio stato,
	//ma riceve un valore dal parent (Board) e lo informa quando viene cliccato
	// = CONTROLLED COMPONENT
	
	constructor(props) {
		super(props);
		this.state = {
				value: null,
		};
	}
	//non serve più da quando abbiamo aggiunto direttamente su Board
	//il raccoglimento degli stati degli Square, passati come props 'value'
	
  render() {
    return (
			//onClick chiamato come props,
			//funzione passata da Board nel renderSquare() collegata già a handleClick()
      <button className="square" onClick={() => this.props.onClick() } >
        { this.props.value }
      </button>
			//quando cliccato, dice a React di istanziare un click event listener
    );
  }
}*/

//una volta rimosso il costruttore, la classe consisterebbe solo in
//un render() method. Possiamo semplificare la sintassi con una funzione
//che semplicemente prende le props e le ritorna
function Square(props) {
	return (
		<button className="square" onClick={ props.onClick } >
			{ props.value }
		</button>
	);
}

class Board extends React.Component {
	
	//non più necessario da quando aggiungiamo lo storico delle mosse,
	//e quindi degli array in Game, prende 'squares' come props
	//non è più creato dal costruttore => vedi renderSquare()
	/*
	constructor(props) {
		super(props);
		this.state = {
			squares: Array(9).fill(null),
			isXnext: true,
		};
	}*/
	
  renderSquare(i) {
	  //aggiunge una props allo square, anche se non definita in precedenza
	  //di nome "value" --> da aggiungere nel render() di Square
    return ( <Square 
						 value={ this.props.squares[i] }
						 //necessaria un'altra funzione di passaggio poichè
						 //lo stato di Board è privato e non può essere cambiato direttamente da Square
						 onClick={() => this.props.onClick(i)} //this.handleClick(i)}
						 />
			//ora stiamo passando due props da Board a Square
		);
  }

  render() {
    return (
      <div>
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
	
	constructor(props) {
		super(props);
		//aggiunta di uno storico delle mosse,
		//inizialmente solo con la tabella vuota
		this.state = {
			history: [{
				squares: Array(9).fill(null),
			}],
			isXnext: true,
			stepNum: 0,
		}
	}
	
	jumpTo(step) {
		this.setState({
			stepNum: step,
			isXnext: (step%2)===0,
		});
	}
	
	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNum+1);
		const current = history[history.length-1];
		
		//con '.slice' si copia l'array e non si modifica direttamente quello originale
		//ad ogni mossa creiamo un nuovo array che si sovrappone a quello precedente
		const squares = current.squares.slice();
		if(squares[i] || computeWinner(squares)) {
			return;
		}
		
		//dentro 'squares' ci stanno gli stati dei
		//quadrati corrispondenti (non il quadrato stesso)
		squares[i] = this.state.isXnext? 'X' : 'O';
		this.setState({
			history: history.concat([{
				squares: squares,
			}]),
			//dopo aver messo la x, dice che tocca ad un altro simbolo
			isXnext: !this.state.isXnext,
			stepNum: history.length,
		});
	}
	
  render() {
		const history = this.state.history;
		//stage di gioco corrente è quello più recente nello storico
		const current = history[this.state.stepNum];
		const winner = computeWinner(current.squares);
		
		const moves = history.map((step, move) => {
			const desc = move ?
						'Go to move #' + move :
						'Restart game!';
			
			//ogni volta che fa render() aggiunge un button figlio
			//dopo quelli già presenti
			return(
				<li key={move}>
					<button onClick={() => this.jumpTo(move)}> {desc} </button>
				</li>
			);
		});
		
		let status;
		if (winner) {
			status = 'Winner is player ' + winner + '!';
		} else {
			status = 'Next player: ' + (this.state.isXnext ? 'X' : 'O');
		}
		
    return (
      <div className="game">
        <div className="game-board">
          <Board 
						squares={ current.squares }
						onClick={(i) => this.handleClick(i)}
						/>
					
        </div>
        <div className="game-info">
          <div>{ status }</div>
          <ol>{ moves }</ol>
        </div>
      </div>
    );
  }
}

//controlla il vincitore ad ogni render() della Board,
//controlla ogni possibile combinazione se ha tre simboli uguali
function computeWinner(squares) {
	const lines = [
		//tris in riga
		[0,1,2],
		[3,4,5],
		[6,7,8],
		//tris in colonna
		[0,3,6],
		[1,4,7],
		[2,5,8],
		//tris in diagonale
		[0,4,8],
		[2,4,6],
	];
	for (let i=0; i<lines.length; i++) {
		const [a,b,c] = lines[i];
		if(squares[a] && squares[a]===squares[b] && squares[b]===squares[c]) {
			//giocatore che vince
			return squares[a];
		}
	}
	return null;
}


ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
