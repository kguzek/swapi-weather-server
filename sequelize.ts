import { DataTypes, Model, Sequelize } from "sequelize";
import { v4 as uuidv4 } from "uuid";

// Initialise Sequelize
const sequelize = new Sequelize(
  process.env.MY_SQL_DB_NAME ?? "",
  process.env.MY_SQL_DB_USER ?? "",
  process.env.MY_SQL_DB_PASSWORD ?? "",
  {
    host: process.env.MY_SQL_DB_HOST ?? "",
    dialect: "mysql",
  }
);

export class User extends Model {}

User.init(
  {
    uuid: {
      type: DataTypes.UUIDV4,
      // Automatically generate UUIDs
      defaultValue: uuidv4,
      allowNull: false,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    salt: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    // Rename properties to match database columns
    createdAt: "created_at",
    updatedAt: "modified_at",
  }
);
