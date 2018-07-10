/* global React, render, createPlotlyComponent */
const { Radio } = window.antd

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;


class AntRadio extends React.Component {
    render() {
        const {options, layout, value, setProps} = this.props
        console.log(options, layout, value);

        return (
          <div style={{margin: 10, textAlign: 'center'}}>
            <RadioGroup  value={value} onChange={e=> setProps({value: e.target.value})} >
              {Object.keys(options).map(k => (
                <RadioButton key={k} value={k}>{options[k]}</RadioButton>

              ))}
            </RadioGroup>
          </div>
        )
    }
}

render(AntRadio)
