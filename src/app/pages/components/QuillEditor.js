// components/TinyMCEEditor.js
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';

const TinyMCEEditor = forwardRef((props, ref) => {
    const [content, setContent] = useState(props.initialValue || '');

    useImperativeHandle(ref, () => ({
        getContent: () => content,
        setContent: (newContent) => setContent(newContent)
    }));

    return (
        <Editor
            apiKey="jplm1n3oycnnfjpvr0iahbkm9myv981yyukm1pra7j0lgr6d"
            value={content}
            init={{
                height: 400,
                menubar: true,
                plugins: [
                    'advlist autolink lists link image charmap preview anchor textcolor',
                    'searchreplace visualblocks code fullscreen',
                    'insertdatetime media table paste code help wordcount',
                    'imagetools'
                ],
                toolbar: [
                    'undo redo | formatselect | bold italic underline strikethrough | \
                     alignleft aligncenter alignright alignjustify | \
                     outdent indent | numlist bullist | forecolor backcolor | removeformat | \
                     image media table link anchor charmap emoticons | fullscreen code preview'
                ].join(' '),
                menubar: 'file edit view insert format tools table help',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                image_advtab: true,
                file_picker_callback: (callback, value, meta) => {
                    if (meta.filetype === 'image') {
                        const input = document.createElement('input');
                        input.setAttribute('type', 'file');
                        input.setAttribute('accept', 'image/*');
                        input.onchange = () => {
                            const file = input.files[0];
                            const reader = new FileReader();
                            reader.onload = () => {
                                callback(reader.result, { alt: file.name });
                            };
                            reader.readAsDataURL(file);
                        };
                        input.click();
                    }
                }
            }}
            onEditorChange={(newContent) => setContent(newContent)}
        />
    );
});

export default TinyMCEEditor;
