/* global React, render, createPlotlyComponent, R */
// Assuming I have ramda
const Plot = createPlotlyComponent(window.Plotly);

class PlotlyHover extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      hovered: false,
      points: undefined,
      realX: 0,
      realY: 0,
      relayoutData: {}
    }
    
    this.handleHover = this.handleHover.bind(this);
    this.handleUnhover = this.handleUnhover.bind(this);
    // this.trigger = this.trigger.bind(this)
  }
  
  handleHover(data) {
    console.log('hover')
    const { options } = this.props; 
    
    const realX = data.points[0].xaxis.l2p(data.points[0].x) + data.points[0].xaxis._offset
    
    const avgY = data.points.reduce((a,b) => a + b.y, 0) / data.points.length
    const realY = data.points[0].yaxis.l2p(avgY)  + data.points[0].yaxis._offset;
    
    this.setState({
      hovered: true,
      points: data.points,
      realX, 
      realY,
      ...options
    })
  }
  handleUnhover(data) {
    console.log('unhover')
    this.setState({ hovered: false })
  }
  
  trigger(targetProp) {
    // Remember, valid setProps targets (according to the metadata.json python uses):
    // containerProps elementProps options layout data data2 value value2
    const {fireEvent, setProps, data} = this.props;
    return (eventData) => {
      setProps({
        [targetProp]: eventData
      });
      fireEvent({event: targetProp})
    }
  }
  
  render() {
    const {id, data, layout, options} = this.props
    
    const baseStyle = {
      position: 'absolute',
      pointerEvents: 'none',
      borderRadius: 3,
      border: '1px solid grey',
      padding: 2,
      background: 'white'
    }
    const style = !this.state.hovered ? 
      { ...baseStyle, left: -10000 } : 
      { ...baseStyle, left: this.state.realX  +20, top: this.state.realY -20 }
  
    const points = this.state.points

    const fakedata = [{
        x: [1, 2, 3, 4, 5],
        y: [1, 6, 3, 6, 1],
        mode: 'markers+lines',
        hoverinfo: 'none',
        type: 'scatter',
        name: 'Team A',
        marker: { size: 12 }
      }, 
      {
        x: [1, 2, 3, 4, 5],
        y: [1, 6, 3, 6, 1].map(n => n+3),
        name: 'Team B',
        hoverinfo: 'none', //'none',
        marker: { size: 12 }
      }];

      const fakelayout = { 
        autosize:true,
        hovermode: 'x+spikes',
        spikedistance: -1,
        xaxis: {
          spikecolor: 'grey',
          spikemode: 'toaxis+across',
          showspikes: true,
          spikesnap: 'cursor',
          range: Object.values(this.state.relayoutData),
        },
        yaxis: {
          // range: [0, 8]
        },
        title:'Data Labels Hover',
        //hovermode: false
      };

      return (
        <div style={{position: 'relative', width: '100%', height: '100%'}} >
          <Plot
            style={{width: "100%", height: "100%"}}
            data={fakedata}
            useResizeHandler={true}
            layout={fakelayout}
            config={{displayModeBar: false}}
            onRelayout={((relayoutData) => this.setState({relayoutData}))}
            onHover={(e) => this.handleHover(e)}
            onUnhover={(e) => this.handleUnhover(e)}
          />
          <div style={style} > { 
            points && points.map((d, i) => (
              <div key={i}> {d.data.name}: {d.x}, {d.y} </div> 
            ))
          } </div>
        </div>
      )
  }
}

render(PlotlyHover)
