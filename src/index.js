import React from './react';
import ReactDOM from './react-dom';

class Counter extends React.Component {
  constructor( props ) {
      super( props );
      this.state = {
          num: 1
      }
  }

  componentWillMount() {
    console.log('11111');
  }

  componentWillUpdate(){
    console.log('update');
  }

  onClick() {
      this.setState( { num: this.state.num + 1 } );
  }

  render() {
      return (
          <div>
              <h1>count: { this.state.num }</h1>
              <button onClick={ () => this.onClick()}>add</button>
          </div>
      );
  }
}


// const Counter = ({name}) => {
//   const handleClick = (e) => {
//     name = 'hello'
//   }
//   return (
//     <div>
//       <span>{name}</span>
//       <button onClick={handleClick}>click</button>
//     </div>
//   )
// }

ReactDOM.render(
  <Counter name="hi"/>,
  document.getElementById( 'root' )
)