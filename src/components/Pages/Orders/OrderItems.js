import React, { useEffect, useState, useRef } from "react";
import {
    Row,
    Col,
    Card,
    Table,
    Button,
    Switch,
    Spin,
    Form,
    Tooltip,
    Input,
    Popconfirm, Select, InputNumber,
} from "antd";
import {
    DownCircleOutlined,
    EditFilled,
    DeleteFilled, PicCenterOutlined, RetweetOutlined, CloseCircleOutlined,
} from "@ant-design/icons";
import { convertColumns } from "../../../utils/columnconverter";
import {notify } from '../../../redux/actions'
import { connect } from "react-redux";
import admin from "../../../const/api";
import { useTranslation } from "react-i18next";
import {noWhitespace, whiteSpace} from "../../../utils/rules";
import {Link} from "react-router-dom";
const { Option } = Select

const OrderItems = (props) => {
    const [form] = Form.useForm();
    const {id} = props.match.params
    const { t } = useTranslation();
    const [positions, setPositions] = useState([]);
    const [categories, setCategories] = useState([]);
    let imageUrl = 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2Foriginals%2F19%2F53%2F4a%2F19534a2be73c101206161b297e76f14f.jpg&f=1&nofb=1'
    const [image, setImage] = useState(imageUrl);
    const [menus, setMenus] = useState([]);
    const [orderData, setOrderData] = useState({});
    const [spin, setSpin] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const [editing, setEditing] = useState(null);
    const cols = [
        { key: "index", value: "#", con: true },
        { key: "name", value: t("name"), con: true },
        { key: "id", value: "", con: false },
    ];
    const { notify } = props;
    const columns = [
        {
            title: "#",
            key: "1",
            dataIndex: "index",
            width: 80,
        },
        {
            title: "Şəkil",
            dataIndex: "image",
            key: "2",
            render: (i) => {
                return <img className={"tableImage"} src={i} alt="" />;
            },
        },
        {
            title: t("name"),
            key: "3",
            dataIndex: "menu",
        },
        {
            title: t("category"),
            key: "4",
            dataIndex: "category",
        },
        {
            title:'Say',
            key: "5",
            dataIndex: "count",
        },
        {
            title:'Qiymət (azn)',
            key: "6",
            dataIndex: "price",
            render: (i) => {
                return <span>{i} azn</span>
            },
        },
        {
            title:'Ümumi (azn)',
            key: "6",
            dataIndex: "total",
            render: (i) => {
                return <span className={(i.status === 2 || i.status === 3) && 'line red'}>{i.price} azn</span>
            },
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "6",
            render: (i) => {
                return i === 0 ? (
                    <span className={`green ${orderData.status === 2 && 'line'}`  }>Hazırlanır</span>
                ) : i === 1 ? (
                        <span className="blue">Təhvil verildi</span>
                    ) :
                    i === 2 ? (
                        <span className="red">Geri verildi</span>
                    ):
                    i === 3 ? (
                        <span className="red">Ləğv edildi</span>
                    ) : null
            },
        },
        {
            title: "",
            key: "7",
            dataIndex: "buttons",
            width: 30,
            render: (i) => {
                return (
                    <>
                        {(orderData.status !== 2 && orderData.status !== 3) &&
                          <div className="flex flex-end">
                            {i.status === 0 &&
                            <Popconfirm
                                placement="topRight"
                                title={'Təhvil verildiyinə əminsinizmi ?'}
                                onConfirm={() => changeStatus(i ,1)}
                                okText={t("yes")}
                                cancelText={t("no")}
                            >
                                <Tooltip className="ml-5" placement="left" title={'Təhvil ver'}>
                                    <Button className="border-none" type="text" shape="circle">
                                        <DownCircleOutlined />
                                    </Button>
                                </Tooltip>
                            </Popconfirm>
                            }
                            {i.status === 1 &&
                            <Popconfirm
                                placement="topRight"
                                title={'Geri verildiyinə əminsinizmi ?'}
                                onConfirm={() => changeStatus(i ,2)}
                                okText={t("yes")}
                                cancelText={t("no")}
                            >
                                <Tooltip className="ml-5" placement={'left'} title={'Geri qaytar'}>
                                    <Button className="border-none" type="text" shape="circle">
                                        <RetweetOutlined />
                                    </Button>
                                </Tooltip>
                            </Popconfirm>
                            }

                            {(i.status === 0) &&
                            <Tooltip className="ml-5" title={t("edit")} placement="topRight">
                                <Button
                                    className="border-none"
                                    type="text"
                                    shape="circle"
                                    onClick={() => setEditingObject(i.id)}
                                >
                                    <EditFilled/>
                                </Button>
                            </Tooltip>
                            }
                              {i.status !== 1 &&
                              <Popconfirm
                                  placement="topRight"
                                  title={t("areYouSure")}
                                  onConfirm={() => deletePosition(i.id)}
                                  okText={t("yes")}
                                  cancelText={t("no")}
                              >
                                  <Tooltip placement={'bottom'} className="ml-5" title={t("delete")}>
                                      <Button  className="border-none" type="text" shape="circle">
                                          <DeleteFilled/>
                                      </Button>
                                  </Tooltip>
                              </Popconfirm>
                              }
                              {(i.status !== 1 && i.status !== 2) &&
                              <Popconfirm
                                  placement="topRight"
                                  title={'Ləğv etmək istədiyinzə əminsinizmi?'}
                                  onConfirm={() => changeStatus(i ,3)}
                                  okText={t("yes")}
                                  cancelText={t("no")}
                              >
                                  <Tooltip placement={'bottom'} className="ml-5" title={t("cancel")}>
                                      <Button className="border-none" type="text" shape="circle">
                                          <CloseCircleOutlined/>
                                      </Button>
                                  </Tooltip>
                              </Popconfirm>
                              }
                        </div>
                        }
                    </>
                );
            },
        },
    ];

    const setEditingObject = async (i) => {
        setEditing(i);
        await admin.get(`/order-products/${i}`).then((res) => {
            let data = res.data
            getMenus(res.data.category_id)
            form.setFieldsValue(data);
            setImage(res.data.image);
        });
    };

    const cancelEditing = () => {
        setEditing(null);
        setImage(imageUrl)
        setDisabled(true)
        form.resetFields();
    };

    const changeStatus = (i , status) => {
        let obj ={
            ...i.obj,
            status,
        }
        console.log(obj)
        admin.put(`order-products/${i.id}`,  obj).then(()=>{
            getPositions()
        })
    }

    const deletePosition = async (i) => {
        await admin
            .delete(`/order-products/${i}`)
            .then(() => {
                notify("silindi", true);
                getPositions();
            })
            .catch((err) => {
                notify(err.response, false);
            });
    };

    const putOrderData = (params) => {
        admin.get(`orders/${id}`).then((res)=>{
            admin.put(`orders/${id}`,  {...res.data , ...params}).then(()=>{
                getOrderData(id)
            })
        })
    }


    const savePosition = async (values) => {
        orderData.status === 0 && putOrderData({status:1})
        let obj = {
            ...values,
            order_id:id,
            status:0,
            image,
            menu:menus.find(m=>m.id === parseInt(values.menu_id)).name,
            category:categories.find(m=>m.id === parseInt(values.category_id)).name
        }
        if (!editing) {
            await admin
                .post(`/order-products`,obj )
                .then((res) => {
                    notify("", true);
                    getPositions();
                    orderData.status === 0 && putOrderData({status:1})
                    cancelEditing();
                })
                .catch((err) => {
                    notify(err.response, false);
                });
        } else {
            obj["id"] = editing;
            await admin
                .put(`/order-products/${editing}`, obj)
                .then((res) => {
                    notify("", true);
                    getPositions();
                    cancelEditing();
                })
                .catch((err) => {
                    notify(err.response, false);
                });
        }
    };

    const getOrderData = async  (id) => {
        await admin.get(`orders/${id}`).then((res) => {
            setOrderData(res.data);
        });
    }

    const getPositions = async () => {
        setSpin(true);
        setTimeout(async ()=>{
           await admin.get(`order-products` , {params:{order_id:id}}).then((res) => {
                setSpin(false);
                if(!res.data.length && orderData.status === 1){
                    putOrderData({status:0 , total:0})
                }
                if(res.data.length){
                    let total = 0
                    res.data.forEach((p, index) => {
                        if(p.status !== 2 && p.status !== 3){
                            total += p.total
                        }
                    })
                    putOrderData({total})
                }
                if(!res.data.length && orderData.status === 0){
                    admin.put(`orders/${id}`,  {...orderData , total:0}).then(()=>{
                        getOrderData(id)
                    })
                }
                setPositions(
                    res.data.map((p, index) => {
                        return {
                            key: index + 1,
                            ...p,
                            index: index + 1,
                            total:{
                                price:p.total,
                                status:p.status
                            },
                            buttons:{
                                id:p.id,
                                status:p.status,
                                obj:p
                            }
                        };
                    })
                );
            });
        } , [1000])
    };

    useEffect(() => {
        getPositions();
        getOrderData(id);
    }, [t , id]);

    const getMenus = async (category_id) => {
        form.setFieldsValue({
            menu_id:undefined
        })
        setImage(imageUrl)
        disabled && setDisabled(false)
        await admin.get(`menu` , {params:{category_id}}).then((res) => {
            setMenus(res.data)
        })
    }

    const getCategories = async () => {
        await admin.get(`categories`).then((res) => {
            setSpin(false);
            setCategories(res.data)
        })
    }

    const menuChange = (e) => {
        let menu = menus.find(s=>s.id === parseInt(e))
        setImage(menu.image)
        form.setFieldsValue({
            price:menu.price,
            total:parseInt(form.getFieldValue('count'))*menu.price
        })
    }

    const countChange = (e) => {
        form.setFieldsValue({
            count: e <= 0 ? 1 : e,
            total:parseInt(e <= 0 ? 1 : e)*form.getFieldValue('price')
        })
    }


    useEffect(()=>{
        getCategories()
    } ,[])


    return (
        <Row gutter={[10, 10]}>
            <Col xs={24}>
                <div className="border flex-between page-heading flex p-2 mt-0 bg-white">
                    <div className="page-name">
                        <PicCenterOutlined className="f-20 mr5-15" />
                        <span className="f-20 bold">Sifariş məlumatları</span>
                    </div>
                    <Link
                        to={{
                            pathname: `/orders`,
                        }}
                    >
                        <Button type={"primary"}>Sifarişlər</Button>
                    </Link>
                </div>
            </Col>
            <Col xs={24}>
                {!spin &&
                <div className="h-100  animated fadeInLeft  p-2 mt-0 bg-white">
                    <div className={'flex mt-10 flex-between'}>
                        <span> Xidmət edən şəxs </span>
                        <b>{orderData.person}</b>
                    </div>
                    <div className={'flex mt-10 flex-between'}>
                        <span> Masa</span>
                        <b>{orderData.table}</b>
                    </div>
                    <div className={'flex mt-10 flex-between'}>
                        <span> Status</span>
                        <b>
                            {orderData.status === 0 ? (
                                <span className="green"> Yeni</span>
                            ) : orderData.status === 1 ? (
                                    <span className="blue"> Sonlanmayan</span>
                                ) :
                                orderData.status === 2 ? (
                                    <span className="green"> Sonlanan</span>
                                ):
                                orderData.status === 3 ? (
                                    <span className="red"> Ləğv edilmiş</span>
                                ): null
                            }
                        </b>
                    </div>
                    <div className={'flex mt-10 flex-between'}>
                        <span>Ümumi məbləğ</span>
                        <b>{orderData.total} azn</b>
                    </div>
                </div>
                }
            </Col>
            <Col xs={24}>
                <Table
                    loading={spin}
                    size="small"
                    className="bg-white animated fadeInRight"
                    columns={columns}
                    dataSource={convertColumns(positions, cols)}
                    pagination={{
                        pageSize: 10,
                        current_page: 1,
                        total: positions.length,
                    }}
                />
            </Col>
            {(orderData.status !== 2 && orderData.status !== 3) &&
                <Col>
                    <Card title={t("addTo")} className={"animated fadeInRight"}>
                        <Form layout="vertical" onFinish={savePosition} form={form}>
                            <Row gutter={[8, 8]}>
                                <Col md={4} xs={24}>
                                    <div className="gallery border w-100">
                                        <img className={'mainImg w-100'} src={image} alt=""/>
                                    </div>
                                </Col>
                                <Col md={20} xs={24}>
                                    <Row gutter={[8, 8]}>
                                        <Col md={12} sm={12} xs={24}>
                                            <p className={"mb-10"}>Kategoriya</p>
                                            <Form.Item
                                                className="mb-5"
                                                validateTrigger="onChange"
                                                name={`category_id`}
                                                rules={[noWhitespace(t("inputError"))]}
                                            >
                                                <Select
                                                    onChange={(e) =>getMenus(e)}
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
                                                    {categories.map((c , i)=>(
                                                        <Option key={i}  value={c.id}>
                                                            {c.name}
                                                        </Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col md={12} sm={12} xs={24}>
                                            <p className={"mb-10"}>Məhsullar (Menu)</p>
                                            <Form.Item
                                                className="mb-5"
                                                validateTrigger="onChange"
                                                name={`menu_id`}
                                                rules={[noWhitespace(t("inputError"))]}
                                            >
                                                <Select
                                                    showSearch
                                                    onChange={(e) => menuChange(e) }
                                                    notFoundContent={null}
                                                    disabled={disabled}
                                                    optionFilterProp="children"
                                                    filterOption={(input, option) =>
                                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                    }
                                                    filterSort={(optionA, optionB) =>
                                                        optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                                                    }
                                                >
                                                    {menus.map((c , i)=>(
                                                        <Option key={i}  value={c.id}>
                                                            {c.name}
                                                        </Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col md={6} sm={12} xs={24}>
                                            <p className={"mb-10"}>Say</p>
                                            <div className="form-lang">
                                                <Form.Item
                                                    validateTrigger="onChange"
                                                    name={`count`}
                                                    rules={[noWhitespace(t("inputError"))]}
                                                >
                                                    <InputNumber
                                                        onChange={(e) =>{countChange(e)}}
                                                        min={1} className="w-100" />
                                                </Form.Item>
                                            </div>
                                        </Col>
                                        <Col md={6} sm={12} xs={24}>
                                            <p className={"mb-10"}>Qiymət (azn)</p>
                                            <div className="form-lang">
                                                <Form.Item
                                                    validateTrigger="onChange"
                                                    name={`price`}
                                                    rules={[noWhitespace(t("inputError"))]}
                                                >
                                                    <InputNumber readOnly className="w-100" />
                                                </Form.Item>
                                            </div>
                                        </Col>
                                        <Col md={12} sm={12} xs={24}>
                                            <p className={"mb-10"}>Ümumi qiymət</p>
                                            <div className="form-lang">
                                                <Form.Item
                                                    validateTrigger="onChange"
                                                    name={`total`}
                                                    rules={[noWhitespace(t("inputError"))]}
                                                >
                                                    <InputNumber readOnly className="w-100" />
                                                </Form.Item>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <div className="flex  flex-end mt-15">
                                <Button className={'mr-10'}  type={'primary'} htmlType="submit">{t("save")}</Button>
                                <Button onClick={cancelEditing}>{t("cancel")}</Button>
                            </div>
                        </Form>
                    </Card>
                </Col>
            }
        </Row>
    );
};


export default connect(null, { notify })(OrderItems);


