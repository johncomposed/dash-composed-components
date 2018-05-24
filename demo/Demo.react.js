import React, {Component} from 'react';
import {ExampleComponent, Reactive} from '../src';

const code = `
class Counter extends React.Component {
  render() {
    console.log('Rendered!', this.props, this.context)
    if (this.props && this.props.data) {
      data = this.props.data
      setProps = this.props.setProps
    }
    return (
      <center>
        <h1>hello world</h1>
        <input value={data.innerval} onChange={e=> setProps({innerval: e.target.value})} />
      </center>
    )
  }
}
`

const code2 = `
class Counter extends React.Component {
  constructor() {
    super()
    this.state = { count: 0 }
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState(state => ({ count: state.count + 1 }))
    }, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  render() {
    return (
      <center>
        <h3>
          {this.state.count}
        </h3>
      </center>
    )
  }
}`



class Demo extends Component {
    constructor() {
        super();
        this.state = {
            value: '',
            innerval: ''
        }
        this.setProps = this.setProps.bind(this)
    }
    
    setProps(newProps) {
      this.setState(newProps) 
    }

    render() {
        return (
            <div>
                <h1>dash-composed Demo</h1>
                <Reactive code={code2} />
                <Reactive code={code} data={{innerval: this.state.innerval}} setProps={this.setProps}   />

                <pre>{this.state.innerval}</pre>

                <hr/>
                <h2>ExampleComponent</h2>
                <ExampleComponent
                    label="This is an example label"
                    value={this.state.value}
                    setProps={newProps => this.setState({value: newProps.value})}
                />
                
                <hr/>
            </div>
        );
    }
}

export default Demo;
