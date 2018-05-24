# import dash_composed
import lib as dash_composed

import dash
import dash_html_components as html
import json 
app = dash.Dash('')

app.scripts.config.serve_locally = True
app.config['suppress_callback_exceptions']=True


code = """
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
    console.log('tick')
    return (
      <center>
        <h3>
          {this.state.count}
        </h3>
      </center>
    )
  }
}
"""


code2 = """
class What extends React.Component {
  render() {
    console.log('Rendered')
    const {value, data2, setProps} = this.props
    return (
      <center>
        <h2>{data2.msg}</h2>
        <input value={value} onChange={e=> setProps({value: e.target.value})} />
      </center>
    )
    
  }
}

"""


@app.callback(
	dash.dependencies.Output('zero-store', 'children'),
	[dash.dependencies.Input('zero', 'value')])
def display_output(value):
    return value

@app.callback(
	dash.dependencies.Output('zero', 'data2'),
	[dash.dependencies.Input('input', 'value')])
def display_output(value):
    return dict(msg = value)


app.layout = html.Div([
    html.Div([
        dash_composed.ReactComponent(id="zero", code=code2, value='wowza'),
        html.Pre(id='zero-store', style={'overflowY':'scroll', 'maxHeight': '400px'})
    ]),

    dash_composed.ReactComponent(id="one", code=code),

    dash_composed.ExampleComponent(
        id='input',
        value='my-value',
        label='my-label'
    ),
    html.Div(id='output')
])

@app.callback(
	dash.dependencies.Output('output', 'children'),
	[dash.dependencies.Input('input', 'value')])
def display_output(value):
    return 'You have entered {}'.format(value)

if __name__ == '__main__':
    app.run_server(debug=True)
