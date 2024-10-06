import SaveForm from "./partials/SaveForm.tsx";
import {Col, Row} from "react-bootstrap";
import {Card, message, notification} from "antd";
import {CreateCategoryData} from "../../../../types/models/category.ts";
import {useState} from "react";
import {CategoryService} from "../../../../services/CategoryService.ts";

const CreateCategory = () => {
    const [api, contextHolder] = notification.useNotification();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const handleCreate = async (data: CreateCategoryData) => {

        try {
            setLoading(true)
            const result = await CategoryService.create(data);
            if (!result.success) {
                setError(result.message);
            } else {
                // TODO
                message.success(result.message)
                return true;
            }
        } catch (err: any) {
            console.log(err)

            api.open({
                message: err.response.data.message || err.response.data.title || err.message,
                //description: "Something went wrong!",
                showProgress: true,
                pauseOnHover: true,
                type: "error",
            });
            setError("Something went wrong!");
            return false;
        } finally {
            setLoading(false);
        }
    };
    return (
        <Row>
            {contextHolder}
            <Col md={8}>
                <Card title="Product Category Information">
                    <SaveForm onSubmit={handleCreate}/>
                </Card>
            </Col>
        </Row>
    );
};

export default CreateCategory;