import React , {useEffect , useState} from 'react';
import history from "../../const/history";
import {Button , Spin} from "antd";
import admin from "../../const/api";
import moment from "moment";

function Notification(props) {
    const [messages, setMessages] = useState(undefined);
    const [videoApply, setVideoApply] = useState(undefined);
    const [spin, setspin] = useState(false);
    useEffect(()=>{
        setspin(true)
        admin.get("meetings").then((res) => {
            setVideoApply(res.data.content.data.filter( (d) =>{return  d.status === 0} ).length);
            setspin(false)
        });
        admin.get("contact/us").then((res) => {
            setMessages(res.data.content.filter( (d) =>{return  d.status === 1} ).length);
            setspin(false)
        });
    } , [props])
    return (
        <div>
            {
                spin ?
                    <div className="w-100 p-1 flex all-center">
                        <Spin size={'large'} />
                    </div>
                    :
                    <table className="customtable">
                        <tbody>
                        <tr onClick={()=>{history.push('/messages')}}>
                            <td>Oxunmamış mesajlar</td>
                            <td>
                                <Button type={'circle'}><span className="red">{messages}</span></Button>
                            </td>
                        </tr>
                        <tr onClick={()=>{history.push('/video-apply')}}>
                            <td>Baxılmamış video müraciət</td>
                            <td>
                                <Button type={'circle'}><span className="red">{videoApply}</span></Button>
                            </td>
                        </tr>
                        </tbody>
                    </table>
            }
        </div>
    );
}


export default Notification;
