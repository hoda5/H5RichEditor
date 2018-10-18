
import React from "react";

export class StyleButton extends React.Component {
    constructor() {
        super();
        this.onMouseDown = e => {
            e.preventDefault();
            if (this.props.onToggle) this.props.onToggle(this.props.textStyle);
            if (this.props.onClick) this.props.onClick(e, this.props);
        };
    }
    render() {
        let className = "fas fa-" + this.props.icon + " RichEditor-styleButton";
        if (typeof this.props.active==="string") {
            className += " RichEditor-activeButton";
        }
        if (this.props.active) {
            className += " RichEditor-activeButton";
        }
        return (
            <i className={className} onMouseDown={this.onMouseDown}>
            </i>
        );
    }
}
