import React, { useImperativeHandle, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const QuillEditor = React.forwardRef((props, ref) => {
    const editorRef = useRef(null);

    useImperativeHandle(ref, () => ({
        getContent: () => {
            return editorRef.current?.getEditor().root.innerHTML;
        },
        setContent: (content) => {
            if (editorRef.current) {
                editorRef.current.getEditor().root.innerHTML = content;
            }
        },
    }));

    return <ReactQuill ref={editorRef} {...props} />;
});

export default QuillEditor;