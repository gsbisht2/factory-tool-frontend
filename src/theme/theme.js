import { Button, Card, extendTheme } from "@chakra-ui/react";
import globalStyles from "./styles";
import { breakpoints } from "./foundation/breakpoints";
import CardComponent from "./additions/card/card";
import { badgeStyles } from "./components/badge";
// import { buttonStyles } from "./components/button";
import { inputStyles } from "./components/input";
import { linkStyles } from "./components/link";
import { progressStyles } from "./components/progress";
import { sliderStyles } from "./components/slider";
import { switchStyles } from "./components/switch";
import { textareaStyles } from "./components/textarea";
import { buttonStyles } from "./components/button";

export default extendTheme({
  ...globalStyles,
  ...breakpoints,
  components: {
    ...(badgeStyles?.components || {}),
    ...(inputStyles?.components || {}),
    ...(linkStyles?.components || {}),
    ...(progressStyles?.components || {}),
    ...(sliderStyles?.components || {}),
    ...(switchStyles?.components || {}),
    ...(textareaStyles?.components || {}),
    ...(buttonStyles?.components || {}),
    ...(CardComponent?.components || {}),
  },
});
