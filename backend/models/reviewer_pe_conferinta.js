import { sequelize } from '../sequelize.js';
import { DataTypes } from 'sequelize';

import Utilizator from "./utilizator.js";                   // import entitatea utilizator din acelasi sub folder
import Conferinta from "./conferinta.js";

const ReviewerPeConferinta = sequelize.define("Reviewer_pe_conferinta", {});

export default ReviewerPeConferinta;