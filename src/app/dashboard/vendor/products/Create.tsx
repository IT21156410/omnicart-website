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
                        <Card title="Product Management" type="inner" className="mb-3">
                            <Alert
                                className="mb-4"
                                type="info"
                                showIcon
                                message="Tips"
                                description="Choose the status that best reflects the availability of this product for customers."
                            />

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

                            <FloatingLabel controlId="price" label="Price (LKR)" className="mb-3">
                                <Form.Control type="number" placeholder="Enter Price (LKR)"/>
                            </FloatingLabel>

                            <FloatingLabel controlId="discount" label="Discount (LKR)" className="mb-3">
                                <Form.Control type="number" placeholder="Enter Discount (LKR)"/>
                            </FloatingLabel>
                        </Card>
                        <Card type="inner" title="Shipping">
                            <Alert
                                className="mb-4"
                                type="info"
                                showIcon
                                message="Tips"
                                description="Pay close attention to the weight of the product so that there is no difference in data with the shipping courier. "
                            />

                            <FloatingLabel controlId="productWeight" label="Product Weight (g)" className="mb-3">
                                <Form.Control type="number" placeholder="Enter Product Weight (In Grams(g))"/>
                            </FloatingLabel>

                            <Form.Group>
                                <Form.Label className="me-4">Product Size</Form.Label>
                            </Form.Group>

                            <Row className="mb-3">
                                <Col md>
                                    <FloatingLabel controlId="width" label="Product width (cm)" className="mb-3">
                                        <Form.Control type="number" placeholder="Enter Product width (in cm)"/>
                                    </FloatingLabel>
                                </Col>
                                <Col md>
                                    <FloatingLabel controlId="height" label="Product Height (cm)" className="mb-3">
                                        <Form.Control type="number" placeholder="Enter Product Height (in cm)"/>
                                    </FloatingLabel>
                                </Col>
                                <Col md>
                                    <FloatingLabel controlId="length" label="Product Length (cm)" className="mb-3">
                                        <Form.Control type="number" placeholder="Enter Product Length (in cm)"/>
                                    </FloatingLabel>
                                </Col>
                            </Row>

                            <FloatingLabel controlId="shippingFee" label="Shipping Fee (LKR)" className="mb-3">
                                <Form.Control type="number" placeholder="Enter Shipping Fee (LKR)"/>
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