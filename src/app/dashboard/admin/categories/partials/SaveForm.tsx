import React, {ChangeEventHandler, useState} from 'react';
import {Category, CreateCategoryData, UpdateCategoryData} from "../../../../../types/models/category.ts";
import {Button, FloatingLabel, Form} from "react-bootstrap";
import {EditOutlined, UploadOutlined} from "@ant-design/icons";
import {Button as AntdButton, GetProp, Switch, Upload, UploadFile, UploadProps} from "antd";
import {getBase64} from "../../../../../utils/util.ts";
import {useNavigate} from "react-router-dom";

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

interface SaveFormPropsBase {
    isEditForm?: boolean;
    onSubmit: (data: CreateCategoryData | UpdateCategoryData) => Promise<boolean | undefined>;
}

type SaveFormProps = SaveFormPropsBase & (
    | { isEditForm: true; category: Category }  // Role is required when isEditForm is true
    | { isEditForm?: false; category?: never } // Role is optional or disallowed when isEditForm is false or undefined
    );

const CategorySaveForm = ({isEditForm, category, onSubmit}: SaveFormProps) => {
    const initialData: CreateCategoryData | UpdateCategoryData = {
        ...(category ? category : {}),
        name: category?.name || "",
        image: category?.image,
        isActive: category?.isActive || false,
    }

    const [formData, setFormData] = useState<CreateCategoryData | UpdateCategoryData>(initialData)
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [validationErrors, setValidationErrors] = useState<Partial<Record<"name" | "image", string>>>({})

    const navigate = useNavigate();

    const onChangeProductStatus = (checked: boolean) => {
        setFormData({
            ...formData,
            isActive: checked,
        });
    };

    const onRemove: UploadProps['onRemove'] = (file) => {
        if (isEditForm && file.uid === formData.id)
            setFormData({
                ...formData,
                image: undefined,
            });
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

        if (!formData.name || formData.name.trim() === "") {
            setValidationErrors((prevErrors) => ({
                ...prevErrors,
                name: "Category name is required"
            }))
            valid = false;
        }
        if (fileList.length <= 0 && (!isEditForm || (!formData.image || formData.image.trim() === ""))) {
            setValidationErrors((prevErrors) => ({
                ...prevErrors,
                image: "Category image is required"
            }))
            valid = false;
        }
        return valid;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateFormData()) {
            console.log(validationErrors)
            return;
        }

        const oldImage = formData.image;
        // Convert all files to base64
        Promise.all(
            fileList.map(file => getBase64(file.originFileObj as FileType))
        ).then(async (newPhotosBase64) => {
            const fileListBackup = fileList;
            setFileList([])

            const updatedFormData: Partial<Category> = {
                ...formData,
                image: fileList.length > 0 ? newPhotosBase64[0] : oldImage,
            };

            setFormData(updatedFormData);

            const result = await onSubmit(updatedFormData);
            if (result) {
                if (!isEditForm) {
                    setFormData(initialData);
                    navigate("/admin/categories/")
                }
                // if (isEditForm) location.reload();
                if (isEditForm) window.scrollTo({top: 0, behavior: 'smooth'});
                setFileList([])
            } else {
                // handle unsuccessfully save
                setFormData({
                    ...formData,
                    image: oldImage,
                });
                setFileList(fileListBackup)
            }
        });
    };

    return (
        <Form onSubmit={handleSubmit}>
            {/* Product Name */}
            <FloatingLabel controlId="name" label="Name" className="mb-3">
                <Form.Control
                    value={formData.name}
                    onChange={handleInputChange}
                    type="text"
                    isInvalid={!!validationErrors.name}
                    placeholder="Enter Name"
                />
                {validationErrors.name &&
                    <Form.Text className="text-danger">
                        <small>{validationErrors.name}</small>
                    </Form.Text>
                }
            </FloatingLabel>
            <Form.Group className="mb-3" controlId="image">
                <Upload
                    beforeUpload={() => false}
                    listType="picture"
                    onChange={({fileList}) => setFileList(fileList)}
                    defaultFileList={formData.image ? [
                        {
                            uid: formData.id!,
                            name: "Current image",
                            status: "done",
                            url: formData.image as string,
                        }
                    ] : []}
                    maxCount={1}
                    onRemove={onRemove}
                >
                    <AntdButton icon={<UploadOutlined/>}>Upload Image</AntdButton>
                </Upload>
                {validationErrors.image &&
                    <Form.Text className="text-danger">
                        <small>{validationErrors.image}</small>
                    </Form.Text>
                }
            </Form.Group>
            <Form.Group className="mb-3" controlId="isActive">
                <Form.Label className="me-4">Status</Form.Label>
                <Switch defaultChecked={formData.isActive} onChange={onChangeProductStatus}/>
            </Form.Group>

            <Button variant="primary" type="submit" className="px-5 py-2">
                <EditOutlined/> {isEditForm ? 'Update Category' : 'Create Category'}
            </Button>
        </Form>
    );
};

export default CategorySaveForm;