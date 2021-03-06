
import React from "react";
import { StyleButton } from "./styleButton";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from '@material-ui/core/Tooltip';

var INLINE_STYLES = [
    { icon: "bold", style: "BOLD", hint: "Negrito" },
    { icon: "italic", style: "ITALIC", hint: "Itálico" },
    { icon: "underline", style: "UNDERLINE", hint: "Sublinhado" }
];

export const InlineStyleControls = props => {
    const currentStyle = props.editorState.getCurrentInlineStyle();

    return (
        <>
            <DinFieldButton {...props} />
            <FontSizeButton {...props} />
            {INLINE_STYLES.map(type => {
                return <Tooltip title={type.hint} key={type.icon}>
                    <StyleButton                        
                        active={currentStyle.has(type.style)}
                        icon={type.icon}
                        onToggle={props.onToggle}
                        textStyle={type.style}
                    />
                </Tooltip>
            })}
        </>
    );
};

class FontSizeButton extends React.Component {
    render() {
        const { editorState, onApplyStyles } = this.props
        return <StyleButton
            key="font"
            active={false}
            icon="font"
            onClick={() => {
                const currentStyle = editorState.getCurrentInlineStyle();
                const remove=["SIZE1", "SIZE2", "SIZE3", "SIZE4", "SIZE5", "SIZE6"];
                if (currentStyle.has("SIZE1")) onApplyStyles(remove, ["SIZE2"]);
                else if (currentStyle.has("SIZE2")) onApplyStyles(remove, []);
                else if (currentStyle.has("SIZE4")) onApplyStyles(remove, ["SIZE5"]);
                else if (currentStyle.has("SIZE5")) onApplyStyles(remove, ["SIZE6"]);
                else if (currentStyle.has("SIZE6")) onApplyStyles(remove, ["SIZE1"]);
                else onApplyStyles(remove, ["SIZE4"]);
            }}
            textStyle="FONT"
        />
    }
}

class DinFieldButton extends React.Component {
    render() {
        const { dados, onDinField } = this.props
        const anchorEl = this.state && this.state.anchorEl
        return <>
            <StyleButton
                key="tag"
                active={false}
                icon="tag"
                onClick={(event) => this.setState({ anchorEl: event.currentTarget })}
                textStyle="DINFIELD"
            />
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => { this.setState({ anchorEl: null }) }}
                PaperProps={{
                    style: {
                        maxHeight: "10em",
                        width: 200,
                    },
                }}
            >
                {items(this, "", dados)}
            </Menu>
        </>
        function items(self, r, obj) {
            let ret = [];
            Object.keys(obj).forEach((p) => {
                const s = [r, p].join("");
                const d = obj[p]
                if (typeof d === "object") {
                    ret = ret.concat(items(self, s + ".", d))
                } else {
                    ret.push(
                        <MenuItem key={s} onClick={() => {
                            self.setState({ anchorEl: null })
                            onDinField(s, dados)
                        }}>{s}</MenuItem>
                    )
                }
            })
            return ret;
        }
    }
}