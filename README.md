# Dash-composed-components

A collection of dash components I've needed. 

Most notably `dash_composed.ReactComponent`, which allows you to write custom react components in your dash app that hook into dash's callback system.

Right now it's using the [buble](https://buble.surge.sh/guide/) compiler, but I'm planning on moving to babel-standalone in the future. 

Special thanks to Formidable Lab's [react-live](https://github.com/FormidableLabs/react-live) for inspiration and (blatantly) most of the transpiler code (MIT). 


## Note on Development
I'm not using the plotly builder scripts. Instead, I've moved the relevant parts of their build system into this repo. 


# dash_composed.ReactComponent

### Basic Props
Passed to Element:
```
{...elementProps} 
id, options, layout, data, data2, value, value2, setProps, fireEvent
```
