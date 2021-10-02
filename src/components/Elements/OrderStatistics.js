import React from 'react';
import {Column} from "@ant-design/charts";

function OrderStatistics(props) {
    let data = [
        {
            type: '家具家电',
            sales: 38,
        },
        {
            type: 'dqdq',
            sales: 22,
        },
        {
            type: 'dqwdd',
            sales: 32,
        },
        {
            type: 'dqdqd',
            sales: 32,
        },
        {
            type: 'dqwdqw',
            sales: 43,
        },
        {
            type: 'qdqdq',
            sales: 52,
        },
    ];

    let config = {
        data: data,
        xField: 'type',
        yField: 'sales',
        style:{
            height:'250px'
        },
        label: {
            position: 'middle',
            style: {
                fill: '#FFFFFF',
            },
        },
        colorField: 'type', // or seriesField in some cases
        color: ({ type }) => {
            if(type === 'male'){
                return 'red';
            }
            return '#5fb656';
        },
        xAxis: {
            label: {
                autoHide: true,
                autoRotate: false,
            },
        },
        meta: {
            type: { alias: 'Say' },
            sales: { alias: 'Say' },
        },
        legend:true
    };


    return (
        <div className="bg-white p-2">
            <h2 className={'mb-15'}>Sifarişlər</h2>
            <Column  {...config} />
        </div>
    );
}

export default OrderStatistics;
