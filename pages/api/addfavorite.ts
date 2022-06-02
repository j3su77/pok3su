import type { NextApiRequest, NextApiResponse } from "next";
import { isValidObjectId } from "mongoose";

import { db } from "../../database";
import { IUser } from "../../interfaces";
import { User } from "../../models";

type Data = { message: string } | IUser[] | IUser;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "POST":
      return getPomemonFav(req, res);

    case "PUT":
      return updateProduct(req, res);

    default:
      return res.status(401).json({ message: "Bad request" });
  }
}

const getPomemonFav = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

  const { emailUser = "" } = req.body;
  console.log({ api_id: emailUser });

  if (emailUser.length <= 0) {
    return res.status(400).json({ message: "El email  no es válido" });
  }

  await db.connect();

  const user = await User.findOne({email: emailUser}).lean();
  console.log(user)

  await db.disconnect();

  res.status(200).json(JSON.parse(JSON.stringify(user?.pokeFavorites)));
};









const updateProduct = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const { _id = "", num = "" } = req.body;
  console.log({ api_id: _id });

  if (!isValidObjectId(_id)) {
    return res.status(400).json({ message: "El id del user no es válido" });
  }

  let userPokemon = [];

  try {
    await db.connect();
    const user = await User.findById(_id);
    if (!user) {
      await db.disconnect();
      return res
        .status(400)
        .json({ message: "No existe un usuario con ese ID" });
    }

    userPokemon = user?.pokeFavorites;
    if (userPokemon.includes(Number(num))) {
      const index = userPokemon.indexOf(num);
      userPokemon.splice(index, 1);
    } else {
      userPokemon.push(Number(num));
    }

    const ordenNum = userPokemon.sort(function (a, b) {
      return a - b;
    });

    await user.updateOne({ $set: { pokeFavorites: ordenNum } });
    await db.disconnect();

    console.log({ updateFavorites: user.pokeFavorites });

    return res.status(200).json(JSON.parse(JSON.stringify(user.pokeFavorites)));
  } catch (error) {
    console.log(error);
    await db.disconnect();
    return res
      .status(400)
      .json({ message: "Revisar la consola del servidor *favorites" });
  }
};
