import React from 'react';
import Slider from "react-slick";
import {PicCenterOutlined} from "@ant-design/icons";
import {Link} from "react-router-dom";
import {Button} from "antd";

function MenuSlider(props) {
    let settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4,
        initialSlide: 0,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };
    return (
        <div className="">
            <div className="border flex-between page-heading flex p-2 mt-0 bg-white">
                <div className="page-name">
                    <PicCenterOutlined className="f-20 mr5-15" />
                    <span className="f-20 bold">Menyu</span>
                </div>
                <div>
                    <Link
                        to={{
                            pathname: `/menu`,
                        }}
                    >
                        <Button className={'mr-15 animated zoomIn'} type={"primary"}>Ətraflı</Button>
                    </Link>
                </div>
            </div>
            <Slider className={'border mt-10 bg-white'} {...settings}>
                <div className={'p-1'}>
                  <div className="p-2 border bg-white">
                      1
                  </div>
                </div>
                <div className={'p-1'}>
                    <div className="p-2 border bg-white">
                        1
                    </div>
                </div>
                <div className={'p-1'}>
                    <div className="p-2 border bg-white">
                        1
                    </div>
                </div>
                <div className={'p-1'}>
                    <div className="p-2 border bg-white">
                        1
                    </div>
                </div>
                <div className={'p-1'}>
                    <div className="p-2 border bg-white">
                        1
                    </div>
                </div>
            </Slider>

        </div>
    );
}

export default MenuSlider;
