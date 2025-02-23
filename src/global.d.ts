declare module "*.svg?solid" {
  import { Component, ComponentProps } from "solid-js";
  type SVGComponentProps = ComponentProps<"svg"> & {
    width?: ComponentProps<"svg">["width"] | null;
    height?: ComponentProps<"svg">["height"] | null;
  };
  const content: Component<SVGComponentProps>;
  export default content;
}
