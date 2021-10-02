import React, {useEffect, useState} from 'react';
import {Row, Col, Button} from 'antd'
import {PicCenterOutlined} from "@ant-design/icons";
import {Link} from "react-router-dom";
import { Column , Bar } from '@ant-design/charts';
import Slider from "react-slick";
import Company from "../../Elements/Company";
import OrderStatistics from "../../Elements/OrderStatistics";
import OrderItemStatistics from "../../Elements/OrderItemStatistics";
import MenuSlider from "../../Elements/MenuSlider";
import Total from "../../Elements/Total";
import admin from "../../../const/api";
function Home(props) {
    const [spin , setSpin] = useState(false)
    const [orders , setOrders] = useState([])
    const [ordersLength , setOrdersLength] = useState(0)
    const [total , setTotal] = useState(0)
    const [orderProductsLength , setorderProductsLength] = useState(0)
    const [orderProducts , setOrderProducts] = useState([])
    const [show,setShow] = useState(true)

    const getOrdersData = () => {
        setSpin(true);
        admin.get(`orders`).then((res) => {
            res.data && setSpin(false);
            setOrdersLength(res.data.length)
            let news = [];
            let waiting = [];
            let finished = [];
            let canceled = [];
            let totals = 0
            res.data.reverse().map((d, index) => {
                let obj = {
                    key: index + 1,
                    index,
                }
                return (
                    d.status !== 3 ? totals += d.total : null,
                    d.status === 0 ? news.push(obj) :
                        d.status === 1 ? waiting.push(obj) :
                            d.status === 2 ? finished.push(obj) :
                                d.status === 3 ? canceled.push(obj) : undefined
                )
            })
            setTotal(totals)
            setOrders([
                {
                    type: 'Hamısı',
                    count: res.data.length,
                },
                {
                    type: 'Yeni sifariş',
                    count: news.length,
                },
                {
                    type: 'Sonlanmayan',
                    count: waiting.length,
                },
                {
                    type: 'Sonlanan',
                    count: finished.length,
                },
                {
                    type: 'Ləğv edilmiş',
                    count: canceled.length,
                },
            ])
        });
    }
    const getData = async () => {
        await admin.get(`order-products`).then((res) => {
            setSpin(false);
            setorderProductsLength(res.data.length)
            let preparing = [];
            let done = [];
            let returned = [];
            let canceled = [];
            res.data.reverse().map((d, index) => {
                let obj = {
                    key: index + 1,
                    index,
                }
                return (
                    d.status === 0 ? preparing.push(obj) :
                        d.status === 1 ? done.push(obj) :
                            d.status === 2 ? returned.push(obj) :
                                d.status === 3 ? canceled.push(obj) : undefined
                )
            })
            setOrderProducts([
                {
                    type: 'Hamısı',
                    count: res.data.length,
                },
                {
                    type: 'Hazırlanır',
                    count: preparing.length,
                },
                {
                    type: 'Təhvil verildi',
                    count: done.length,
                },
                {
                    type: 'Geri verildi',
                    count: returned.length,
                },
                {
                    type: 'Ləğv edilmiş',
                    count: canceled.length,
                },
            ])
        });
    }

    useEffect(() => {
        getOrdersData()
        getData()
    },[])

    useEffect(()=>{
        window.addEventListener("resize", () => {
            setShow(window.innerWidth > 1200)
        });
        setShow(window.innerWidth > 1200)
    })

    return (
        <Row gutter={[10, 10]}>
            <Col xs={24}>
                <div className="border flex-between flex-wrap animated fadeInDown page-heading flex p-2 mt-0 bg-white">
                    <div className="page-name">
                        <PicCenterOutlined className="f-20 mr5-15" />
                        <span className="f-20 bold">İnformasiya</span>
                    </div>
                    <div className="flex">
                        <Link
                            to={{pathname: `/orders`,}}
                        >
                            <Button className={'mr-15 animated zoomIn'} type={"primary"}>Sifarişlər</Button>
                        </Link>
                    </div>
                </div>
            </Col>
            <Col xs={24}>
              <Company/>
            </Col>
            <Col xs={24}>
                <div className="animated zoomIn">
                    <Row gutter={[10, 10]}>
                        <Col md={10} xs={24}>
                            <OrderStatistics
                                orders={orders}
                                spin={spin}
                            />
                        </Col>
                        <Col md={10} xs={24}>
                            <OrderItemStatistics
                               orders={orderProducts}
                               spin={spin}
                            />
                        </Col>
                        <Col md={4} xs={24}>
                            <Total
                                ordersLength={ordersLength}
                                total={total}
                                spin={spin}
                                orderProductsLength={orderProductsLength}
                            />
                        </Col>
                        {show &&
                        <Col xs={24}>
                            <MenuSlider/>
                        </Col>
                        }
                    </Row>
                </div>
            </Col>
        </Row>
    );
}

export default Home;
