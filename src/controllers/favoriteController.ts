import Favorite from '../models/Favorite';

export const addFavorite = async (req: any, res: any) => {
  const fav = await Favorite.create({
    user: req.user.id,
    property: req.body.propertyId
  });
  res.status(201).json(fav);
};

export const getFavorites = async (req: any, res: any) => {
  const favs = await Favorite.find({ user: req.user.id }).populate('property');
  res.json(favs);
};

export const removeFavorite = async (req: any, res: any) => {
  await Favorite.findOneAndDelete({ user: req.user.id, property: req.params.id });
  res.json({ msg: 'Removed from favorites' });
};