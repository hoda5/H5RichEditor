import React from "react";

export const dinFieldDecorator = {
    strategy(contentBlock, callback, contentState) {
        contentBlock.findEntityRanges(character => {
            const entityKey = character.getEntity();
            const entity = entityKey !== null && contentState.getEntity(entityKey)
            const entityType = entity && entity.getType()
            return entityType === "dinfield";
        }, callback);
    },
    component(props) {
        const st = {
            backgroundColor: "silver",
        };
        return <span style={st}>{props.children}</span>;
    }
}

