import './DragDropCodeViewer.scss';

import React, { Component } from 'react';
import { Button, Jumbotron } from 'reactstrap';
import Dropzone from 'react-dropzone';

import CodeViewer from '../../components/CodeViewer';

class DragDropCodeViewer extends Component {
  constructor() {
    super();
    this.state = { 
      value: ""
    }
  }

  componentDidMount(){
    this.setState({
      value: this.props.value
    });
  }
  
  editorDidMount(editor, monaco) {
    editor.focus();
    this.editor = editor;
    this.monaco = monaco;

    editor.layout({
      height: this.props.height || 500,
      width: this.props.width || 1190
    })

    setTimeout(
      function() {
        this.editor.trigger('any', 'editor.action.formatDocument');
      }
      .bind(this),
      250
    );
  }

  async onDrop(file) {
    if(file === undefined)
      return;

    let self = this;
    let reader = new FileReader();

    // Optional props so we can set the current file name of the parent component...
    if (this.props.setCurrentFile)
      this.props.setCurrentFile(file.name);

    reader.onload = function(e) {
      let contents = e.target.result;
      self.setState({
        value: contents
      });

      self.props.onDrop && self.props.onDrop(contents);
    };

    reader.readAsText(file);
  }

  onChange(newValue) {
    this.setState({
      value: newValue
    });
    this.props.onChange && this.props.onChange(newValue);
  }
  
  render() {
    return (
      <>
        <div className={"dragDropCodeViewerContainer " + (this.state.value && this.state.value !== "" ? "hasFileData" : "")} >
          <Dropzone onDrop={([file]) => this.onDrop(file)} 
            accept={'application/json, .cpp'} 
            >
            {({getRootProps, getInputProps}) => (
              <section className="dropzone">
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                    <Jumbotron>
                      <p className="lead text-center">Drag and Drop files <strong>here</strong> or click <strong>browse</strong> to choose a file.</p>
                      <hr className="my-4" />
                      <p className="lead text-center browseButton">
                        <Button onClick={(e) => e.preventDefault()} color="primary">Browse</Button>
                      </p>
                    </Jumbotron>
                </div>
              </section>
            )}
          </Dropzone>
            <CodeViewer 
              height={this.props.height}
              width={this.props.width}
              readOnly={this.props.readOnly}
              value={this.state.value}
              language="cpp"
              onChange={(newVal) => this.onChange(newVal)} 
              editorDidMount={(editor, monaco) => this.editorDidMount(editor, monaco)} />
          </div>
      </>
    );
  }
}

export default DragDropCodeViewer;
