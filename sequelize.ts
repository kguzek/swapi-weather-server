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
export class SWPerson extends Model {}
export class Weather extends Model {}

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

SWPerson.init(
  {
    name: { type: DataTypes.STRING, allowNull: false },
    birth_year: { type: DataTypes.STRING, allowNull: false },
    eye_color: { type: DataTypes.STRING, allowNull: false },
    gender: { type: DataTypes.STRING, allowNull: false },
    hair_color: { type: DataTypes.STRING, allowNull: false },
    height: { type: DataTypes.STRING, allowNull: false },
    mass: { type: DataTypes.STRING, allowNull: false },
    skin_color: { type: DataTypes.STRING, allowNull: false },
  },
  {
    sequelize,
    modelName: "SWPerson",
    tableName: "sw_people",
    timestamps: false,
  }
);

Weather.init(
  {
    longitude: { type: DataTypes.FLOAT, allowNull: false },
    latitude: { type: DataTypes.FLOAT, allowNull: false },
    weather_info: { type: DataTypes.STRING(32), allowNull: false },
    weather_description: { type: DataTypes.STRING(64), allowNull: false },
    weather_icon: { type: DataTypes.STRING(16), allowNull: false },
    temp: { field: "temperature", type: DataTypes.FLOAT, allowNull: false },
    feels_like: { type: DataTypes.FLOAT, allowNull: false },
    temp_min: { type: DataTypes.FLOAT, allowNull: false },
    temp_max: { type: DataTypes.FLOAT, allowNull: false },
    pressure: { type: DataTypes.INTEGER, allowNull: false },
    humidity: { type: DataTypes.INTEGER, allowNull: false },
    sea_level: { type: DataTypes.INTEGER, allowNull: true },
    grnd_level: { type: DataTypes.INTEGER, allowNull: true },
    visibility: { type: DataTypes.INTEGER, allowNull: false },
    wind_speed: { type: DataTypes.FLOAT, allowNull: false },
    wind_direction: { type: DataTypes.INTEGER, allowNull: false },
    wind_gust: { type: DataTypes.FLOAT, allowNull: true },
    clouds_all: { type: DataTypes.INTEGER, allowNull: false },
    rain_volume_1h: { type: DataTypes.FLOAT, allowNull: true },
    rain_volume_3h: { type: DataTypes.FLOAT, allowNull: true },
    snow_volume_1h: { type: DataTypes.FLOAT, allowNull: true },
    snow_volume_3h: { type: DataTypes.FLOAT, allowNull: true },
    data_calculation_time: { type: DataTypes.DATE, allowNull: false },
    country: { type: DataTypes.STRING, allowNull: false },
    sunrise: { type: DataTypes.DATE, allowNull: false },
    sunset: { type: DataTypes.DATE, allowNull: false },
    timezone: { type: DataTypes.INTEGER, allowNull: false },
    city_id: { type: DataTypes.INTEGER, allowNull: false },
    city_name: { type: DataTypes.STRING, allowNull: false },
  },
  {
    sequelize,
    modelName: "Weather",
    tableName: "weather",
    timestamps: false,
  }
);
