import React, { useState } from "react";
import { Menu } from "antd";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  AuditOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { logOut } from "../../redux/actions";
import admin from "../../const/api";
import history from "../../const/history";
const { SubMenu } = Menu;

const MenuList = (props) => {
  const { t } = useTranslation();
  const [openKeys, setOpenKeys] = useState([]);
  const rootSubmenuKeys = ["10","50", "21", "31", "41", "51", "61"];

  const onOpenChange = (openKeysList) => {
    const latestOpenKey = openKeysList.find(
      (key) => openKeys.indexOf(key) === -1
    );
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


export default connect(null, { logOut })(MenuList);
