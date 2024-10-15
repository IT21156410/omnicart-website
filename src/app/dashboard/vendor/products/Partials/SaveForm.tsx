// https://www.freecodecamp.org/news/typescript-generics-with-functional-react-components/

import React, {ChangeEventHandler, useEffect, useRef, useState} from 'react';
import {Alert, Button as AntdButton, Card, Divider, GetProp, Image, Upload, UploadFile, UploadProps} from 'antd';
import {Alert as AlertBootstrap, Button, Col, FloatingLabel, Form, Row,} from 'react-bootstrap';
import {DeleteOutlined, EditOutlined, PlusOutlined} from '@ant-design/icons';
import {CreateProductData, Product, UpdateProductData} from "../../../../../types/models/product.ts";

import '../../../../../components/rich-text-editor/ckeditor.css'
import 'ckeditor5/ckeditor5.css';
import {ckEditorConfig} from "../../../../../components/rich-text-editor/CkEditor.ts";
import {ClassicEditor} from "ckeditor5";
import {CKEditor} from "@ckeditor/ckeditor5-react";

import fallback from "../../../../../assets/falback.png"
import {useNavigate} from "react-router-dom";
import {Category} from "../../../../../types/models/category.ts";
import {CategoryService} from "../../../../../services/CategoryService.ts";
import {getBase64} from "../../../../../utils/util.ts";

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];


type SaveFormPropsBase<T> = {
    onSubmit: (data: T) => Promise<boolean | undefined>;
};

type SaveFormProps<T> = SaveFormPropsBase<T> & (
    | { isEditForm: true; product: Product } // Editing form with a preloaded product
    | { isEditForm?: false; product?: never } // Creation form without product
    );

const ProductSaveForm = <T extends CreateProductData | UpdateProductData>({
                                                                              isEditForm,
                                                                              product,
                                                                              onSubmit
                                                                          }: SaveFormProps<T>) => {

    const initialData = {
        ...(product ? product : {}),
        name: product?.name || "",
        categoryId: product?.categoryId || "",
        condition: product?.condition || "",
        description: product?.description || "",
        photos: product?.photos || [],
        stock: product?.stock || "",
        sku: product?.sku || "",
        price: product?.price || "",
        discount: product?.discount || 0,
        productWeight: product?.productWeight || "",
        width: product?.width || "",
        height: product?.height || "",
        length: product?.length || "",
        shippingFee: product?.shippingFee || ""
    } as T

    const navigate = useNavigate();

    const [formData, setFormData] = useState<T>(initialData);

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [categoriesLoading, setCategoriesLoading] = useState<boolean>(true)
    const [validationErrors, setValidationErrors] = useState<Partial<Record<keyof T, string>>>({})

    const editorRef = useRef(null);

    useEffect(() => {
        let isMounted = true;
        const getCategories = async () => {
            try {
                setCategoriesLoading(true);
                // setCategories([]);
                const result = await CategoryService.allActive();
                if (result.success) {
                    setCategories(result.data);
                }
            } catch (error) {
                setCategories([]);
            } finally {
                setCategoriesLoading(false);
            }
        }

        if (isMounted) {
            getCategories();
        }

        return () => {
            isMounted = false;
        }
    }, []);

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleChange: UploadProps['onChange'] = ({fileList: newFileList}) => {
        setFileList(newFileList);
    };

    const beforeUpload: UploadProps['beforeUpload'] = (file) => {
        // setFileList([...fileList, file]);
        return false;
    }

    const onChangeProductStatus = (checked: boolean) => {
        console.log(`switch to ${checked}`);
    };
    const handleInputChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    function validateFormData() {
        setValidationErrors({})
        let valid = true;
        const errors: Partial<Record<keyof T, string>> = {};

        if (!formData.name || formData.name.trim() === "") {
            setValidationErrors((prevErrors) => ({
                ...prevErrors,
                name: "Product name is required"
            }))
            valid = false;
        }

        if (!formData.categoryId || formData.categoryId.trim() === "") {
            setValidationErrors((prevErrors) => ({
                ...prevErrors,
                categoryId: "Category is required"
            }))
            valid = false;
        }

        if (fileList.length <= 0 && (!isEditForm || (!formData.photos || formData.photos.length <= 0))) {
            setValidationErrors((prevErrors) => ({
                ...prevErrors,
                photos: "At least one photo is required"
            }))
            valid = false;
        }

        if (!formData.condition || formData.condition.trim() === "") {
            setValidationErrors((prevErrors) => ({
                ...prevErrors,
                condition: "Condition is required"
            }))
            valid = false;
        }

        if (!formData.description || formData.description.trim() === "") {
            setValidationErrors((prevErrors) => ({
                ...prevErrors,
                description: "Description is required"
            }))
            valid = false;
        }

        if (!formData.stock || formData.stock <= 0) {
            setValidationErrors((prevErrors) => ({
                ...prevErrors,
                stock: "Stock must be greater than zero"
            }))
            valid = false;
        }

        if (!formData.price || formData.price <= 0) {
            setValidationErrors((prevErrors) => ({
                ...prevErrors,
                price: "Price must be a positive number"
            }))
            valid = false;
        }

        // Validate SKU (must not be empty)
        if (!formData.sku || formData.sku.trim() === "") {
            setValidationErrors((prevErrors) => ({
                ...prevErrors,
                sku: "SKU is required"
            }));
            valid = false;
        }

        // Validate discount (must be between 0 and formData.price)
        if (formData.discount !== undefined && (formData.discount < 0 || formData.discount > formData.price!)) {
            setValidationErrors((prevErrors) => ({
                ...prevErrors,
                discount: `Discount must be between 0 and Product price (${formData.price})`
            }));
            valid = false;
        }

        // Validate product weight (must be greater than 0)
        if (!formData.productWeight || formData.productWeight <= 0) {
            setValidationErrors((prevErrors) => ({
                ...prevErrors,
                productWeight: "Product weight must be greater than zero"
            }));
            valid = false;
        }

        // Validate width (must be greater than 0)
        if (!formData.width || formData.width <= 0) {
            setValidationErrors((prevErrors) => ({
                ...prevErrors,
                width: "Width must be greater than zero"
            }));
            valid = false;
        }

        // Validate height (must be greater than 0)
        if (!formData.height || formData.height <= 0) {
            setValidationErrors((prevErrors) => ({
                ...prevErrors,
                height: "Height must be greater than zero"
            }));
            valid = false;
        }

        // Validate length (must be greater than 0)
        if (!formData.length || formData.length <= 0) {
            setValidationErrors((prevErrors) => ({
                ...prevErrors,
                length: "Length must be greater than zero"
            }));
            valid = false;
        }

        // Validate shipping fee (must be greater than or equal to 0)
        if (formData.shippingFee === undefined || formData.shippingFee < 0) {
            setValidationErrors((prevErrors) => ({
                ...prevErrors,
                shippingFee: "Shipping fee must be a non-negative number"
            }));
            valid = false;
        }
        return valid;
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("clicked");
        if (!validateFormData()) {
            console.log(validationErrors)
            return;
        }

        const photosList: string[] = formData.photos || [];
        // Convert all files to base64
        Promise.all(
            fileList.map(file => getBase64(file.originFileObj as FileType))
        ).then(async (newPhotosBase64) => {
            const fileListBackup = fileList;
            setFileList([])

            const updatedPhotosList = [...photosList, ...newPhotosBase64];

            const updatedFormData = {
                ...formData,
                photos: updatedPhotosList,
            };

            setFormData(updatedFormData);

            const result = await onSubmit(updatedFormData);
            if (result) {
                if (!isEditForm) {
                    setFormData(initialData);
                    navigate("/vendor/products/")
                }
                // if (isEditForm) location.reload();
                if (isEditForm) window.scrollTo({top: 0, behavior: 'smooth'});
                setPreviewOpen(false)
                setPreviewImage('')
                setFileList([])
            } else {
                // handle unsuccessfully save
                setFormData({
                    ...formData,
                    photos: photosList,
                });
                setFileList(fileListBackup)
            }
        });
    };

    const handleDeletePhoto = (index: number) => {
        if (!isEditForm) return;

        setFormData({
            ...formData,
            photos: formData.photos?.filter((_, i) => i !== index) // Remove the photo by index
        });
    };
    return (
        <Form onSubmit={handleSubmit}>
            {/* Product Name */}
            <FloatingLabel controlId="name" label="Product Name" className="mb-3">
                <Form.Control
                    value={formData.name}
                    onChange={handleInputChange}
                    isInvalid={!!validationErrors.name}
                    type="text"
                    placeholder="Enter Product Name"
                />
                {validationErrors.name &&
                    <Form.Text className="text-danger">
                        <small>{validationErrors.name}</small>
                    </Form.Text>
                }
            </FloatingLabel>

            {/* Product Category */}
            <FloatingLabel controlId="categoryId" label="Product Category" className="mb-3">
                <Form.Select
                    aria-label="Category"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    isInvalid={!!validationErrors.categoryId}
                >
                    <option>Category</option>
                    {categoriesLoading && <option>Loading...</option>}
                    {
                        !categoriesLoading && categories.map((category) => (
                            <option key={category.id} value={category.id}>{category.name}</option>))
                    }
                </Form.Select>
                {validationErrors.categoryId &&
                    <Form.Text className="text-danger">
                        <small>{validationErrors.categoryId}</small>
                    </Form.Text>
                }
            </FloatingLabel>

            <Card title="Product Photos" type="inner" className="mb-3">
                <Alert
                    className="mb-4"
                    type="info"
                    showIcon
                    message="Tips"
                    description="High-quality images can significantly impact your product's appeal. Upload clear, well-lit photos that showcase your item from different angles and perspectives."/>

                <Upload
                    beforeUpload={beforeUpload}
                    //action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={handleChange}
                >
                    {fileList.length >= 8 ? null : <button style={{border: 0, background: 'none'}} type="button">
                        <PlusOutlined/>
                        <div style={{marginTop: 8}}>Upload</div>
                    </button>}
                </Upload>

                {validationErrors.photos &&
                    <Form.Text className="text-danger">
                        <small>{validationErrors.photos}</small>
                    </Form.Text>
                }

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
                {isEditForm &&
                    <div className="mt-1">
                        <Divider className="mt-4 mb-2"/>
                        <Form.Group>
                            <Form.Label className="me-4">Uploaded Images</Form.Label>
                        </Form.Group>
                        <div className="d-flex align-items-center">
                            {(formData.photos) && formData.photos.map((photo, index) => (
                                <div key={index} className="me-2 position-relative">
                                    <Image
                                        wrapperClassName="me-1"
                                        className="object-fit-cover"
                                        width={80}
                                        height={80}
                                        key={index}
                                        src={photo}
                                        fallback={fallback}
                                    />
                                    <AntdButton
                                        className="position-absolute"
                                        style={{top: 0, right: 0}}
                                        danger
                                        type="primary"
                                        shape="circle"
                                        icon={<DeleteOutlined/>}
                                        size="small"
                                        onClick={() => handleDeletePhoto(index)} // Handle delete click
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                }
            </Card>
            <Card title="Product Details" type="inner" className="mb-3">

                {/* Product Condition */}
                <FloatingLabel controlId="condition" label="Condition" className="mb-3">
                    <Form.Select
                        aria-label="Condition"
                        value={formData.condition}
                        isInvalid={!!validationErrors.condition}
                        onChange={handleInputChange}
                    >
                        <option value="">Choose condition</option>
                        <option value="New">Brand New</option>
                        <option value="Used">Second Hand</option>
                    </Form.Select>
                    {validationErrors.condition &&
                        <Form.Text className="text-danger">
                            <small>{validationErrors.condition}</small>
                        </Form.Text>
                    }
                </FloatingLabel>
                <Form.Group className="mb-3">
                    <Form.Label>Product Description</Form.Label>
                    <CKEditor
                        id="formGroupDescription"
                        editor={ClassicEditor}
                        data={formData.description}
                        onChange={(event, editor) => setFormData({...formData, description: editor.getData()})}
                        config={{
                            ...ckEditorConfig,
                        }}
                    />
                    {validationErrors.description &&
                        <Form.Text className="text-danger">
                            <small>{validationErrors.description}</small>
                        </Form.Text>
                    }
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

                {/* Product Stock */}
                <FloatingLabel controlId="stock" label="Product Stock" className="mb-3">
                    <Form.Control
                        type="number"
                        placeholder="Enter Product Stock"
                        value={formData.stock}
                        onChange={handleInputChange}
                        isInvalid={!!validationErrors.stock}
                    />
                    {validationErrors.stock &&
                        <Form.Text className="text-danger">
                            <small>{validationErrors.stock}</small>
                        </Form.Text>
                    }
                </FloatingLabel>

                {/* SKU */}
                <FloatingLabel controlId="sku" label="Stock Keeping Unit" className="mb-3">
                    <Form.Control
                        type="text"
                        placeholder="Enter Stock Keeping Unit"
                        value={formData.sku}
                        isInvalid={!!validationErrors.sku}
                        onChange={handleInputChange}
                    />
                    {validationErrors.sku &&
                        <Form.Text className="text-danger">
                            <small>{validationErrors.sku}</small>
                        </Form.Text>
                    }
                </FloatingLabel>

                {/* Price */}
                <FloatingLabel controlId="price" label="Price (LKR)" className="mb-3">
                    <Form.Control
                        type="number"
                        placeholder="Enter Price (LKR)"
                        value={formData.price}
                        isInvalid={!!validationErrors.price}
                        onChange={handleInputChange}
                    />
                    {validationErrors.price &&
                        <Form.Text className="text-danger">
                            <small>{validationErrors.price}</small>
                        </Form.Text>
                    }
                </FloatingLabel>

                {/* Discount */}
                <FloatingLabel controlId="discount" label="Discount (LKR)" className="mb-3">
                    <Form.Control
                        type="number"
                        placeholder="Enter Discount (LKR)"
                        value={formData.discount}
                        isInvalid={!!validationErrors.discount}
                        onChange={handleInputChange}
                    />
                    {validationErrors.discount &&
                        <Form.Text className="text-danger">
                            <small>{validationErrors.discount}</small>
                        </Form.Text>
                    }
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
                {/* Product Weight */}
                <FloatingLabel controlId="productWeight" label="Product Weight (g)" className="mb-3">
                    <Form.Control
                        type="number"
                        placeholder="Enter Product Weight (In Grams)"
                        value={formData.productWeight}
                        onChange={handleInputChange}
                        isInvalid={!!validationErrors.productWeight}
                    />
                    {validationErrors.productWeight &&
                        <Form.Text className="text-danger">
                            <small>{validationErrors.productWeight}</small>
                        </Form.Text>
                    }
                </FloatingLabel>

                <Form.Group>
                    <Form.Label className="me-4">Product Size</Form.Label>
                </Form.Group>
                {/* Product Dimensions */}
                <Row className="mb-3">
                    <Col md>
                        <FloatingLabel controlId="width" label="Width (cm)" className="mb-3">
                            <Form.Control
                                type="number"
                                placeholder="Enter Width"
                                value={formData.width}
                                isInvalid={!!validationErrors.width}
                                onChange={handleInputChange}
                            />
                            {validationErrors.width &&
                                <Form.Text className="text-danger">
                                    <small>{validationErrors.width}</small>
                                </Form.Text>
                            }
                        </FloatingLabel>
                    </Col>
                    <Col md>
                        <FloatingLabel controlId="height" label="Height (cm)" className="mb-3">
                            <Form.Control
                                type="number"
                                placeholder="Enter Height"
                                value={formData.height}
                                isInvalid={!!validationErrors.height}
                                onChange={handleInputChange}
                            />
                            {validationErrors.height &&
                                <Form.Text className="text-danger">
                                    <small>{validationErrors.height}</small>
                                </Form.Text>
                            }
                        </FloatingLabel>
                    </Col>
                    <Col md>
                        <FloatingLabel controlId="length" label="Length (cm)" className="mb-3">
                            <Form.Control
                                type="number"
                                placeholder="Enter Length"
                                value={formData.length}
                                isInvalid={!!validationErrors.length}
                                onChange={handleInputChange}
                            />
                            {validationErrors.length &&
                                <Form.Text className="text-danger">
                                    <small>{validationErrors.length}</small>
                                </Form.Text>
                            }
                        </FloatingLabel>
                    </Col>
                </Row>

                {/* Shipping Fee */}
                <FloatingLabel controlId="shippingFee" label="Shipping Fee (LKR)" className="mb-3">
                    <Form.Control
                        type="number"
                        placeholder="Enter Shipping Fee"
                        value={formData.shippingFee}
                        isInvalid={!!validationErrors.shippingFee}
                        onChange={handleInputChange}
                    />
                    {validationErrors.shippingFee &&
                        <Form.Text className="text-danger">
                            <small>{validationErrors.shippingFee}</small>
                        </Form.Text>
                    }
                </FloatingLabel>
            </Card>
            <Divider dashed/>
            {/* Submit Button */
            }
            <Button variant="primary" type="submit" className="px-5 py-2">
                <EditOutlined/> {isEditForm ? 'Update Product' : 'Create Product'}
            </Button>

            {validationErrors && Object.entries(validationErrors).length > 0 && (
                <AlertBootstrap variant="danger" className="mt-2">
                    <ul className="mb-0">
                        {Object.entries(validationErrors).map(([field, error]) => (
                            <li key={field}>{error}</li>
                        ))}
                    </ul>
                </AlertBootstrap>
            )}

        </Form>
    )
        ;
};

export default ProductSaveForm;
