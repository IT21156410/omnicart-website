import {
    Alignment,
    Autoformat,
    Base64UploadAdapter,
    BlockQuote,
    Bold,
    CloudServices,
    EditorConfig,
    Essentials,
    Heading,
    Image as CkImage,
    ImageCaption,
    ImageResize,
    ImageStyle,
    ImageToolbar,
    ImageUpload,
    Indent,
    IndentBlock,
    Italic,
    Link,
    List,
    MediaEmbed,
    Mention,
    Paragraph,
    PasteFromOffice,
    PictureEditing,
    Table as CkTable,
    TableColumnResize,
    TableToolbar,
    TextTransformation,
    Underline
} from "ckeditor5";

// https://github.com/ckeditor/ckeditor5-demos/tree/master/user-interface-classic

export const ckEditorConfig: EditorConfig = {
    toolbar: {
        items: ['undo', 'redo', '|', 'heading', '|', 'bold', 'italic', 'underline', 'alignment', '|', 'link', 'uploadImage', 'insertTable', 'blockQuote', 'mediaEmbed', '|', 'bulletedList', 'numberedList', '|', 'outdent', 'indent',],
    },
    plugins: [
        Alignment, Autoformat, BlockQuote, Bold, CloudServices, Essentials, Heading, CkImage, ImageCaption, ImageResize, ImageStyle, ImageToolbar, ImageUpload, Base64UploadAdapter, Indent, IndentBlock, Italic, Link, List, MediaEmbed, Mention, Paragraph, PasteFromOffice, PictureEditing, CkTable, TableColumnResize, TableToolbar, TextTransformation, Underline,
    ],
    heading: {
        options: [
            {
                model: 'paragraph',
                title: 'Paragraph',
                class: 'ck-heading_paragraph',
            },
            {
                model: 'heading1',
                view: 'h1',
                title: 'Heading 1',
                class: 'ck-heading_heading1',
            },
            {
                model: 'heading2',
                view: 'h2',
                title: 'Heading 2',
                class: 'ck-heading_heading2',
            },
            {
                model: 'heading3',
                view: 'h3',
                title: 'Heading 3',
                class: 'ck-heading_heading3',
            },
            {
                model: 'heading4',
                view: 'h4',
                title: 'Heading 4',
                class: 'ck-heading_heading4',
            },
        ],
    },
    image: {
        resizeOptions: [
            {
                name: 'resizeImage:original',
                label: 'Default image width',
                value: null,
            },
            {
                name: 'resizeImage:50',
                label: '50% page width',
                value: '50',
            },
            {
                name: 'resizeImage:75',
                label: '75% page width',
                value: '75',
            },
        ],
        toolbar: [
            'imageTextAlternative',
            'toggleImageCaption',
            '|',
            'imageStyle:inline',
            'imageStyle:wrapText',
            'imageStyle:breakText',
            '|',
            'resizeImage',
        ],
    },
    link: {
        addTargetToExternalLinks: true,
        defaultProtocol: 'https://',
    },
    table: {
        contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
    },
    initialData: '',
}