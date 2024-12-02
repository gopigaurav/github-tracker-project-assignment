import { Model, DataTypes } from 'sequelize';
import sequelize from '../database/sequelize.js';
import { Release } from './release.js'
export class Repository extends Model { }

// Initialize Repository model
Repository.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    tracked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW, 
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW, 
    },
  },
  {
    paranoid: false,
    sequelize,
    modelName: 'Repository',
    tableName: 'repositories', 
    timestamps: true,
    underscored: true,
  }
);

Repository.hasMany(Release, { foreignKey: 'repositoryId' });

export default Repository;
