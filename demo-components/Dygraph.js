/* global React, render, Plot */

const R = window.R
const DygraphBase = window.Dygraph


class InteractionModelProxy {
    constructor(fireEvent) {
        this._target = DygraphBase.defaultInteractionModel;

        for (const method of ['mousedown', 'touchstart', 'touchmove', 'touchend', 'dblclick']) {
            const thisProxy = this;
            this[method] = function (...args) {
                const calledContext = this;
                fireEvent({'event': method})
                return thisProxy._target[method].call(calledContext, ...args);
            };
        }
        ['willDestroyContextMyself'].forEach(prop => {
            Object.defineProperty(this, prop, {
                configurable: false,
                enumerable: true,
                get: () => this._target[prop],
                set: value => this._target[prop] = value
            });
        });
    }

}

class DygraphReact extends React.Component {
    constructor(props) {
        super(props)
        this._interactionProxy = new InteractionModelProxy(props.fireEvent);
    }

    componentDidMount() {
        const initAttrs = R.omit(['data', 'style', 'fireEvent'], this.props);
        this._interactionProxy._target =
            initAttrs.interactionModel || DygraphBase.defaultInteractionModel;
        initAttrs.interactionModel = this._interactionProxy;
        this._dygraph = new DygraphBase(this.refs.root, this.props.data, initAttrs);
    }

    componentWillUpdate(nextProps/*, nextState*/) {
        if (this._dygraph) {
            const updateAttrs = R.omit(['data', 'style', 'fireEvent'], nextProps);
            this._interactionProxy._target =
                updateAttrs.interactionModel || DygraphBase.defaultInteractionModel;
            updateAttrs.interactionModel = this._interactionProxy;
            this._dygraph.updateOptions(updateAttrs);
        }
    }

    componentWillUnmount() {
        if (this._dygraph) {
            this._dygraph.destroy();
            this._dygraph = null;
        }
    }

    render() {
        return ( <div ref='root' style={this.props.style} /> )
    }
}

class DygraphDash extends React.Component {
    render() {
        const {data, options, layout} = this.props
        console.log(data, options, layout);

        if (layout.parseDates) {
            for (var i = 0; i < data.length; i++){
                data[i][0] = new Date(data[i][0])
            }
        }

        return (
            <DygraphReact data={data} { ...options} fireEvent={this.props.fireEvent} />
        )
    }
}

render(DygraphDash)
