import * as React from "react";
import Svg, { Path } from "react-native-svg";

function CloseIcon(props) {
  return (
    <Svg
      width={props.size || 32}
      height={props.size || 32}
      fill={props.color || "#000000"}
      viewBox="0 0 256 256"
      {...props}
    >
      <Path d="M208.49,191.51a12,12,0,0,1-17,17L128,145,64.49,208.49a12,12,0,0,1-17-17L111,128,47.51,64.49a12,12,0,0,1,17-17L128,111l63.51-63.52a12,12,0,0,1,17,17L145,128Z" />
    </Svg>
  );
}

export default CloseIcon;