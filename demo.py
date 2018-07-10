import dash_composed
# import lib as dash_composed

import dash
import dash_html_components as html
import dash_core_components as dcc
import json
app = dash.Dash('')

# app.scripts.config.serve_locally = True
app.config['suppress_callback_exceptions'] = True
app.scripts.append_script({
    "external_url": [
        "https://cdnjs.cloudflare.com/ajax/libs/ramda/0.25.0/ramda.min.js",
        "https://cdnjs.cloudflare.com/ajax/libs/dygraph/2.1.0/dygraph.js"
    ]
})

from os import path
from pathlib import Path
require = lambda jsfile: Path(path.relpath(jsfile)).read_text()

DygraphCode = require('./demo-components/Dygraph.js')
PlotHover = require('./demo-components/Plotly-Hover.js')


RelayoutCode = """
    class Relayout extends React.Component { 
        constructor(props) {
            super(props);
            this.gd = 0 
            this.if_update = 0
        }

        componentDidMount() { 
            const {value, layout, setProps} = this.props;
            this.gd = document.getElementById(value)
        }
     
        componentWillReceiveProps(nextProps) {
            const {layout, setProps} = this.props
            if ( JSON.stringify(nextProps.layout) != JSON.stringify(layout) ){
                this.if_update = 1
            }
        }
        
        render() {
           const {id, layout, style} = this.props;
           if ( this.if_update == 1 & this.gd != 0 ){
               this.if_update = 0
               // Note the `Plotly` react component is passed into the scope, hence this.
               window.Plotly.relayout(this.gd , layout)
           }
           return (
                <div id={id} style={style}></div>
            )
        }
    }
"""

InputComponent = """
    class What extends React.Component {
        render() {
            console.log('Rendered')
            const {value, data2, setProps} = this.props
            return (
            <center>
                <style>{`
                .fullwidthplot {
                width: 100%;
                height: 100%;
                }
                `}</style>
                <h2>{data2.msg}</h2>
                <input value={value} onChange={e=> setProps({value: e.target.value})} />
            </center>
            )

        }
    }
"""

# Data
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

date_today = datetime.now()
days = pd.date_range(date_today, date_today + timedelta(7), freq='D')

np.random.seed(seed=1111)
a = np.random.randint(1, high=100, size=len(days))
np.random.seed(seed=1122)
b = np.random.randint(1, high=100, size=len(days))

df = pd.DataFrame({'date': days, 'A': a, 'B': b})
df = df.set_index('date')
data = df.to_records()

options = {
    "labels": ["x", "A", "B"],
    "style": {"width": "100%"}
}

# Layout
app.layout = html.Div([
    html.Link(rel="stylesheet", href="//cdnjs.cloudflare.com/ajax/libs/dygraph/2.1.0/dygraph.min.css"),
    html.Div([
        dash_composed.ReactComponent(id="zero", code=InputComponent, value='wowza'),
        html.Pre(id='zero-store', style={'overflowY': 'scroll', 'maxHeight': '400px'})
    ]),

    dash_composed.ReactComponent(id="dygraph", code=DygraphCode, noInline=True,
        data=data, options=options, layout=dict(parseDates=True)),

    dcc.Graph(id='plotlygraph', figure={'data': [{'x': [1, 2, 3], 'y': [4, 1, 2]}], 'layout': {'hovermode': 'closest'}}),

    dash_composed.ReactComponent(id='relayout', code=RelayoutCode, value="plotlygraph"),
    dash_composed.ReactComponent(id='special-hover-plot', code=PlotHover, noInline=True, data=[]),
    
    
    dash_composed.ExampleComponent(
        id='input',
        value='my-value',
        label='my-label'
    ),
    html.Div(id='output')
])



# Callbacks
@app.callback(
    dash.dependencies.Output('zero-store', 'children'),
    [dash.dependencies.Input('zero', 'value')])
def display_output(value):
    return value


@app.callback(
    dash.dependencies.Output('zero', 'data2'),
    [dash.dependencies.Input('input', 'value')])
def display_output1(value):
    return dict(msg=value)


@app.callback(
    dash.dependencies.Output('output', 'children'),
    [dash.dependencies.Input('input', 'value')])
def display_output2(value):
    return 'You have entered {}'.format(value)



@app.callback(
    dash.dependencies.Output('relayout', 'layout'),
    [dash.dependencies.Input('input', 'value')])
def myfun(x):
    return {'title': x}

if __name__ == '__main__':
    app.run_server(debug=True)
