import * as Yup from 'yup';
import Appointment from '../models/Appointment';
import User from '../models/User';

class AppointmentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation fails' });
    }

    /**
     * check if provider_is a provider
     */
    const { provider_id, date } = req.body;

    const isprovider = await User.findOne({
      where: {
        id: provider_id,
        provider: true,
      },
    });
    if (!isprovider) {
      return res
        .status(401)
        .json({ error: 'Campo providers_id com provider inválido!' });
    }

    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date,
    });

    return res.json(appointment);
  }
}

export default new AppointmentController();