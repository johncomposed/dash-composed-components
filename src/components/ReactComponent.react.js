import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { generateElement, renderElementAsync } from '../transpile'
import {all, equals, omit, without} from 'ramda'

const basicType = PropTypes.oneOfType([
  PropTypes.number,
  PropTypes.string,
  PropTypes.bool,
  PropTypes.obj,
  PropTypes.array
])

export default class ReactComponent extends Component {
    static propTypes = {
        /*The ID used to identify this compnent in Dash callbacks */
        id: PropTypes.string,
        
        code: PropTypes.string.isRequired,
        scope: PropTypes.obj,
        noInline: PropTypes.bool,
        
        containerEl: PropTypes.string,
        containerProps: PropTypes.obj,
        elementProps: PropTypes.obj,
        ignoredProps: PropTypes.array,
        
        /**
         * Dash-assigned callback that should be called whenever any of the
         * following properties change
         */
        setProps: PropTypes.func,
        
        options: basicType,
        layout: basicType,
        data:  basicType,
        data2: basicType,
        value: basicType,
        value2: basicType,

    }
  
    static defaultProps = {
      scope: {},
      noInline: false,
      
      containerEl: 'div',
      elementProps: {},
      containerProps: {},
      ignoredProps: [],

      options: {},
      layout: {},
      data: {},
      data2: {},
      value: "",
      value2: "",
    }
    
    constructor(props) {
      super()
      this.state = { code: props.code }
      this.setProps = this.setProps.bind(this)
    }
    
    componentDidMount() {
      const { code, scope, noInline } = this.props;
      
      // Transpilation arguments
      const input = { code, scope }
      
      const errorCallback = err => this.setState({ element: undefined, error: err.toString() })
      const renderElement = element => this.setState({ element })

      // State reset object
      const state = { unsafeWrapperError: undefined, error: undefined }

      try {
        if (noInline) {
          this.setState({ ...state, element: null }) // Reset output for async (no inline) evaluation
          renderElementAsync(input, renderElement, errorCallback)
        } else {
          renderElement(
            generateElement(input, errorCallback)
          )
        }
      } catch (error) {
          this.setState({ ...state, error: error.toString() })
      }
    }

    shouldComponentUpdate(nextProps, nextState) {
      const isPropEqual = key => equals(this.props[key], nextProps[key])
      const propsToCheck = without(this.props.ignoredProps, [
        // 'scope', 'code', 
        "containerProps",  "elementProps", 
        "options", "layout", "data", "data2", "value", "value2"
      ])

      if (equals(nextState, this.state) && all(isPropEqual)(propsToCheck)) {
        console.log(this.props.id)
        return false;
      }
        
      return true;
    }

    setProps(newProps) {
      if(this.props.setProps) {
        this.props.setProps(newProps)
      }
    }
  
    render() {
      if (this.state.error) {
        console.error(this.state.error)
      }
      
      const { 
        id, containerEl, containerProps,
        elementProps,
        options, layout, data, data2, value, value2
      } = this.props;
      const setProps = this.setProps

      
      const El = containerEl || 'div'
      const Element = this.state.element;
      
      return (
          <El id={id} {...containerProps}>{
            Element && <Element {...elementProps} {...{
              options, layout, data, data2, value, value2, setProps
            }} />
          }</El>
      );
    }
}
