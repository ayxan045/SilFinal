import React, { useState, useEffect } from "react";
import "@ant-design/compatible/assets/index.css";
import {
    Row,
    Col,
    Table,
    Button,
    Tooltip,
    Spin,
    Popconfirm,
    Modal, Select,
} from "antd";
import {
    PicCenterOutlined,
    EyeFilled,
    DeleteFilled,
    EditFilled,
} from "@ant-design/icons";
import moment from "moment";
import admin from "../../../const/api";
import { notify } from "../../../redux/actions";
import { useTranslation } from "react-i18next";
import { convertColumns } from "../../../utils/columnconverter";
import { connect } from "react-redux";
import OrderItems from "./OrderItems";
import { Link } from "react-router-dom";
const {Option} = Select
function Orders(props) {
    const [postlist, setPostList] = useState([]);
    const [status , setStatus] = useState(undefined)
    const [spin, setSpin] = useState(false);
    const { t } = useTranslation();
    const [selectedData, setSelectedData] = useState(null);
    const [visibleView, setVisibleView] = useState(false);
    let [trigger, setTrigger] = useState(0);

    const cols = [
        { key: "tableIndex", value: "#", con: true },
        { key: "person", value: "Xidmət edən şəxs", con: true },
        { key: "table", value: "Masa", con: true },
        { key: "date", value: "Yaradılma tarixi", con: false },
        { key: "status", value: "Status", con: false },
        { key: "id", value: "", con: false },
    ];

    const initialColumns = [
        {
            title: "#",
            dataIndex: "tableIndex",
            key: "1",
            width: 60,
        },
        {
            title: "Xidmət edən şəxs",
            dataIndex: "person",
            key: "2",
        },
        {
            title: "Masa",
            dataIndex: "table",
            key: "3",
        },
        {
            title: "Yaradılma tarixi",
            dataIndex: "date",
            key: "4",
        },
        {
            title: "Ümumi məbləğ",
            dataIndex: "total",
            key: "5",
            render: (i) => {
                return  (
                    <span className={i <= 0 ? 'red':'blue'}>{i} azn</span>
                )
            }
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "6",
            render: (i) => {
                return i === 0 ? (
                    <span className="green">Yeni</span>
                ) : i === 1 ? (
                    <span className="blue">Sonlanmayan</span>
                ) :
                i === 2 ? (
                    <span className="red">Sonlanan</span>
                ): <span className="red">Ləğv edilmiş</span>
            },
        },
        {
            title: "",
            dataIndex: "id",
            key: "9",
            render: (i) => {
                return (
                    <div className="flex flex-end">
                        <Tooltip className="ml-5" title={t("edit")} placement="topRight">
                            <Link
                                to={{
                                    pathname: `/orders/edit/${i}`,
                                }}
                            >
                                <Button className="border-none" type="text" shape="circle">
                                    <EditFilled />
                                </Button>
                            </Link>
                        </Tooltip>
                        <Popconfirm
                            placement="topRight"
                            title={t("areYouSure")}
                            onConfirm={() => deletePost(i)}
                            okText={t("yes")}
                            cancelText={t("no")}
                        >
                            <Tooltip className="ml-5" title={t("delete")}>
                                <Button className="border-none" type="text" shape="circle">
                                    <DeleteFilled />
                                </Button>
                            </Tooltip>
                        </Popconfirm>
                        <Tooltip
                            className="ml-5"
                            title={'Sifariş məhsulları'}
                            placement="topRight"
                        >
                            <Link
                                to={{
                                    pathname: `/orders/products/${i}`,
                                }}
                            >
                                <Button
                                    className="border-none"
                                    type="text"
                                    shape="circle"
                                >
                                    <EyeFilled />
                                </Button>
                            </Link>
                        </Tooltip>
                    </div>
                );
            },
        },
    ];

    const { notify } = props;

    const viewMessage = async (i) => {
        await setSelectedData(i);
        setVisibleView(true);
    };

    const deletePost = async (i) => {
        if (i === 0 || i) {
            await admin
                .delete(`orders/${i}`)
                .then((res) => {
                    setTrigger(++trigger);
                    notify("silindi", true);
                })
                .catch((res) => {
                    notify(res.err, false);
                });
        }
    };

    const getPostList = () => {
        setSpin(true);
        admin.get(`orders`, { params: { status } }).then((res) => {
            res.data && setSpin(false);
            setPostList(
                res.data.map((d, index) => {
                    return {
                        ...d,
                        key: index + 1,
                        index,
                        tableIndex: index + 1,
                        catId: d.category_id,
                        title: d.name,
                        desc: d.category_id,
                        date: d.date ? moment(d?.date).format("DD-MM-YYYY hh:mm A") : ''
                    };
                })
            );
        });
    };

    useEffect(() => {
        getPostList();
    }, [t, trigger]);

    return (
        <div>
            <Row gutter={[10, 10]}>
                <Col xs={24}>
                    <div className="border flex-between page-heading flex p-2 mt-0 bg-white">
                        <div className="page-name">
                            <PicCenterOutlined className="f-20 mr5-15" />
                            <span className="f-20 bold">Sifarişlər</span>
                        </div>
                        <div>
                            <Link
                                to={{
                                    pathname: `/orders/edit`,
                                }}
                            >
                                <Button type={"primary"}>Əlavə et</Button>
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white mt-10 p-1 ">
                        <Select
                            showSearch
                            onChange={(e)=>{setStatus(e)}}
                            placeholder={'Status'}
                            className={'w-100'}
                            notFoundContent={null}
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            filterSort={(optionA, optionB) =>
                                optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                            }
                        >
                            <Option value={undefined}>
                                Hamısı
                            </Option>
                            <Option value={0}>
                                Yeni (Məhsulsuz)
                            </Option>
                            <Option value={1}>
                                Sonlanmayan
                            </Option>
                            <Option value={2}>
                                Sonlanan
                            </Option>
                            <Option value={3}>
                                Ləğv edilmiş
                            </Option>
                        </Select>
                    </div>

                </Col>

                <>
                    {spin ? (
                        <Col xs={24}>
                            <div className="flex animated fadeInUp bg-white all-center p-2">
                                <Spin size={"large"} />
                            </div>
                        </Col>
                    ) : (
                        <Col xs={24}>
                            <Table
                                size="small"
                                className="bg-white animated fadeIn"
                                columns={initialColumns}
                                dataSource={convertColumns(postlist, cols)}
                                pagination={{
                                    pageSize: 25,
                                    current_page: 1,
                                }}
                            />
                        </Col>
                    )}
                </>
            </Row>

            <Modal
                title={t("detailedInfo")}
                centered
                className={"padModal mediumModal"}
                visible={visibleView}
                onOk={() => setVisibleView(false)}
                onCancel={() => setVisibleView(false)}
                footer={[]}
            >
                <OrderItems setVisibleView={setVisibleView} id={selectedData} />
            </Modal>
        </div>
    );
}

const mapStateToProps = ({ edit, cats }) => {
    return { edit, cats };
};

export default connect(mapStateToProps, { notify })(Orders);
