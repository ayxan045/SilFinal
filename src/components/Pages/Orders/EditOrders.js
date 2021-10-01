import React, { useEffect, useState } from "react";
import {
    Spin,
    Col,
    Input,
    Modal,
    InputNumber,
    Form,
    Row,
    Select,
    Button,
    Switch,
} from "antd";
import { connect } from "react-redux";
import { notify } from "../../../redux/actions";
import { useTranslation } from "react-i18next";
import { whiteSpace, noWhitespace } from "../../../utils/rules";
import { PicCenterOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import ImgCrop from "antd-img-crop";
import { Upload } from "antd";
import admin from "../../../const/api"
const { Option } = Select;

function EditOrders(props) {
    const [spin, setSpin] = useState(false);
    const [categories, setCategories] = useState([]);
    const [persons, setPersons] = useState([]);
    const [tables, setTables] = useState([]);
    let editing = props.match.params.id;
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const { notify } = props;
    const getPost = async () => {
        await admin.get(`orders/${editing}`).then((res) => {
            let data = res.data
            setSpin(false);
            form.setFieldsValue(data);
        });
    };

    const getPersons = async () => {
        await admin.get(`persons`).then((res) => {
            setPersons(res.data)
        });
    };

    const getTables = async () => {
        await admin.get(`tables`).then((res) => {
            setTables(res.data)
        });
    };


    useEffect(() => {
        form.resetFields();
        if (props.match.params.id) {
            setSpin(true);
            getPost();
        }
    }, [editing]);

    useEffect(() => {
        getTables()
        getPersons()
    } , [])

    const saveItem = async (values) => {
        let obj = {
            ...values,
            category: categories.find(c => c.id === parseInt(values.category_id)).name
        }
        if (!editing) {
            await admin
                .post(`/menu`, obj)
                .then((res) => {
                    notify("", true);
                    form.resetFields();
                    window.history.back();
                })
                .catch((err) => {
                    notify(err.response, false);
                });
        } else {
            await admin
                .put(`/menu/${editing}`, obj)
                .then((res) => {
                    notify("", true);
                    form.resetFields();
                    window.history.back();
                })
                .catch((err) => {
                    notify(err.response, false);
                });
        }
    };

    return (
        <div>
            <Row gutter={[16, 16]}>
                <Col xs={24}>
                    <div className="border flex-between page-heading flex p-2 mt-0 bg-white">
                        <div className="page-name">
                            <PicCenterOutlined className="f-20 mr5-15" />
                            <span className="f-20 bold">Sifariş</span>
                        </div>
                        <Link
                            to={{
                                pathname: `/orders`,
                            }}
                        >
                            <Button type={"primary"}>{t("cancel")}</Button>
                        </Link>
                    </div>
                </Col>
                <Col xs={24}>
                    {spin ? (
                        <div className="flex animated fadeIn p-2 bg-white all-center">
                            <Spin size={"large"} />
                        </div>
                    ) : (
                        <div className="p-2 animated edit fadeInUp bg-white">
                            <Form form={form} onFinish={saveItem} layout="vertical">
                                <Row gutter={[8, 8]}>
                                    <Col md={12} sm={12} xs={24}>
                                        <p className={"mb-10"}>Masa</p>
                                        <Form.Item
                                            className="mb-5"
                                            validateTrigger="onChange"
                                            name={`table_id`}
                                            rules={[noWhitespace(t("inputError"))]}
                                        >
                                            <Select
                                                showSearch
                                                notFoundContent={null}
                                                optionFilterProp="children"
                                                filterOption={(input, option) =>
                                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                                filterSort={(optionA, optionB) =>
                                                    optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                                                }
                                            >
                                                {tables.map((c , i)=>(
                                                    <Option key={i}  value={c.id}>
                                                        {c.name}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col md={12} sm={12} xs={24}>
                                        <p className={"mb-10"}>Xidmət edən şəxs</p>
                                        <Form.Item
                                            className="mb-5"
                                            validateTrigger="onChange"
                                            name={`person_id`}
                                            rules={[noWhitespace(t("inputError"))]}
                                        >
                                            <Select
                                                showSearch
                                                notFoundContent={null}
                                                optionFilterProp="children"
                                                filterOption={(input, option) =>
                                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                                filterSort={(optionA, optionB) =>
                                                    optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                                                }
                                            >
                                                {persons.map((c , i)=>(
                                                    <Option key={i}  value={c.id}>
                                                        {c.name}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>

                                    <Col xs={24}>
                                        <div className={"flex"}>
                                            <Button className={"mr-15"} htmlType="submit">
                                                {t("save")}
                                            </Button>
                                            <Link
                                                to={{
                                                    pathname: `/orders`,
                                                }}
                                            >
                                                <Button type={"primary"}>{t("cancel")}</Button>
                                            </Link>
                                        </div>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                    )}
                </Col>
            </Row>
        </div>
    );
}

export default connect(null, { notify })(EditOrders);

