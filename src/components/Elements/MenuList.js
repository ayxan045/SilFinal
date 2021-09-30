import React, { useState } from "react";
import { Menu } from "antd";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  AuditOutlined,
  HomeOutlined,
  UserOutlined,
  MenuUnfoldOutlined,
  OrderedListOutlined,
  CodeSandboxOutlined
} from "@ant-design/icons";
import { logOut } from "../../redux/actions";
import admin from "../../const/api";
import history from "../../const/history";

const MenuList = (props) => {
  return (
    <Menu
      mode="inline"
      theme="light"
      className="menu-ul"
    >
      <Menu.Item key="11">
        <Link to={`/`}>
          <HomeOutlined />
          <span>Ana səhifə</span>
        </Link>
      </Menu.Item>
      <Menu.Item key="12">
        <Link to={`/categories`}>
          <OrderedListOutlined />
          <span>Kateqoriyalar</span>
        </Link>
      </Menu.Item>
      <Menu.Item key="13">
        <Link to={`/persons`}>
          <UserOutlined />
          <span>Xidmət edənlər</span>
        </Link>
      </Menu.Item>
      <Menu.Item key="14">
        <Link to={`/tables`}>
          <CodeSandboxOutlined />
          <span>Masalar</span>
        </Link>
      </Menu.Item>
      <Menu.Item key="15">
        <Link to={`/menu`}>
          <MenuUnfoldOutlined />
          <span>Menyu</span>
        </Link>
      </Menu.Item>
      <Menu.Item key="16">
        <Link to={`/orders`}>
          <AuditOutlined />
          <span>Sifarişlər</span>
        </Link>
      </Menu.Item>
    </Menu>
  );
};


export default connect(null, { logOut })(MenuList);
