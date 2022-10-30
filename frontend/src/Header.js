import React, { useContext } from "react";
import { ThemeContext } from "./contexts";

const Header = ({ title }) => {
  const { primaryColor } = useContext(ThemeContext);
  return <h1 style={{ color: primaryColor }}>{title}</h1>;
};

export default Header;
