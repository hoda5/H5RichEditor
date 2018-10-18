import React from "react";

//TODO nao consegui detectar mudança de selecao

export const entitySelecionDecorator = {
    strategy(contentBlock, callback, contentState) {
        contentBlock.findEntityRanges(character => {
            const entityKey = character.getEntity();
            const entity = entityKey !== null && contentState.getEntity(entityKey)
            return entity;
        }, (start, end) => {
            const sel = contentState.getSelectionBefore();
            console.log({start, startOffset: sel.getStartOffset(), end, endOfs: sel.getEndOffset() });
            if (sel.hasEdgeWithin(contentBlock.key, start, end)) callback(start, end);
        });
    },
    component(props) {
        // const { path } = props.contentState.getEntity(props.entityKey).getData();
        const st = {
            backgroundColor: "silver"
        };
        return <span style={st}>XXXX{props.children}</span>;
    }
}