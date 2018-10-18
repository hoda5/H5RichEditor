import {
  Editor,
  RichUtils,
  Entity,
  Modifier,
  EditorState,
  getDefaultKeyBinding,
} from "draft-js";
import React from "react";
import { stateToHTML } from "./convert/stateToHTML";
import { createH5RichEditorState } from "./H5RichEditorState";
import { BlockStyleControls } from './controls/blockStyleControls';
import { InlineStyleControls } from './controls/inlineStyleControls';
import { getPropByPath } from "./lib/propByPath";

export class H5RichEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { editorState: createH5RichEditorState(this.props.html, this.props.dados) };
    this.onChange = editorState => {
      this.setState({ editorState });
      if (this.props.onChange)
        this.props.onChange({
          html: stateToHTML(editorState.getCurrentContent())
        });
    };
    this.handleKeyCommand = this._handleKeyCommand.bind(this);
    this.mapKeyToEditorCommand = this._mapKeyToEditorCommand.bind(this);
    this.toggleBlockType = this._toggleBlockType.bind(this);
    this.toggleInlineStyle = this._toggleInlineStyle.bind(this);
    this.onDinField = this._onDinField.bind(this);
    this.onApplyStyles = this._onApplyStyles.bind(this);
    this.setDomEditorRef = ref => (this.domEditor = ref);
  }
  componentDidMount() {
    this.domEditor.focus();
  }
  _handleKeyCommand(command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  }
  _mapKeyToEditorCommand(e) {
    if (e.keyCode === 9 /* TAB */) {
      const newEditorState = RichUtils.onTab(
        e,
        this.state.editorState,
        4 /* maxDepth */
      );
      if (newEditorState !== this.state.editorState) {
        this.onChange(newEditorState);
      }
      return;
    }
    return getDefaultKeyBinding(e);
  }
  _toggleBlockType(blockType) {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType));
  }
  _toggleInlineStyle(inlineStyle) {
    this.onChange(
      RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle)
    );
  }
  _onDinField(path, dados) {

    const editorState = this.state.editorState;
    const currentContent = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const entityKey = Entity.create('dinfield', 'IMMUTABLE', { path, dados });
    const label = getPropByPath(dados, path);
    const textWithEntity = Modifier.insertText(currentContent, selection, label, null, entityKey);

    this.onChange(
      EditorState.push(editorState, textWithEntity, 'insert-characters')
    );
  }
  _onApplyStyles(remove, apply) {

    let editorState = this.state.editorState;
    let currentContent = editorState.getCurrentContent();
    const selection = editorState.getSelection();

    remove.forEach((r) => {
      currentContent = Modifier.removeInlineStyle(currentContent, selection, r)
    })
    apply.forEach((a) => {
      currentContent = Modifier.applyInlineStyle(currentContent, selection, a)
    })

    editorState = EditorState.push(editorState, currentContent, 'change-inline-style')

    // apply.forEach((a) => {
    //   editorState = RichUtils.toggleInlineStyle(this.state.editorState, a)
    // })

    this.onChange(editorState);
  }
  render() {
    const { editorState } = this.state;
    // If the user changes block type before entering any text, we can
    // either style the placeholder or hide it. Let's just hide it now.
    let className = "RichEditor-editor";
    var contentState = editorState.getCurrentContent();
    if (!contentState.hasText()) {
      if (
        contentState
          .getBlockMap()
          .first()
          .getType() !== "unstyled"
      ) {
        className += " RichEditor-hidePlaceholder";
      }
    }
    return (
      <div className="RichEditor-root">
        <span className="RichEditor-controls">
          <InlineStyleControls
            editorState={editorState}
            dados={this.props.dados}
            onToggle={this.toggleInlineStyle}
            onDinField={this.onDinField}
            onApplyStyles={this.onApplyStyles}
          />
          <BlockStyleControls
            editorState={editorState}
            onToggle={this.toggleBlockType}
          />
        </span>
        <div className={className} onClick={this.focus}>
          <Editor
            blockStyleFn={getBlockStyle}
            customStyleMap={styleMap}
            editorState={editorState}
            handleKeyCommand={this.handleKeyCommand}
            keyBindingFn={this.mapKeyToEditorCommand}
            onChange={this.onChange}
            ref={this.setDomEditorRef}
            spellCheck={this.props.corretor}
          />
        </div>
      </div>
    );
  }
}


function getBlockStyle(block) {
  debugger
  switch (block.getType()) {
    case 'center':
      return 'RichEditor-center';
    case 'right':
      return 'RichEditor-right';
    case 'justify':
      return 'RichEditor-justify';
    case 'left':
    default:
      return 'RichEditor-left';
  }
}

const styleMap = {
  BIG: {
    fontSize: "150%",
  },
  SMALL: {
    fontSize: "75%",
  },
};