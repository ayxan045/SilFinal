import React, { useState, useEffect } from "react";
import { Menu } from "antd";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  FundOutlined,
  OrderedListOutlined,
  AuditOutlined,
  MessageOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { logOut, setEdit } from "../../redux/actions";
import admin from "../../const/api";
import history from "../../const/history";

const { SubMenu } = Menu;

const MenuList = (props) => {
  const { t } = useTranslation();
  // const {setEdit , edit} =  props
  const [openKeys, setOpenKeys] = useState([]);
  const [cats, setCats] = useState([]);
  const [length, setCatLength] = useState(null);
  const rootSubmenuKeys = ["10","50", "21", "31", "41", "51", "61"];

  const logOut = () => {
    localStorage.removeItem("access_token");
    props.logOut();
    history.push("/");
  };

  const getCategories = async () => {
    await admin.get("categories").then((res) => {
      setCatLength(res.data.content.length);
      setCats(
        res.data.content.map((p, index) => {
          if (p.locales === undefined) {
            logOut();
          }
          return {
            ...p,
            name: p.locales.find((l) => {
              return l.local === localStorage.getItem("locale");
            }).name,
          };
        })
      );
    });
  };

  useEffect(() => {
    getCategories();
  }, [t, localStorage.getItem("locale"), length]);

  useEffect(() => {
    let exp = localStorage.getItem("exp");
    let logtime = localStorage.getItem("now");
    let expDate = parseInt(logtime) + parseInt(exp);
    let time0ut = expDate - Date.now();
    if (time0ut <= 0) {
      logOut();
    }
  }, [Date.now()]);

  const onOpenChange = (openKeysList) => {
    const latestOpenKey = openKeysList.find(
      (key) => openKeys.indexOf(key) === -1
    );
    if (openKeysList[openKeysList.length - 1] === "21") {
      getCategories();
    }
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(openKeysList);
    } else {
      const opens = latestOpenKey ? [latestOpenKey] : [];
      setOpenKeys(opens);
    }
  };

  return (
    <Menu
      openKeys={openKeys}
      // inlineCollapsed={collapsed}
      mode="inline"
      theme="light"
      onOpenChange={onOpenChange}
      className="menu-ul"
    >

      <SubMenu
          key="10"
          title={
            <span>
            <AuditOutlined />
            <span>{t("admin")}</span>
          </span>
          }
      >
        <Menu.Item key="14">
          <Link to={`/`}>
            <span>Ana səhifə</span>
          </Link>
        </Menu.Item>
      </SubMenu>

    </Menu>
  );
};

const mapStateToProps = ({ edit }) => {
  return { edit };
};

export default connect(mapStateToProps, { logOut, setEdit })(MenuList);
