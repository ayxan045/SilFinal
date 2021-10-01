import React, {useState, useEffect} from "react";
import "@ant-design/compatible/assets/index.css";
import {
    Row,
    Col,
    Button,
    Tooltip,
    Select,
    Card,
    Popconfirm,
} from "antd";
import {
    PicCenterOutlined,
    EyeFilled,
    DeleteFilled,
    EditFilled,
} from "@ant-design/icons";
import admin from "../../../const/api"
import {Link} from "react-router-dom";
import {useTranslation} from "react-i18next";
import moment from "moment";
import {connect} from "react-redux";
import {notify} from "../../../redux/actions";
const { Option } = Select;

const {Meta} = Card;

const Menu = (props) => {
    const [spin, setSpin] = useState(true);
    const [gallery, setGallery] = useState([]);
    const {notify} = props;
    let [trigger, setTrigger] = useState(0);
    const [cat , setCat] = useState('')
    const [categories, setCategories] = useState([]);
    const getCats = async () => {
        await admin.get(`categories`).then((res) => {
            setCategories(res.data)
            console.log(res.data)
        });
    };


    useEffect(() => {
        getCats();
    } , [])

    const {t} = useTranslation();
    const getData = (e) => {
        setSpin(true);
        admin.get(`menu` , {params:{category_id:e}}).then((res) => {
            res.data && setSpin(false);
            setGallery(
                res.data.map((d, index) => {
                    return {
                        ...d,
                        key: index + 1,
                        index,
                    };
                })
            );
        });
    };

    const deleteItem = async (i) => {
        if (i === 0 || i) {
            await admin
                .delete(`menu/${i}`)
                .then((res) => {
                    setTrigger(++trigger);
                    notify("silindi", true);
                })
                .catch((res) => {
                    notify(res.err, false);
                });
        }
    };

    useEffect(() => {
        getData();
    }, [t, trigger]);

    return (
        <div>
            <Row gutter={[10, 10]}>
                <Col xs={24}>
                    <div className="border flex-between page-heading flex p-2 mt-0 bg-white">
                        <div className="page-name">
                            <PicCenterOutlined className="f-20 mr5-15"/>
                            <span className="f-20 bold">Menyu</span>
                        </div>
                        <div>
                            <Link
                                to={{
                                    pathname: `/menu/edit`,
                                }}
                            >
                                <Button type={"primary"}>Əlavə et</Button>
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white mt-10 p-1 ">
                        <Select
                            showSearch
                            onChange={(e)=>{ getData(e)}}
                            placeholder={'Kategoriyalar'}
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
                            {
                                categories.map((w, i) => {
                                    return (
                                        <Option key={i} value={w.id}>
                                            {w.name}
                                        </Option>
                                    );
                                })
                            }
                        </Select>
                    </div>

                </Col>

                <Col xs={24}>
                    <Card loading={spin}>
                        <Row gutter={[16, 16]}>
                            {gallery.map((g, i) => (
                                <Col key={i} lg={6} md={12} sm={24}>
                                    <Card
                                        className={"animated w-100 zoomIn"}
                                        hoverable
                                        cover={
                                            !spin && (
                                                <img alt="example" src={g.image}/>
                                            )
                                        }
                                        actions={
                                            !spin && [
                                                <Link
                                                    to={{
                                                        pathname: `/menu/edit/${g.id}`,
                                                    }}
                                                >
                                                    <Tooltip
                                                        placement="bottom"
                                                        className="ml-5"
                                                        title={t("edit")}
                                                    >
                                                        <Button
                                                            className="border-none"
                                                            type="text"
                                                            shape="circle"
                                                        >
                                                            <EditFilled/>
                                                        </Button>
                                                    </Tooltip>
                                                    ,
                                                </Link>,
                                                <Popconfirm
                                                    placement="topRight"
                                                    title={t("areYouSure")}
                                                    onConfirm={() => deleteItem(g.id)}
                                                    okText={t("yes")}
                                                    cancelText={t("no")}
                                                >
                                                    <Tooltip
                                                        placement="bottom"
                                                        className="ml-5"
                                                        title={t("delete")}
                                                    >
                                                        <Button
                                                            className="border-none"
                                                            type="text"
                                                            shape="circle"
                                                        >
                                                            <DeleteFilled/>
                                                        </Button>
                                                    </Tooltip>
                                                </Popconfirm>,
                                            ]
                                        }
                                    >
                                        <strong className={'line-clamp line-1'}>{g.name}</strong>
                                        <div className="flex mt-10 w-100 flex-between">
                                            <div className={'line-clamp line-1'}>{g.category}</div>
                                            <strong className={'line-clamp line-1'}>{g.price} azn</strong>
                                        </div>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default connect(null, {notify})(Menu);
