import ButtonModalComponent from "@/components/layouts/modalComponents/ButtonModalComponent";
import CloseButtonModalComponent from "@/components/layouts/modalComponents/CloseButtonModalComponent";
import FeatureListItemComponent from "@/components/layouts/modalComponents/FeatureListItemComponent";
import PriceComponent from "@/components/layouts/modalComponents/PriceComponent";
import TextAndImageComponent from "@/components/layouts/modalComponents/TextAndImageComponent";

export const componentMap = {
  textandimage: TextAndImageComponent,
  price: PriceComponent,
  featureListItem:FeatureListItemComponent,
  button: ButtonModalComponent,
  closeButton: CloseButtonModalComponent
};