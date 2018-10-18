
import React from "react";
import { StyleButton } from "./styleButton";

const BLOCK_TYPES = [
    { style: "left",    icon: "align-left" },
    { style: "center",  icon: "align-center" },
    { style: "right",   icon: "align-right" },
    { style: "justify", icon: "align-justify" },
];

export const BlockStyleControls = props => {
    const { editorState } = props;
    const selection = editorState.getSelection();
    const blockType = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getType();
    return (
        <>
            {BLOCK_TYPES.map(type => (
                <StyleButton
                    key={type.icon}
                    active={type.style === blockType}
                    icon={type.icon}
                    onToggle={props.onToggle}
                    textStyle={type.style}
                />
            ))}
        </>
    );
};
