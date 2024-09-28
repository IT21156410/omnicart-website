import React, {useRef, useState} from 'react';
import {Alert, Card, Divider, GetProp, Image, Switch, Upload, UploadFile, UploadProps} from 'antd';
import {Button, Col, FloatingLabel, Form, Row} from "react-bootstrap";
import Marquee from "react-fast-marquee";
import {EditOutlined, PlusOutlined} from "@ant-design/icons";
import {CKEditor} from "@ckeditor/ckeditor5-react";
import {ClassicEditor} from "ckeditor5";

import {ckEditorConfig} from "../../../../components/rich-text-editor/CkEditor.ts";

import '../../../../components/rich-text-editor/ckeditor.css'
import 'ckeditor5/ckeditor5.css';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

const CreateProduct = () => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([])
    const [description, setDescription] = useState('');
    const editorRef = useRef(null);

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleChange: UploadProps['onChange'] = ({fileList: newFileList}) =>
        setFileList(newFileList);

    const uploadButton = (
        <button style={{border: 0, background: 'none'}} type="button">
            <PlusOutlined/>
            <div style={{marginTop: 8}}>Upload</div>
        </button>
    );

    const onChangeProductStatus = (checked: boolean) => {
        console.log(`switch to ${checked}`);
    };
    return (
        <Row>
            <Col md={8}>
                <Card title="Product Information">
                    <Alert
                        banner
                        message="Warning"
                        className="mb-4"
                        description={
                            <Marquee play={false} pauseOnHover gradient={false}>
                                Avoid selling counterfeit products / violating Intellectual Property Rights, so that
                                your products are not deleted.
                            </Marquee>
                        }
                    />
                    <Form>
                        <FloatingLabel
                            controlId="name"
                            label="Product Name"
                            className="mb-3"
                        >
                            <Form.Control type="text" placeholder="Enter Product Name"/>
                        </FloatingLabel>

                        <FloatingLabel
                            controlId="category"
                            label="Product Category"
                            className="mb-3"
                        >
                            <Form.Select aria-label="Category">
                                <option>Category</option>
                                <option value="1">One</option>
                                <option value="2">Two</option>
                                <option value="3">Three</option>
                            </Form.Select>
                        </FloatingLabel>

                        <Card title="Product Photos" type="inner" className="mb-3">
                            <Alert
                                className="mb-4"
                                type="info"
                                showIcon
                                message="Tips"
                                description="High-quality images can significantly impact your product's appeal. Upload clear, well-lit photos that showcase your item from different angles and perspectives."/>
                            <Upload
                                //action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                                listType="picture-card"
                                fileList={fileList}
                                onPreview={handlePreview}
                                onChange={handleChange}
                            >
                                {fileList.length >= 8 ? null : uploadButton}
                            </Upload>

                            {previewImage && (
                                <Image
                                    wrapperStyle={{display: 'none'}}
                                    preview={{
                                        visible: previewOpen,
                                        onVisibleChange: (visible) => setPreviewOpen(visible),
                                        afterOpenChange: (visible) => !visible && setPreviewImage(''),
                                    }}
                                    src={previewImage}
                                />
                            )}
                        </Card>

                        <Card title="Product Details" type="inner" className="mb-3">
                            <FloatingLabel
                                controlId="condition"
                                label="Condition"
                                className="mb-3"
                            >
                                <Form.Select aria-label="Condition">
                                    <option>Condition</option>
                                    <option value="new">Brand New</option>
                                    <option value="second-hand">Second Hand</option>
                                </Form.Select>
                            </FloatingLabel>
                            <Form.Group className="mb-3">
                                <Form.Label>Product Description</Form.Label>
                                <CKEditor
                                    id="formGroupDescription"
                                    editor={ClassicEditor}
                                    config={{
                                        ...ckEditorConfig,
                                        initialData: undefined
                                    }}
                                />
                            </Form.Group>
                        </Card>
                        <Card title="Product Management" type="inner">
                            <Form.Group className="mb-3">
                                <Form.Label className="me-4">Product Status</Form.Label>
                                <Switch defaultChecked onChange={onChangeProductStatus}/>
                            </Form.Group>

                            <FloatingLabel
                                controlId="stock"
                                label="Product Stock"
                                className="mb-3"
                            >
                                <Form.Control type="text" placeholder="Enter Product Stock"/>
                            </FloatingLabel>

                            <FloatingLabel
                                controlId="sku"
                                label="Stock Keeping Unit"
                                className="mb-3"
                            >
                                <Form.Control type="text" placeholder="Enter Stock Keeping Unit"/>
                            </FloatingLabel>
                        </Card>
                        <Divider dashed/>
                        <Button variant="primary" className="px-5 py-2"><EditOutlined/> Save</Button>
                    </Form>
                </Card>
            </Col>
        </Row>


    );
};

export default CreateProduct;