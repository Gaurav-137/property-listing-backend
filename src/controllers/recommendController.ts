import Recommendation from '../models/Recommendation';
import User from '../models/User';

export const recommendProperty = async (req: any, res: any) => {
  const { email, propertyId } = req.body;
  const recipient = await User.findOne({ email });
  if (!recipient) return res.status(404).json({ msg: 'Recipient not found' });

  const recom = await Recommendation.create({
    from: req.user.id,
    to: recipient._id,
    property: propertyId
  });

  res.status(201).json(recom);
};

export const getReceivedRecommendations = async (req: any, res: any) => {
  const recoms = await Recommendation.find({ to: req.user.id }).populate('property from');
  res.json(recoms);
};