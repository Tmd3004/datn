import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import useResponsive from "../../hooks/useResponsive";
import Menu from "./Menu";
import { useSelector } from "react-redux";

const MainLayout = () => {
  const isDesktop = useResponsive("up", "md");

  return (
    <>
      <div>{isDesktop && <Menu />}</div>
      <Outlet />
    </>
  );
};

export default MainLayout;
