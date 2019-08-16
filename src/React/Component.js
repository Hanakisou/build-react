import { enqueueSetState } from './setStateQueue';
class Component {
  constructor(props = {}) {
    this.state = {};
    this.props = props;
  }

  setState(stateChange) {
    // Object.assign(this.state, newState);
    enqueueSetState(stateChange, this);
  }
}

export default Component;
