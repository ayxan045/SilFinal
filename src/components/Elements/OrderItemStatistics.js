import React from 'react';
import {Bar} from "@ant-design/charts";

function OrderItemStatistics(props) {

    let data2 = [
        {
            year: '1951 年',
            value: 38,
        },
        {
            year: '1952 年',
            value: 52,
        },
        {
            year: '1956 年',
            value: 61,
        },
        {
            year: '1957 年',
            value: 145,
        },
        {
            year: '1958 年',
            value: 48,
        },
    ];

    let config2 = {
        data: data2,
        style:{
            height:'230px'
        },
        xField: 'value',
        yField: 'year',
        seriesField: 'year',
        legend: { position: 'top-left' },
        colorField: 'type', // or seriesField in some cases
        color: ({ type }) => {
            if(type === 'male'){
                return 'red';
            }
            return '#5fb656';
        }
    };


    return (
        <div className="bg-white p-2">
            <h2 className={'mb-15'}>Sifariş edilmiş məhsullar</h2>
            <Bar {...config2} />
        </div>
    );
}


export default OrderItemStatistics;
