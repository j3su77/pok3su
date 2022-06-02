import { FC } from "react";
import { TYPE_COLOR } from "../../database/constants";

import styles from "./cardType.module.css";

interface Props {
  type: string;
}

export const CardType: FC<Props> = ({ type }) => {
  const colorType = TYPE_COLOR.typesPokemon.filter((typ) => typ.type === type);
  const color = colorType.map((co) => co["color"]);
  const esp = colorType.map((co) => co["esp"]);

  return (
    <div style={{ backgroundColor: `${color}` }} className={styles.card__type}>
      {esp}
    </div>
  );
};
