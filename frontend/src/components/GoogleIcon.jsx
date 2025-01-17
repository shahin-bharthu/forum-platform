import { Icon } from "@mui/material";
import google from "../assets/search.png";

export default function Logo() {
  return (
    <Icon>
      <img src={google} height={18} width={18} style={{ display: 'block' }}/>
    </Icon>
  );
}