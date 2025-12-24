import { Create, useForm } from "@refinedev/antd";
import { Form, Input, InputNumber, Select, Card, Row, Col, Typography } from "antd";
import { useState, useEffect } from "react";

const { Title } = Typography;
const { TextArea } = Input;

export const LoaiPhongCreate: React.FC = () => {
    const [propertyId, setPropertyId] = useState<string | null>(null);

    const { formProps, saveButtonProps } = useForm({
        resource: "room-types",
        action: "create",
        redirect: "list",
    });

    // Get propertyId from localStorage
    useEffect(() => {
        const storedPropertyId = localStorage.getItem("propertyId");
        if (storedPropertyId) {
            setPropertyId(storedPropertyId);
        }
    }, []);

    const bedTypeOptions = [
        { value: "1 Giường Đôi", label: "1 Giường Đôi (King)" },
        { value: "2 Giường Đơn", label: "2 Giường Đơn (Twin)" },
        { value: "1 Giường Đôi + 1 Giường Đơn", label: "1 Giường Đôi + 1 Giường Đơn" },
        { value: "2 Giường Đôi", label: "2 Giường Đôi" },
    ];

    return (
        <Create saveButtonProps={saveButtonProps} title="Tạo loại phòng mới">
            <Form 
                {...formProps} 
                layout="vertical"
                initialValues={{
                    propertyId: propertyId,
                    maxAdults: 2,
                    maxChildren: 1,
                }}
            >
                <Row gutter={24}>
                    <Col span={12}>
                        <Card title={<Title level={5}>Thông tin cơ bản</Title>}>
                            <Form.Item
                                label="Tên loại phòng"
                                name="name"
                                rules={[{ required: true, message: "Vui lòng nhập tên" }]}
                            >
                                <Input placeholder="VD: Superior, Deluxe, Suite..." />
                            </Form.Item>

                            <Form.Item
                                label="Giá phòng (VNĐ/đêm)"
                                name="basePrice"
                                rules={[{ required: true, message: "Vui lòng nhập giá" }]}
                            >
                                <InputNumber
                                    style={{ width: "100%" }}
                                    min={0}
                                    step={100000}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                    parser={(value) => value?.replace(/\$\s?|(,*)/g, "") as any}
                                    placeholder="VD: 1,500,000"
                                />
                            </Form.Item>

                            <Form.Item label="Mô tả" name="description">
                                <TextArea rows={4} placeholder="Mô tả về loại phòng..." />
                            </Form.Item>
                        </Card>
                    </Col>

                    <Col span={12}>
                        <Card title={<Title level={5}>Cấu hình phòng</Title>}>
                            <Form.Item
                                label="Số người lớn tối đa"
                                name="maxAdults"
                                rules={[{ required: true, message: "Vui lòng nhập số" }]}
                            >
                                <InputNumber min={1} max={10} style={{ width: "100%" }} />
                            </Form.Item>

                            <Form.Item
                                label="Số trẻ em tối đa"
                                name="maxChildren"
                                rules={[{ required: true, message: "Vui lòng nhập số" }]}
                            >
                                <InputNumber min={0} max={5} style={{ width: "100%" }} />
                            </Form.Item>

                            <Form.Item label="Loại giường" name="bedType">
                                <Select
                                    options={bedTypeOptions}
                                    placeholder="Chọn loại giường"
                                    allowClear
                                />
                            </Form.Item>
                        </Card>
                    </Col>
                </Row>

                {/* Hidden field */}
                <Form.Item name="propertyId" hidden initialValue={propertyId}>
                    <Input />
                </Form.Item>
            </Form>
        </Create>
    );
};
