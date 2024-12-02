import { Model, DataTypes } from 'sequelize';
import sequelize from '../database/sequelize.js';
import Repository from './repository.js';

export class Release extends Model { }

Release.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    version: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    publishedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    seenByUser: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    repositoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: 'CASCADE',
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    body: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    html_url: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'Release',
    tableName: 'releases',
    timestamps: true,
    underscored: true,
  }
);

// Define the inverse relationship
export default Release;
