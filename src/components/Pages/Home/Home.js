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
function Home(props) {
    const [show,setShow] = useState(true)
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
                        <Col md={12} xs={24}>
                            <OrderStatistics/>
                        </Col>
                        <Col md={12} xs={24}>
                            <OrderItemStatistics/>
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
