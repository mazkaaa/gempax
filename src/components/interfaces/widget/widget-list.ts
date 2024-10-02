import { WIDGET_TYPE_INTERFACE } from "./widget-type";

export interface WIDGET_LIST_INTERFACE extends WIDGET_TYPE_INTERFACE {
  label: string;
  value: string | number | null;
}
