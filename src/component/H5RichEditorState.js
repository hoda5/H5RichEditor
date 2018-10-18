import {
    EditorState,
    CompositeDecorator
} from "draft-js";

import { htmlToState } from "./convert/htmlToState";
import { dinFieldDecorator } from "./decorators/dinfieldDecorator";
import { entitySelecionDecorator } from "./decorators/entitySelecionDecorator";

export function createH5RichEditorState(html, dados) {
    const a = EditorState.createWithContent(htmlToState(html, dados));
    const b = EditorState.set(a, {
        decorator: new CompositeDecorator([
            dinFieldDecorator,
            entitySelecionDecorator,
        ])
    });
    return b;
}
