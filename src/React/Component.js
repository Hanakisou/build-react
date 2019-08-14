import { renderComponent } from '../ReactDOM/diff';
class Component {
  constructor(props = {}) {
    this.state = {};
    this.props = props;
  }

  setState(newState) {
    Object.assign(this.state, newState);
    renderComponent(this)
  }
}

export default Component;
